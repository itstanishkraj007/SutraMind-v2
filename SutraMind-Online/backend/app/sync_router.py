"""
Bi-directional sync API — push (Desktop→Server) and pull (Server→Desktop).

Push: receives OutboxOperation batches, applies them with last-write-wins conflict resolution.
Pull: returns all entity changes since a cursor (server_version), enabling the desktop to catch up.
"""

import json
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import (
    AyurvedaBaseline,
    CRF,
    DataQuery,
    EthicsReview,
    MasterTerm,
    Medicine,
    Participant,
    Protocol,
    Site,
    Study,
    StudyMembership,
    User,
    Visit,
)
from app.sync_schemas import (
    ConflictResult,
    EntityChange,
    RejectedResult,
    SyncOperation,
    SyncPullResponse,
    SyncPushRequest,
    SyncPushResponse,
)


router = APIRouter(prefix="/api/v1/sync", tags=["sync"])


# ── Entity-type registry ─────────────────────────────────────────────
# Maps the Desktop's EntityType string → (SQLAlchemy model, list of field mappings)

ENTITY_MAP: dict[str, type] = {
    "Participant": Participant,
    "AyurvedaBaseline": AyurvedaBaseline,
    "Visit": Visit,
    "Crf": CRF,
    "CRF": CRF,
    "DataQuery": DataQuery,
    "Study": Study,
    "Site": Site,
    "Protocol": Protocol,
    "EthicsReview": EthicsReview,
    "MasterTerm": MasterTerm,
    "Medicine": Medicine,
    "User": User,
    "StudyMembership": StudyMembership,
}

