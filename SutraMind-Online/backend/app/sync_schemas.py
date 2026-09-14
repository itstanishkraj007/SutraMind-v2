"""Pydantic models for the bi-directional sync protocol between Desktop and Server."""

from datetime import datetime

from pydantic import BaseModel, Field


# ── Push (Desktop → Server) ──────────────────────────────────────────

class SyncOperation(BaseModel):
    """One outbox operation from the desktop client."""
    operation_id: str = Field(description="UUID of the OutboxOperation row")
    entity_type: str = Field(description="Domain entity name, e.g. Participant, Visit")
    entity_id: str = Field(description="UUID primary key of the entity")
    operation: str = Field(description="Create | Update | Delete")
    payload_json: str = Field(description="Full JSON snapshot of the entity at time of write")
    occurred_at_utc: datetime = Field(description="Timestamp when the local change happened")
    actor_user_id: str | None = Field(default=None, description="UUID of the user who made the change")
    device_id: str | None = Field(default=None, description="UUID identifying the desktop device")


class SyncPushRequest(BaseModel):
    """Batch of outbox operations sent by the desktop."""
    operations: list[SyncOperation] = Field(min_length=1, max_length=500)


class ConflictResult(BaseModel):
    """Reported when last-write-wins detects a newer server version."""
    operation_id: str
    entity_type: str
    entity_id: str
    reason: str


class RejectedResult(BaseModel):
    """Reported when an operation could not be applied (e.g. invalid FK)."""
    operation_id: str
    entity_type: str
    entity_id: str
    reason: str


class SyncPushResponse(BaseModel):
    """Response after processing a push batch."""
    applied: list[str] = Field(default_factory=list, description="operation_ids that were committed")
    conflicts: list[ConflictResult] = Field(default_factory=list)
    rejected: list[RejectedResult] = Field(default_factory=list)
    server_cursor: int = Field(description="Current max server_version after this push")
    timestamp: str


# ── Pull (Server → Desktop) ──────────────────────────────────────────

class EntityChange(BaseModel):
    """A single entity record serialized for the desktop to merge."""
    entity_id: str
    payload: dict
    server_version: int
    updated_at: str


class SyncPullResponse(BaseModel):
    """All changes since the supplied cursor, grouped by entity type."""
    changes: dict[str, list[EntityChange]] = Field(
        default_factory=dict,
        description="Keyed by entity type name, e.g. {'Participant': [...], 'Visit': [...]}"
    )
    cursor: int = Field(description="New cursor (max server_version seen). Pass this on next pull.")
    timestamp: str
