import pytest
from datetime import date, timedelta
from tests.conftest import auth_headers, login


# -----------------------------------------------------------------------------
# 1. Authentication Tests
# -----------------------------------------------------------------------------
def test_login_success_all_roles(client):
    roles = [
        "admin@sutramind.local",
        "pi@sutramind.local",
        "coordinator@sutramind.local",
        "monitor@sutramind.local",
        "ethics@sutramind.local",
        "pv@sutramind.local",
    ]
    for email in roles:
        token = login(client, email)
        assert token
        res = client.get("/api/v1/auth/me", headers=auth_headers(token))
        assert res.status_code == 200
        assert res.json()["data"]["email"] == email


def test_login_invalid_password(client):
    res = client.post("/api/v1/auth/login", json={"email": "pi@sutramind.local", "password": "WrongPassword"})
    assert res.status_code == 401
    assert "Invalid email or password" in res.json()["detail"]


def test_login_unknown_user(client):
    res = client.post("/api/v1/auth/login", json={"email": "unknown@sutramind.local", "password": "Demo@123"})
    assert res.status_code == 401


# -----------------------------------------------------------------------------
# 2. RBAC Permissions Matrix Tests
# -----------------------------------------------------------------------------
def test_coordinator_forbidden_to_create_study(client):
    token = login(client, "coordinator@sutramind.local")
    res = client.post(
        "/api/v1/studies",
        headers=auth_headers(token),
        json={
            "study_code": "FORBIDDEN-001",
            "title": "Unauthorized Study",
            "institution": "Test Inst",
            "sample_size": 50,
            "start_date": "2026-09-01",
            "end_date": "2026-12-01",
            "protocol": {
                "version": "1.0",
                "modern_diagnosis": "Arthritis",
                "vyadhi_code": "V001",
                "intervention_name": "Guggulu",
                "dosage_form_code": "DF01",
                "anupana_code": "AN01",
                "treatment_duration_days": 60
            },
            "ethics": {"iec_number": "IEC-001", "status": "PENDING"},
            "sites": [{"site_code": "SITE-A", "name": "Site A"}]
        }
    )
    assert res.status_code == 403


def test_monitor_forbidden_to_edit_crf(client):
    token = login(client, "monitor@sutramind.local")
    res = client.post(
        "/api/v1/crfs",
        headers=auth_headers(token),
        json={
            "visit_id": "dummy-visit-id",
            "visit_date": "2026-09-01",
            "completion_status": "DRAFT"
        }
    )
    assert res.status_code == 403


def test_ethics_forbidden_to_read_participants(client):
    token = login(client, "ethics@sutramind.local")
    res = client.get("/api/v1/participants", headers=auth_headers(token))
    assert res.status_code == 403


# -----------------------------------------------------------------------------
# 3. Clinical Workflow: Study Setup, Participant Enrollment & Baseline
# -----------------------------------------------------------------------------
def test_pi_create_study_and_protocol(client):
    pi_token = login(client, "pi@sutramind.local")
    study_payload = {
        "study_code": "PRATISHYAYA-001",
        "title": "Ayurvedic Management of Pratishyaya",
        "short_title": "Pratishyaya Trial",
        "institution": "National Institute of Ayurveda",
        "trial_phase": "Phase II",
        "sample_size": 60,
        "start_date": str(date.today()),
        "end_date": str(date.today() + timedelta(days=90)),
        "protocol": {
            "version": "1.0",
            "modern_diagnosis": "Allergic Rhinitis",
            "vyadhi_code": "V003",
            "intervention_name": "Haridra Khanda",
            "dosage_form_code": "DF03",
            "anupana_code": "AN01",
            "treatment_duration_days": 60,
            "summary": "Clinical trial on Haridra Khanda in Pratishyaya."
        },
        "ethics": {
            "iec_number": "NIA-IEC-2026-04",
            "status": "APPROVED",
            "approval_date": str(date.today() - timedelta(days=10)),
            "expiry_date": str(date.today() + timedelta(days=350)),
            "remarks": "Ethical clearance granted."
        },
        "sites": [{"site_code": "NIA-JAIPUR", "name": "NIA Jaipur Hospital"}]
    }
    res = client.post("/api/v1/studies", headers=auth_headers(pi_token), json=study_payload)
    assert res.status_code == 201
    data = res.json()["data"]
    assert data["study_code"] == "PRATISHYAYA-001"
    assert data["protocol"]["vyadhi_code"] == "V003"
    assert data["protocol"]["dosage_form_code"] == "DF03"