# Desktop C# PascalCase → Server Python snake_case field mapping per entity.
# Only fields that differ in casing/naming need explicit mapping.
FIELD_MAP: dict[str, dict[str, str]] = {
    "Participant": {
        "Id": "id",
        "ParticipantCode": "participant_code",
        "StudyId": "study_id",
        "SiteId": "site_id",
        "Name": "name",
        "Age": "age",
        "Gender": "gender",
        "ModernDiagnosis": "modern_diagnosis",
        "VyadhiCode": "vyadhi_code",
        "DiseaseDurationMonths": "disease_duration_months",
        "RandomizationId": "randomization_id",
        "EnrollmentDate": "enrollment_date",
        "Status": "status",
        "CreatedBy": "created_by",
        "CreatedAtUtc": "created_at",
        "UpdatedAtUtc": "updated_at",
    },
    "AyurvedaBaseline": {
        "Id": "id",
        "ParticipantId": "participant_id",
        "PrakritiCode": "prakriti_code",
        "VikritiNotes": "vikriti_notes",
        "AgniCode": "agni_code",
        "BalaCode": "bala_code",
        "SatvaCode": "satva_code",
        "RecordedBy": "recorded_by",
        "RecordedAtUtc": "recorded_at",
        "CreatedAtUtc": "created_at",
        "UpdatedAtUtc": "updated_at",
    },
    "Visit": {
        "Id": "id",
        "ParticipantId": "participant_id",
        "VisitNumber": "visit_number",
        "VisitDate": "visit_date",
        "ScheduledDate": "scheduled_date",
        "NextVisitDate": "next_visit_date",
        "Status": "status",
        "InvestigatorId": "investigator_id",
        "CreatedBy": "created_by",
        "CreatedAtUtc": "created_at",
        "UpdatedAtUtc": "updated_at",
    },
    "Crf": {
        "Id": "id",
        "VisitId": "visit_id",
        "SystolicBp": "systolic_bp",
        "DiastolicBp": "diastolic_bp",
        "PulseBpm": "pulse_bpm",
        "WeightKg": "weight_kg",
        "TemperatureC": "temperature_c",
        "AgniCode": "agni_code",
        "BalaCode": "bala_code",
        "Symptoms": "symptoms",
        "MedicineId": "medicine_id",
        "Dose": "dose",
        "Frequency": "frequency",
        "Compliance": "compliance",
        "Remarks": "remarks",
        "CompletionStatus": "completion_status",
        "CompletedBy": "completed_by",
        "CompletedAtUtc": "completed_at",
        "CreatedAtUtc": "created_at",
        "UpdatedAtUtc": "updated_at",
    },
    "DataQuery": {
        "Id": "id",
        "StudyId": "study_id",
        "TargetType": "target_type",
        "TargetId": "target_id",
        "FieldName": "field_name",
        "Message": "message",
        "Status": "status",
        "RaisedBy": "raised_by",
        "RaisedAtUtc": "raised_at",
        "Answer": "answer",
        "AnsweredBy": "answered_by",
        "AnsweredAtUtc": "answered_at",
        "ClosedBy": "closed_by",
        "ClosedAtUtc": "closed_at",
        "CreatedAtUtc": "created_at",
        "UpdatedAtUtc": "updated_at",
    },
    "Study": {
        "Id": "id",
        "StudyCode": "study_code",
        "Title": "title",
        "ShortTitle": "short_title",
        "PrincipalInvestigatorId": "pi_id",
        "Institution": "institution",
        "TrialPhase": "trial_phase",
        "SampleSize": "sample_size",
        "StartDate": "start_date",
        "EndDate": "end_date",
        "Status": "status",
        "CtriNumber": "ctri_number",
        "CreatedAtUtc": "created_at",
        "UpdatedAtUtc": "updated_at",
    },
    "Site": {
        "Id": "id",
        "StudyId": "study_id",
        "SiteCode": "site_code",
        "Name": "name",
        "Address": "address",
        "IsActive": "is_active",
        "CreatedAtUtc": "created_at",
        "UpdatedAtUtc": "updated_at",
    },
    "Protocol": {
        "Id": "id",
        "StudyId": "study_id",
        "Version": "version",
        "IsActive": "is_active",
        "ModernDiagnosis": "modern_diagnosis",
        "VyadhiCode": "vyadhi_code",
        "InterventionName": "intervention_name",
        "MedicineId": "medicine_id",
        "DosageFormCode": "dosage_form_code",
        "AnupanaCode": "anupana_code",
        "TreatmentDurationDays": "treatment_duration_days",
        "Summary": "summary",
        "CreatedAtUtc": "created_at",
        "UpdatedAtUtc": "updated_at",
    },
    "EthicsReview": {
        "Id": "id",
        "StudyId": "study_id",
        "IecNumber": "iec_number",
        "Status": "status",
        "ApprovalDate": "approval_date",
        "ExpiryDate": "expiry_date",
        "Remarks": "remarks",
        "UpdatedBy": "updated_by",
        "CreatedAtUtc": "created_at",
        "UpdatedAtUtc": "updated_at",
    },
    "MasterTerm": {
        "Id": "id",
        "Category": "category",
        "Code": "code",
        "LabelEn": "label_en",
        "LabelHi": "label_hi",
        "ModernMappingEn": "modern_mapping_en",
        "Active": "active",
        "SortOrder": "sort_order",
        "CreatedAtUtc": "created_at",
        "UpdatedAtUtc": "updated_at",
    },
    "Medicine": {
        "Id": "id",
        "MedicineCode": "medicine_code",
        "AyurvedaName": "ayurveda_name",
        "DosageFormCode": "dosage_form_code",
        "WhoDrugCode": "whodrug_code",
        "IsActive": "is_active",
        "CreatedAtUtc": "created_at",
        "UpdatedAtUtc": "updated_at",
    },
}


# ── Helpers ───────────────────────────────────────────────────────────

def _next_server_version(db: Session) -> int:
    """Return a globally monotonic server_version for the current transaction."""
    # We scan the maximum across ALL syncable tables and add 1.
    # For production-scale, replace with a Postgres SEQUENCE.
    max_versions = []
    for model_cls in set(ENTITY_MAP.values()):
        if hasattr(model_cls, "server_version"):
            val = db.scalar(select(func.max(model_cls.server_version)))
            if val is not None:
                max_versions.append(val)
    return (max(max_versions) if max_versions else 0) + 1


def _map_payload(entity_type: str, payload: dict) -> dict:
    """Convert a Desktop PascalCase payload to server snake_case columns."""
    mapping = FIELD_MAP.get(entity_type)
    if not mapping:
        # Fallback: simple snake_case conversion
        return {_pascal_to_snake(k): v for k, v in payload.items()}

    result = {}
    for pascal_key, value in payload.items():
        snake_key = mapping.get(pascal_key)
        if snake_key:
            result[snake_key] = value
        else:
            # Try a simple conversion for unmapped fields
            result[_pascal_to_snake(pascal_key)] = value
    return result


