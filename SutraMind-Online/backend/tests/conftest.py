from datetime import date, timedelta
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app
from app.models import EthicsReview, Medicine, Protocol, Site, Study, StudyMembership
from app.seed import get_or_create_user, seed_master_terms

TEST_DATABASE_URL = "sqlite:///:memory:"
test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=test_engine)
    db = TestingSessionLocal()
    try:
        seed_master_terms(db)
        users = {
            "ADMIN": get_or_create_user(db, "Aditi Nair", "admin@sutramind.local", "ADMIN"),
            "PI": get_or_create_user(db, "Dr. Ananya Sharma", "pi@sutramind.local", "PI"),
            "COORDINATOR": get_or_create_user(db, "Kavita Rao", "coordinator@sutramind.local", "COORDINATOR"),
            "MONITOR": get_or_create_user(db, "Rahul Mehta", "monitor@sutramind.local", "MONITOR"),
            "ETHICS": get_or_create_user(db, "Prof. Meera Iyer", "ethics@sutramind.local", "ETHICS"),
            "PV": get_or_create_user(db, "Dr. Neha Verma", "pv@sutramind.local", "PV"),
        }
        med = Medicine(medicine_code="MED001", ayurveda_name="Yogaraja Guggulu", dosage_form_code="DF01")
        db.add(med)
        db.flush()
        today = date.today()
        study = Study(
            study_code="AMAVATA-001",
            title="Yogaraja Guggulu in Amavata",
            short_title="Yogaraja in Amavata",
            pi_id=users["PI"].id,
            institution="All India Institute of Ayurveda",
            trial_phase="Phase II",
            sample_size=120,
            start_date=today - timedelta(days=30),
            end_date=today + timedelta(days=150),
            status="ACTIVE",
            ctri_number="CTRI/DEMO/2026/001",
        )
        db.add(study)
        db.flush()
        site = Site(study_id=study.id, site_code="AIIA-ND", name="AIIA, New Delhi")
        db.add(site)
        db.flush()
        for role_name in ["PI", "COORDINATOR", "MONITOR", "ETHICS", "PV"]:
            db.add(StudyMembership(
                study_id=study.id,
                user_id=users[role_name].id,
                site_id=site.id if role_name == "COORDINATOR" else None,
                role_in_study=role_name
            ))
        db.add(Protocol(
            study_id=study.id, version="1.0", modern_diagnosis="Rheumatoid Arthritis", vyadhi_code="V001",
            intervention_name="Yogaraja Guggulu", medicine_id=med.id, dosage_form_code="DF01",
            anupana_code="AN01", treatment_duration_days=90, summary="Protocol summary."
        ))
        db.add(EthicsReview(
            study_id=study.id, iec_number="AIIA-IEC-DEMO-001", status="APPROVED",
            approval_date=today - timedelta(days=28), expiry_date=today + timedelta(days=337),
            remarks="Approved synthetic study.", updated_by=users["ETHICS"].id
        ))
        db.commit()
    finally:
        db.close()
    yield
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture
def client():
    return TestClient(app)


def login(client: TestClient, email: str, password: str = "Demo@123") -> str:
    response = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    assert response.status_code == 200, f"Login failed for {email}: {response.text}"
    return response.json()["data"]["access_token"]


def auth_headers(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}