def test_coordinator_enroll_participant_with_baseline(client):
    # Retrieve AMAVATA-001 site
    pi_token = login(client, "pi@sutramind.local")
    studies = client.get("/api/v1/studies", headers=auth_headers(pi_token)).json()["data"]
    amavata = next(s for s in studies if s["study_code"] == "AMAVATA-001")
    study_detail = client.get(f"/api/v1/studies/{amavata["id"]}", headers=auth_headers(pi_token)).json()["data"]
    site_id = study_detail["sites"][0]["id"]

    coord_token = login(client, "coordinator@sutramind.local")
    enroll_payload = {
        "study_id": amavata["id"],
        "site_id": site_id,
        "participant_code": "AMV-101",
        "name": "Suresh Kumar",
        "age": 48,
        "gender": "MALE",
        "modern_diagnosis": "Rheumatoid Arthritis",
        "vyadhi_code": "V001",
        "disease_duration_months": 18,
        "randomization_id": "R-101",
        "enrollment_date": str(date.today()),
        "baseline": {
            "prakriti_code": "P6",
            "agni_code": "A2",
            "bala_code": "B2",
            "satva_code": "S2",
            "vikriti_notes": "Morning joint stiffness present in bilateral knees."
        }
    }
    res = client.post("/api/v1/participants", headers=auth_headers(coord_token), json=enroll_payload)
    assert res.status_code == 201
    participant = res.json()["data"]
    assert participant["participant_code"] == "AMV-101"
    assert participant["baseline"]["prakriti_code"] == "P6"
    assert participant["baseline"]["agni_code"] == "A2"

    # Verify duplicate participant code fails
    res_dup = client.post("/api/v1/participants", headers=auth_headers(coord_token), json=enroll_payload)
    assert res_dup.status_code == 409


# -----------------------------------------------------------------------------
# 4. Visit Scheduling & Digital CRF Workflow
# -----------------------------------------------------------------------------
def test_visit_and_crf_lifecycle(client):
    coord_token = login(client, "coordinator@sutramind.local")
    participants = client.get("/api/v1/participants", headers=auth_headers(coord_token)).json()["data"]
    subject = next(p for p in participants if p["participant_code"] == "AMV-101")

    # 1. Schedule Visit 1
    visit_res = client.post(
        "/api/v1/visits",
        headers=auth_headers(coord_token),
        json={
            "participant_id": subject["id"],
            "visit_number": 1,
            "scheduled_date": str(date.today()),
        }
    )
    assert visit_res.status_code == 201
    visit = visit_res.json()["data"]
    assert visit["visit_number"] == 1
    assert visit["status"] == "SCHEDULED"

    # 2. Save Draft CRF
    medicines = client.get("/api/v1/medicines", headers=auth_headers(coord_token)).json()["data"]
    med_id = medicines[0]["id"]
    crf_draft = {
        "visit_id": visit["id"],
        "visit_date": str(date.today()),
        "systolic_bp": 120,
        "diastolic_bp": 80,
        "pulse_bpm": 72,
        "weight_kg": 68.5,
        "temperature_c": 36.6,
        "agni_code": "A1",
        "bala_code": "B2",
        "symptoms": "Mild stiffness on waking.",
        "medicine_id": med_id,
        "dose": "500 mg",
        "frequency": "BD",
        "compliance": "YES",
        "remarks": "Draft initial visit entry",
        "completion_status": "DRAFT"
    }
    crf_res = client.post("/api/v1/crfs", headers=auth_headers(coord_token), json=crf_draft)
    assert crf_res.status_code == 201
    crf = crf_res.json()["data"]
    assert crf["completion_status"] == "DRAFT"

    # 3. Complete CRF
    crf_complete_payload = dict(crf_draft)
    crf_complete_payload["completion_status"] = "COMPLETED"
    update_res = client.patch(f"/api/v1/crfs/{crf["id"]}", headers=auth_headers(coord_token), json=crf_complete_payload)
    assert update_res.status_code == 200
    assert update_res.json()["data"]["completion_status"] == "COMPLETED"

    # 4. Confirm visit is marked COMPLETED
    visit_check = client.get(f"/api/v1/participants/{subject["id"]}", headers=auth_headers(coord_token)).json()["data"]
    visit_status = next(v["status"] for v in visit_check["visits"] if v["id"] == visit["id"])
    assert visit_status == "COMPLETED"

    # 5. Confirm completed CRF is read-only
    conflict_res = client.patch(f"/api/v1/crfs/{crf["id"]}", headers=auth_headers(coord_token), json=crf_complete_payload)
    assert conflict_res.status_code == 409