def _pascal_to_snake(name: str) -> str:
    """Convert PascalCase/camelCase to snake_case."""
    import re
    s = re.sub(r"([A-Z])", r"_\1", name).lower().lstrip("_")
    return s


def _entity_to_dict(entity) -> dict:
    """Serialize an SQLAlchemy model instance to a plain dict (for pull responses)."""
    result = {}
    for col in entity.__table__.columns:
        value = getattr(entity, col.name, None)
        if isinstance(value, datetime):
            value = value.isoformat()
        elif hasattr(value, "isoformat"):
            value = value.isoformat()
        result[col.name] = value
    return result


def _parse_payload_json(payload_json: str) -> dict:
    """Parse the payload JSON string, handling both raw dicts and C#-serialized JSON."""
    data = json.loads(payload_json)
    if isinstance(data, str):
        # Double-encoded JSON from C# serializer
        data = json.loads(data)
    return data


def _coerce_status_enums(entity_type: str, data: dict) -> dict:
    """Normalize C# enum values (e.g., 'Draft' → 'DRAFT') to match Python model expectations."""
    status_fields = {"status", "completion_status", "target_type"}
    for field in status_fields:
        if field in data and data[field] is not None:
            val = str(data[field])
            # C# enums may be PascalCase or numeric
            if val.isdigit():
                continue  # numeric enums need a lookup table per type; skip for now
            data[field] = val.upper()
    return data


def _coerce_column_types(model_cls: type, data: dict) -> dict:
    """
    Convert string values to the correct Python types based on SQLAlchemy column definitions.
    Handles Date, DateTime, Integer, Float, Boolean columns.
    """
    from datetime import date
    from sqlalchemy import Date, DateTime, Integer, Float, Boolean, BigInteger

    column_type_map = {}
    for col in model_cls.__table__.columns:
        column_type_map[col.name] = type(col.type)

    coerced = {}
    for key, value in data.items():
        col_type = column_type_map.get(key)
        if value is None or col_type is None:
            coerced[key] = value
            continue

        try:
            if col_type is Date and isinstance(value, str):
                # Handle ISO date strings like "2026-09-01" or "2026-09-01T00:00:00"
                coerced[key] = date.fromisoformat(value.split("T")[0])
            elif col_type is DateTime and isinstance(value, str):
                value = value.replace("Z", "+00:00")
                dt = datetime.fromisoformat(value)
                coerced[key] = dt.replace(tzinfo=None) if dt.tzinfo else dt
            elif col_type in (Integer, BigInteger) and isinstance(value, str):
                coerced[key] = int(value)
            elif col_type is Float and isinstance(value, str):
                coerced[key] = float(value)
            elif col_type is Boolean and isinstance(value, str):
                coerced[key] = value.lower() in ("true", "1", "yes")
            else:
                coerced[key] = value
        except (ValueError, TypeError):
            coerced[key] = value

    return coerced


# ── PUSH endpoint ────────────────────────────────────────────────────

@router.post("/push", response_model=SyncPushResponse)
def sync_push(
    request: SyncPushRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> SyncPushResponse:
    """
    Receive a batch of OutboxOperations from the Desktop app.
    Apply each using last-write-wins conflict resolution.
    """
    applied: list[str] = []
    conflicts: list[ConflictResult] = []
    rejected: list[RejectedResult] = []

    for op in request.operations:
        try:
            _process_operation(db, op, applied, conflicts, rejected)
        except Exception as exc:
            db.rollback()
            rejected.append(RejectedResult(
                operation_id=op.operation_id,
                entity_type=op.entity_type,
                entity_id=op.entity_id,
                reason=str(exc)[:500],
            ))

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Transaction failed: {exc}",
        ) from exc

    # Get the current max server_version as the cursor
    cursor = 0
    for model_cls in set(ENTITY_MAP.values()):
        if hasattr(model_cls, "server_version"):
            val = db.scalar(select(func.max(model_cls.server_version)))
            if val is not None and val > cursor:
                cursor = val

    return SyncPushResponse(
        applied=applied,
        conflicts=conflicts,
        rejected=rejected,
        server_cursor=cursor,
        timestamp=datetime.utcnow().isoformat(),
    )


def _process_operation(
    db: Session,
    op: SyncOperation,
    applied: list[str],
    conflicts: list[ConflictResult],
    rejected: list[RejectedResult],
) -> None:
    """Process a single sync operation with last-write-wins."""
    # Resolve the model class
    entity_type_key = op.entity_type
    model_cls = ENTITY_MAP.get(entity_type_key)
    if not model_cls:
        rejected.append(RejectedResult(
            operation_id=op.operation_id,
            entity_type=op.entity_type,
            entity_id=op.entity_id,
            reason=f"Unknown entity type: {op.entity_type}",
        ))
        return

    # Parse and map the payload
    try:
        raw_payload = _parse_payload_json(op.payload_json)
    except (json.JSONDecodeError, TypeError) as exc:
        rejected.append(RejectedResult(
            operation_id=op.operation_id,
            entity_type=op.entity_type,
            entity_id=op.entity_id,
            reason=f"Invalid payload JSON: {exc}",
        ))
        return

    mapped_data = _map_payload(entity_type_key, raw_payload)
    mapped_data = _coerce_status_enums(entity_type_key, mapped_data)

    # Ensure the entity_id is set correctly
    mapped_data["id"] = op.entity_id

    # Remove sync-only fields that don't exist on the server model
    for key in ["sync_state", "server_version_field", "source_device_id", "last_modified_by"]:
        mapped_data.pop(key, None)

    next_version = _next_server_version(db)

    operation = op.operation.strip().capitalize()

    if operation == "Create":
        _handle_create(db, model_cls, mapped_data, op, next_version, applied, conflicts, rejected)
    elif operation == "Update":
        _handle_update(db, model_cls, mapped_data, op, next_version, applied, conflicts, rejected)
    elif operation == "Delete":
        _handle_delete(db, model_cls, op, next_version, applied, rejected)
    else:
        rejected.append(RejectedResult(
            operation_id=op.operation_id,
            entity_type=op.entity_type,
            entity_id=op.entity_id,
            reason=f"Unknown operation: {op.operation}",
        ))


def _handle_create(
    db: Session, model_cls: type, data: dict, op: SyncOperation,
    next_version: int, applied: list, conflicts: list, rejected: list,
) -> None:
    """Insert a new record, or skip if UUID already exists (idempotent)."""
    existing = db.get(model_cls, op.entity_id)
    if existing:
        # Already exists — treat as update with last-write-wins
        _handle_update(db, model_cls, data, op, next_version, applied, conflicts, rejected)
        return

    # Filter data to only include columns that exist on the model
    valid_columns = {col.name for col in model_cls.__table__.columns}
    filtered_data = {k: v for k, v in data.items() if k in valid_columns}
    filtered_data["server_version"] = next_version

    # Coerce string values to proper Python types (date, datetime, int, etc.)
    filtered_data = _coerce_column_types(model_cls, filtered_data)

    # Set timestamps
    if "updated_at" not in filtered_data or filtered_data["updated_at"] is None:
        filtered_data["updated_at"] = datetime.utcnow()
    if "created_at" not in filtered_data or filtered_data["created_at"] is None:
        filtered_data["created_at"] = datetime.utcnow()

    try:
        entity = model_cls(**filtered_data)
        db.add(entity)
        db.flush()
        applied.append(op.operation_id)
    except (IntegrityError, TypeError) as exc:
        db.rollback()
        rejected.append(RejectedResult(
            operation_id=op.operation_id,
            entity_type=op.entity_type,
            entity_id=op.entity_id,
            reason=f"Create failed: {exc}",
        ))