# -----------------------------------------------------------------------------
# 5. Data Query Workflow (Monitor -> Coordinator -> PI)
# -----------------------------------------------------------------------------
def test_data_query_workflow(client):
    coord_token = login(client, "coordinator@sutramind.local")
    participants = client.get("/api/v1/participants", headers=auth_headers(coord_token)).json()["data"]
    subject = next(p for p in participants if p["participant_code"] == "AMV-101")
    detail = client.get(f"/api/v1/participants/{subject["id"]}", headers=auth_headers(coord_token)).json()["data"]
    completed_visit = next(v for v in detail["visits"] if v["status"] == "COMPLETED")
    crf = client.get(f"/api/v1/crfs/by-visit/{completed_visit["id"]}", headers=auth_headers(coord_token)).json()["data"]

    # 1. Monitor raises query
    monitor_token = login(client, "monitor@sutramind.local")
    query_payload = {
        "study_id": subject["study_id"],
        "target_type": "CRF",
        "target_id": crf["id"],
        "field_name": "weight_kg",
        "message": "Please re-verify weight with calibration log."
    }
    q_res = client.post("/api/v1/queries", headers=auth_headers(monitor_token), json=query_payload)
    assert q_res.status_code == 201
    query = q_res.json()["data"]
    assert query["status"] == "OPEN"
    assert query["field_name"] == "weight_kg"

    # 2. PI cannot close an OPEN query (must be ANSWERED first)
    pi_token = login(client, "pi@sutramind.local")
    invalid_close = client.patch(
        f"/api/v1/queries/{query["id"]}",
        headers=auth_headers(pi_token),
        json={"action": "CLOSE"}
    )
    assert invalid_close.status_code == 409

    # 3. Coordinator answers query
    answer_res = client.patch(
        f"/api/v1/queries/{query["id"]}",
        headers=auth_headers(coord_token),
        json={"action": "ANSWER", "answer": "Confirmed against calibrated digital scale on record."}
    )
    assert answer_res.status_code == 200
    assert answer_res.json()["data"]["status"] == "ANSWERED"

    # 4. PI closes query
    close_res = client.patch(
        f"/api/v1/queries/{query["id"]}",
        headers=auth_headers(pi_token),
        json={"action": "CLOSE"}
    )
    assert close_res.status_code == 200
    assert close_res.json()["data"]["status"] == "CLOSED"


# -----------------------------------------------------------------------------
# 6. Ethics Decision Management
# -----------------------------------------------------------------------------
def test_ethics_decision_update(client):
    ethics_token = login(client, "ethics@sutramind.local")
    studies = client.get("/api/v1/studies", headers=auth_headers(ethics_token)).json()["data"]
    study = studies[0]

    update_payload = {
        "iec_number": "AIIA-IEC-RENEWED-002",
        "status": "APPROVED",
        "approval_date": str(date.today()),
        "expiry_date": str(date.today() + timedelta(days=365)),
        "remarks": "Annual continuing review approved by Institutional Ethics Committee."
    }
    res = client.patch(f"/api/v1/ethics/{study["id"]}", headers=auth_headers(ethics_token), json=update_payload)
    assert res.status_code == 200
    assert res.json()["data"]["iec_number"] == "AIIA-IEC-RENEWED-002"
    assert res.json()["data"]["status"] == "APPROVED"


# -----------------------------------------------------------------------------
# 7. Dashboard Overview Aggregation
# -----------------------------------------------------------------------------
def test_dashboard_kpis_calculation(client):
    pi_token = login(client, "pi@sutramind.local")
    res = client.get("/api/v1/dashboard/overview", headers=auth_headers(pi_token))
    assert res.status_code == 200
    kpis = res.json()["data"]
    assert kpis["active_studies"] >= 1
    assert kpis["total_participants"] >= 1
    assert kpis["recruitment_target"] >= 120
    assert kpis["completed_visits"] >= 1
    assert kpis["visit_completion_rate"] > 0
    assert kpis["medicine_adherence"] == 100.0
    assert "P6" in kpis["prakriti_distribution"]
    assert "V001" in kpis["vyadhi_distribution"]