def _handle_update(
    db: Session, model_cls: type, data: dict, op: SyncOperation,
    next_version: int, applied: list, conflicts: list, rejected: list,
) -> None:
    """Update an existing record using last-write-wins on updated_at."""
    existing = db.get(model_cls, op.entity_id)
    if not existing:
        # Record doesn't exist on server — create instead
        _handle_create(db, model_cls, data, op, next_version, applied, conflicts, rejected)
        return

    # Last-write-wins: compare timestamps
    server_updated = getattr(existing, "updated_at", None)
    client_updated_str = data.get("updated_at")

    if server_updated and client_updated_str:
        try:
            if isinstance(client_updated_str, str):
                # Parse ISO datetime, handling various formats
                client_updated_str = client_updated_str.replace("Z", "+00:00")
                client_updated = datetime.fromisoformat(client_updated_str)
                if client_updated.tzinfo:
                    client_updated = client_updated.replace(tzinfo=None)
            else:
                client_updated = client_updated_str

            if server_updated > client_updated:
                # Server has a newer version — client loses
                conflicts.append(ConflictResult(
                    operation_id=op.operation_id,
                    entity_type=op.entity_type,
                    entity_id=op.entity_id,
                    reason=f"Server record is newer (server={server_updated.isoformat()}, client={client_updated.isoformat()})",
                ))
                return
        except (ValueError, TypeError):
            pass  # If we can't parse, proceed with the update

    # Apply the update
    valid_columns = {col.name for col in model_cls.__table__.columns}
    coerced_data = _coerce_column_types(model_cls, {k: v for k, v in data.items() if k in valid_columns})
    for key, value in coerced_data.items():
        if key != "id":
            setattr(existing, key, value)

    existing.server_version = next_version
    existing.updated_at = datetime.utcnow()
    db.flush()
    applied.append(op.operation_id)


def _handle_delete(
    db: Session, model_cls: type, op: SyncOperation,
    next_version: int, applied: list, rejected: list,
) -> None:
    """Soft-delete: deactivate the record if it has an is_active field, else skip."""
    existing = db.get(model_cls, op.entity_id)
    if not existing:
        # Already gone — idempotent
        applied.append(op.operation_id)
        return

    if hasattr(existing, "is_active"):
        existing.is_active = False
        existing.server_version = next_version
        existing.updated_at = datetime.utcnow()
        db.flush()
        applied.append(op.operation_id)
    elif hasattr(existing, "status"):
        existing.status = "WITHDRAWN"
        existing.server_version = next_version
        existing.updated_at = datetime.utcnow()
        db.flush()
        applied.append(op.operation_id)
    else:
        rejected.append(RejectedResult(
            operation_id=op.operation_id,
            entity_type=op.entity_type,
            entity_id=op.entity_id,
            reason="Entity type does not support deletion",
        ))


# ── PULL endpoint ────────────────────────────────────────────────────

# Which entity types to include in a pull response
PULLABLE_ENTITIES: list[tuple[str, type]] = [
    ("Participant", Participant),
    ("AyurvedaBaseline", AyurvedaBaseline),
    ("Visit", Visit),
    ("CRF", CRF),
    ("DataQuery", DataQuery),
    ("Study", Study),
    ("Site", Site),
    ("Protocol", Protocol),
    ("EthicsReview", EthicsReview),
    ("MasterTerm", MasterTerm),
    ("Medicine", Medicine),
    ("User", User),
    ("StudyMembership", StudyMembership),
]


@router.get("/pull", response_model=SyncPullResponse)
def sync_pull(
    cursor: int = Query(default=0, ge=0, description="server_version cursor from the last pull"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> SyncPullResponse:
    """
    Return all entity changes where server_version > cursor.
    Results are grouped by entity type for the Desktop to merge locally.
    """
    changes: dict[str, list[EntityChange]] = {}
    max_version = cursor

    for entity_name, model_cls in PULLABLE_ENTITIES:
        if not hasattr(model_cls, "server_version"):
            continue

        # On first pull (cursor=0), include all records including those at version 0
        version_filter = model_cls.server_version >= cursor if cursor == 0 else model_cls.server_version > cursor
        rows = db.scalars(
            select(model_cls)
            .where(version_filter)
            .order_by(model_cls.server_version.asc())
        ).all()

        if not rows:
            continue

        entity_changes = []
        for row in rows:
            row_dict = _entity_to_dict(row)
            sv = row_dict.get("server_version", 0)
            if sv > max_version:
                max_version = sv

            entity_changes.append(EntityChange(
                entity_id=str(row_dict.get("id", "")),
                payload=row_dict,
                server_version=sv,
                updated_at=str(row_dict.get("updated_at", "")),
            ))

        changes[entity_name] = entity_changes

    return SyncPullResponse(
        changes=changes,
        cursor=max_version,
        timestamp=datetime.utcnow().isoformat(),
    )
