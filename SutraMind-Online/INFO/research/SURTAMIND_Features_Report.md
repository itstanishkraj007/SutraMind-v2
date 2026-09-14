# SURTAMIND Features Report
## Research-Grounded Feature Recommendations for SutraMind v2

> **Version:** 1.0 | **Date:** September 2026
> **Purpose:** Translate research findings from Teams A, B & C into a prioritized, logic-backed feature specification
> **Priority Scale:** P0 = Must-have for SIH demo | P1 = Phase 1 complete | P2 = Phase 2 roadmap

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Feature Category Overview](#2-feature-category-overview)
3. [P0 Features — Core Demo Requirements](#3-p0-features--core-demo-requirements)
4. [P1 Features — Phase 1 Complete](#4-p1-features--phase-1-complete)
5. [P2 Features — Phase 2 Roadmap](#5-p2-features--phase-2-roadmap)
6. [Feature Logic Map](#6-feature-logic-map)
7. [What Makes SURTAMIND Irreplaceable](#7-what-makes-surtamind-irreplaceable)

---

## 1. Executive Summary

This report defines which features SURTAMIND must build, in what order, and — critically — **why** each feature exists. Every recommendation is grounded in verifiable research from the three pillars:

- **Team A (Ayurveda domain):** How Ayurveda trials actually work in institutions like AIIA and CCRAS
- **Team B (Regulations):** What NDCT Rules 2019, GCP, and ICMR Guidelines legally mandate
- **Team C (Technology):** What CDISC, FHIR, ALCOA+, and the global CTMS market require

The core insight from the combined research:

> **No existing CTMS was designed for Ayurveda.** Every commercial platform (Veeva, Medidata, Castor) and open-source platform (OpenClinica, REDCap) was built on the allopathic paradigm. They treat Prakriti, Anupana, and Dashawidha Pariksha as unknowns. SURTAMIND's competitive moat is not a feature — it is the entire design philosophy.

---

## 2. Feature Category Overview

| Category | # Features | Priority Range | Research Source |
|----------|-----------|----------------|-----------------|
| Ayurveda-Native Data Capture | 6 features | P0 | Team A |
| Regulatory Compliance Gates | 5 features | P0 | Team B (NDCT 2019) |
| eCRF & Data Quality | 4 features | P0 | Team A + C |
| Safety & Pharmacovigilance | 3 features | P0–P1 | Team B + C |
| Ethics Committee Module | 3 features | P0–P1 | Team B |
| RBAC & Multi-role Access | 2 features | P0 | Team C |
| Analytics & Dashboards | 3 features | P0–P1 | Team A + C |
| Interoperability (FHIR) | 2 features | P2 | Team C |
| Standards Export (CDISC) | 2 features | P2 | Team C |
| Document Management (TMF) | 2 features | P1 | Team B |

---

## 3. P0 Features — Core Demo Requirements

These features must be present and demonstrable at SIH. Each is backed by specific research evidence.

---

### F-01: Ayurveda Baseline CRF (Prakriti + Dashawidha Pariksha)

**Priority:** P0
**Research Basis:**
- Team A §4.2: Ayurveda case history is fundamentally different from allopathic records. It must capture Prakriti, Vikriti, and the complete tenfold Dashawidha Pariksha
- Team C §14.2 Feature Gap Matrix: EVERY competitor scores ❌ on Prakriti Assessment and Dashawidha Pariksha

**Feature Specification:**
The Baseline CRF must include a dedicated "Ayurveda Assessment" section with:

| Field | Type | Options / Validation |
|-------|------|---------------------|
| Prakriti | Radio select (required) | Vata, Pitta, Kapha, Vata-Pitta, Vata-Kapha, Pitta-Kapha, Tridosha |
| Vikriti | Text + dropdown | Current doshic imbalance from dropdown list |
| Sara (Tissue quality) | Dropdown | Pravara / Madhyama / Avara |
| Samhanana (Build) | Dropdown | Sthula / Madhyama / Krisha |
| Pramana | Height + Weight fields | Height (cm), Weight (kg) — validated numeric |
| Satmya (Adaptability) | Dropdown | Sarva / Ekadesha / Katu |
| Sattva (Mental strength) | Dropdown | Pravara / Madhyama / Avara |
| Aharashakti (Digestive power) | Dropdown | Abhyavarana / Jarana shakti |
| Vyayamashakti (Exercise capacity) | Dropdown | Pravara / Madhyama / Avara |
| Vaya (Age stage) | Auto-calculated | Balya / Madhya / Vriddha (from DOB) |
| Nidana (Etiology) | Multi-select + free text | Disease-specific list + custom entry |
| Chikitsa type | Radio | Shodhana / Shamana |

**Logic behind this feature:**
Without Prakriti data, Ayurveda trial data is effectively anonymized at the therapeutic level. Two patients with the same diagnosis (Sandhivata) may respond completely differently based on their Prakriti. Capturing Prakriti enables subgroup analysis that is scientifically meaningful within the Ayurvedic paradigm.

---

### F-02: Ayurveda Drug Formulation Capture

**Priority:** P0
**Research Basis:**
- Team A §3 (Intervention documentation): Ayurveda formulations require Anupana (adjuvant), Pathya (dietary recommendations), and Apathya (contraindications) as mandatory fields
- Team C §11.2: Proposed CDASH variables AYFORMULA, AYDOSEFORM, AYANUPANA, AYPATHYA, AYAPATHYA

**Feature Specification:**

| Field | Type | Validation |
|-------|------|-----------|
| Formulation Name | Searchable dropdown (Master Dictionary) | Linked to Admin-managed Ayurveda drug database |
| Dosage Form | Dropdown | Vati, Kwatha, Churna, Taila, Avaleha, Bhasma, Ghrita, Nasya, Lepa |
| Dose (Quantity) | Numeric | Must be > 0 |
| Unit | Dropdown | mg, g, ml, tsp, tablet(s) |
| Frequency | Dropdown | OD, BD, TDS, QDS, SOS, Pratimarsha |
| Route of Administration | Dropdown | Oral, Topical, Nasal, Rectal, Inhalation |
| Anupana (Vehicle) | Text / Master dictionary | Warm water, honey, ghee, milk, etc. |
| Pathya | Multi-select + free text | Dietary and lifestyle recommendations |
| Apathya | Multi-select + free text | Contraindicated foods and activities |
| Duration | Numeric + unit | Days/Weeks/Months |

**Logic:**
The Anupana is not optional in Ayurveda — it modifies the bioavailability, tissue targeting (*dhatu gami*), and action of the primary drug. Omitting it would make the formulation data scientifically incomplete and clinically unusable for reproducibility.

---

### F-03: Screening Log Module

**Priority:** P0
**Research Basis:**
- Team A §4.3: Screening log must document ALL patients assessed for trial eligibility, including those who fail — to prove absence of selection bias
- Team B §9.1: CTRI and monitors review screening logs as primary evidence of eligibility process integrity

**Feature Specification:**
A dedicated Screening Log module (separate from enrollment) capturing:

| Field | Description |
|-------|-------------|
| Screening Number | Auto-generated sequential ID (SCR-001, SCR-002...) |
| Date | Date of screening assessment |
| Patient Initials | First letter of first name + first letter of last name (anonymized) |
| Age | Approximate age (not exact DOB in screening log) |
| Sex | M / F / Other |
| Screening Criteria Result | Pass / Fail |
| Specific Criterion Failed | Multi-select from protocol exclusion criteria list |
| Eligible for Enrollment | Yes / No |
| If Yes — Enrolled? | Yes / No / Pending |
| Screening CRF Completed By | CRC user (auto-populated from login) |
| Notes | Free text (optional) |

**Logic:**
Regulators and monitors do NOT just want to know who enrolled — they want to know who didn't, and why. A complete screening log is required for every GCP audit. SURTAMIND's screening log auto-generates from the eligibility check workflow, reducing CRC burden.

---

### F-04: Ethics Committee (IEC) Module

**Priority:** P0
**Research Basis:**
- Team B §7 (IEC workflow): Ethics approval is a mandatory prerequisite for trial commencement per NDCT Rules, Chapter V, Rule 29
- Team B §9.2 (TMF): Ethics approval letter is an essential document in the TMF
- Team B §7.2: The approval workflow has 8 distinct stages that must be tracked

**Feature Specification:**
The IEC Module must support:

**Submission Tracking:**
- Upload protocol version + ICF version submitted to IEC
- Track submission date
- Record IEC registration number + expiry

**Review Status Workflow:**
```
Submitted → Scientific Review → Ethics Review → Queries Sent
         ↓                                              ↓
    Approved ←──────────────────── Response Submitted
         ↓
   Approval Stored (version, date, validity period)
```

**Approval Document Storage:**
- Upload signed approval letter (PDF)
- Record: Protocol version approved, ICF version approved, approval date, expiry date

**Enrollment Gate Logic:**
SURTAMIND must BLOCK any attempt to create an enrollment record if:
- IEC approval status ≠ "APPROVED"
- IEC approval has expired (current date > approval expiry)
- CTRI registration number is not entered

**Continuing Review Alerts:**
- Alert PI 30 days before IEC approval expiry
- Alert IEC member 14 days before continuing review submission deadline

**Logic:**
Under NDCT Rule 29, starting a trial without IEC approval is illegal and invalidates all data collected. The system gate is not just a UX feature — it is a compliance firewall that prevents institutional liability.

---

### F-05: SAE Reporting & 24-Hour Alert System

**Priority:** P0
**Research Basis:**
- Team B §8.1: SAE is legally defined; death/hospitalization/life-threatening conditions MUST be reported within 24 hours to CLA + Sponsor + IEC (NDCT Rule 42)
- Team B §8.2: SAE reporting timeline is time-critical and traceable; failure triggers regulatory action
- Team C §12 (FHIR): SAE data must eventually flow to PvPI/VigiFlow for pharmacovigilance

**Feature Specification:**

**SAE Entry Form:**
| Field | Type | Validation |
|-------|------|-----------|
| Subject ID | Auto-populated | Linked to enrolled patient |
| Date/Time of SAE | Datetime picker | Cannot be future; must be ≥ enrollment date |
| SAE Type | Dropdown | Death / Life-threatening / Hospitalization required / Prolonged hospitalization / Significant disability / Congenital anomaly |
| SAE Description | Textarea (required) | Minimum 50 characters |
| Onset date | Date picker | |
| Causality Assessment | Dropdown | Definitely related / Probably related / Possibly related / Unlikely / Unrelated / Unassessable |
| Action Taken | Dropdown | Drug withdrawn / Dose reduced / Drug continued / Not applicable |
| Outcome | Dropdown | Recovered / Recovering / Not recovered / Fatal / Unknown |
| Medical Management Provided | Checkbox + textarea | |

**Automated Alert Engine (on SAE submission):**
```
SAE ENTERED → System timestamp recorded
     ↓
IMMEDIATE: Email + in-app notification to:
  → PI (site)
  → Sponsor contact
  → IEC Member Secretary
  → [P2: PvPI portal via E2B XML]

COUNTDOWN TIMER (visible on dashboard):
  → 24-hour timer for initial report acknowledgment
  → 14-day timer for detailed report submission
  → 30-day timer for IEC opinion submission

AUDIT: Every status change in SAE lifecycle is timestamped and attributed
```

**Logic:**
The 24-hour SAE reporting requirement (NDCT Rule 42) is one of the most frequently violated regulations in Indian clinical trials because teams rely on email and phone calls. SURTAMIND makes violation impossible — the moment an SAE is entered, the clock starts and all parties are automatically notified.

---

### F-06: CTRI Number Validation Gate

**Priority:** P0
**Research Basis:**
- Team B §9.1: CTRI registration must precede first patient enrollment (NDCT Rule 30). Retrospective registration is penalized and can invalidate all collected data
- Team A §3 (Step 4): "CTRI number must be obtained BEFORE first patient enrolled" — fundamental workflow step

**Feature Specification:**
- Study setup form includes mandatory CTRI number field
- CTRI format validation: CTRI/YYYY/MM/XXXXXX (regex validated)
- Enrollment screen checks: If CTRI number field is blank or null → Enrollment button is DISABLED with tooltip: "Enter CTRI registration number to enable enrollment"
- CTRI number is displayed prominently on trial dashboard and all exports

**Logic:**
This is a single field with a system gate. The logic is simple but the impact is enormous — it prevents the single most common compliance violation in Indian academic Ayurveda trials.

---

### F-07: Immutable Audit Trail

**Priority:** P0
**Research Basis:**
- Team C §13.1 (ALCOA+): "Attributable" and "Contemporaneous" require every data entry and change to be linked to a specific person at a specific time
- Team C §13.2: FDA's 21 CFR Part 11 requires electronic records systems to maintain complete, tamper-proof audit trails
- Team B §6.3: Monitors perform SDV by reviewing audit trail alongside source documents

**Feature Specification:**
Every INSERT, UPDATE, or DELETE on any clinical data table triggers an automatic audit_log entry:

```sql
CREATE TABLE audit_log (
    event_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id       INTEGER NOT NULL REFERENCES users(id),
    user_role     TEXT NOT NULL,
    table_name    TEXT NOT NULL,
    record_id     TEXT NOT NULL,
    field_name    TEXT NOT NULL,
    old_value     TEXT,
    new_value     TEXT,
    reason        TEXT,      -- MANDATORY for changes to existing data
    ip_address    INET,
    session_id    UUID
);
-- No DELETE or UPDATE permissions granted on audit_log to ANY role
```

**UI Requirement:**
- Every CRF field shows a clock icon that, when clicked, shows the full change history for that field
- Monitors (CRA role) can view audit trail for any field they have access to
- Audit trail is exportable as CSV for regulatory submission

**Logic:**
Without an audit trail, no amount of data quality effort can satisfy a regulatory inspection. The audit trail is the legal chain of custody for clinical data. SURTAMIND's append-only design (no UPDATE or DELETE on audit_log) ensures tamper-proof integrity.

---

### F-08: 6-Role RBAC System

**Priority:** P0
**Research Basis:**
- Team B §6.2 (RACI Matrix): Clinical trials involve 6 distinct stakeholder roles with strictly different responsibilities. Mixing permissions creates compliance violations (e.g., a Monitor should NEVER be able to edit CRF data)
- Team C §13.3: RBAC permission matrix shows each role has distinct access needs

**Feature Specification:**
Six roles enforced at the FastAPI dependency layer (not just UI):

| Role | Key Permissions | Cannot Do |
|------|----------------|-----------|
| **Admin** | Full access, user management, master dictionary | Cannot enter clinical CRF data |
| **PI** | All clinical access, query close, database lock | Cannot manage users |
| **CRC (Study Coordinator)** | CRF entry, query response, screening log, enrollment | Cannot raise queries, cannot lock DB |
| **Monitor (CRA)** | View all data, raise queries, view audit trail, SDV | Cannot enter or edit CRF data |
| **IEC Member** | View ethics submissions, study status, approval workflow | Cannot see patient identifiers |
| **PV Officer** | Log SAE/AE, view safety dashboard, causality assessment | Cannot access enrollment data |

**Logic:**
Every permission in this matrix corresponds to a specific GCP principle (Principle 7, 8, 10) or NDCT rule. A Monitor editing CRF data would be a GCP violation. An IEC member seeing patient identifiers would be a privacy violation. The RBAC is not access management — it is compliance infrastructure.

---

### F-09: Query Management Lifecycle

**Priority:** P0
**Research Basis:**
- Team C §10.1 (Data Lifecycle): Query resolution is Stage 3 of the clinical data lifecycle — between data capture and database lock
- Team C §13.4: Query management is described as a "core CTMS feature"
- Team B §6.3 (SDV): Monitors raise queries during source data verification; CRC and PI must resolve them

**Feature Specification:**

**Query States:**
```
OPEN → RESPONDED → RESOLVED → CLOSED
  ↑         ↓
  └── RE-OPENED (if response is inadequate)
```

**Query Fields:**
| Field | Description |
|-------|-------------|
| Query ID | Auto-generated (Q-001, Q-002...) |
| Target | Specific CRF field and subject ID |
| Severity | Critical / Major / Minor |
| Query Text | What the monitor/PI is asking |
| Raised By | Auto-populated from user |
| Raised Date | Auto-timestamped |
| Response Text | CRC's response |
| Response Date | Auto-timestamped |
| Resolution | Final decision (data corrected / justified as-is) |
| Resolved By | PI (for critical) or CRC (for minor) |
| Closed By | Monitor or PI |
| Closed Date | Auto-timestamped |

**Automation:**
- When a required CRF field fails validation (out of range, inconsistent date) → System auto-generates a query and assigns it to the CRC
- Monitors manually raise queries during SDV
- Open queries block database lock

**Logic:**
Data queries are how clinical trial data achieves pharmaceutical-grade quality. Without a formal query lifecycle, unresolved data issues silently contaminate the statistical analysis. SURTAMIND's query system is the difference between research-grade data and publication-ready data.

---

### F-10: Visit Schedule & Follow-up Management

**Priority:** P0
**Research Basis:**
- Team A §3 (Steps 8–9): Follow-up visits are highly structured events with specific procedures per visit. Visit windows (e.g., Day 28 ± 3) are mandatory to ensure protocol compliance
- Team A §4 (Visit Schedule template): Each visit has defined assessments that must be completed

**Feature Specification:**
- Protocol setup includes a Visit Schedule Builder where PI defines each visit (name, target day, acceptable window ± days, and list of assessments required at that visit)
- CRC sees a "Visit Due" dashboard showing which subjects need a visit, color-coded by status:
  - Green: Visit within window
  - Yellow: Visit window opening in 3 days
  - Red: Visit window missed / overdue
- Each visit generates a visit-specific CRF checklist (only the fields relevant to that visit are shown)
- Visit dates are validated: V2 date must be > V1 date, etc.

**Logic:**
Visit windows are not just scheduling tools — they are protocol integrity checkpoints. A visit conducted outside its window is a protocol deviation that must be documented. SURTAMIND's window-aware dashboard prevents deviations before they happen.

---

### F-11: Real-Time Analytics Dashboard (per Role)

**Priority:** P0
**Research Basis:**
- Team A §1.2 (AIIA digital infrastructure): Trial coordinators at AIIA lack real-time visibility into trial progress
- Team C §14.3 (Architecture): FastAPI + React enables real-time analytics via API polling or WebSocket
- Team B §6.3 (Monitoring): Risk-based monitoring requires data-driven identification of problem sites

**Feature Specification — KPIs per Dashboard:**

**PI Dashboard:**
- Enrollment progress (enrolled / target) with % bar
- Visit completion rate (completed / scheduled)
- Open queries: Critical / Major / Minor counts
- SAE count + pending reporting status
- Protocol deviation count this month

**CRC Dashboard:**
- My upcoming visits (next 7 days) with subject list
- Incomplete CRF fields count
- Queries assigned to me (OPEN status)
- Screening funnel (screened → eligible → enrolled → dropped)

**Monitor Dashboard:**
- SDV completion % per subject
- Open queries raised by me
- Sites not visited in > 30 days
- Sites with > 5 open critical queries

**IEC Dashboard:**
- Trials awaiting my review
- Continuing review deadlines
- SAE reports submitted in last 30 days

**PV Dashboard:**
- AE/SAE counts by severity
- SAEs by causality classification
- AEs by system organ class
- Pending SAE reports (outside 24-hour window)

**Logic:**
Different roles need completely different information. A PI drowning in query lists is not served by seeing the Monitor's SDV matrix. Role-specific dashboards reduce cognitive load and make the most critical actions visible immediately.

---

## 4. P1 Features — Phase 1 Complete

### F-12: Multi-Site Study Architecture

**Priority:** P1
**Research Basis:**
- Team A §1.3 (CCRAS): Multi-centric trials are run by CCRAS across 5–8 peripheral institutes simultaneously. A Nodal Institute manages protocol and data
- Team B §6.2 (RACI): Sponsor, PI, Monitor roles exist simultaneously across multiple sites with different permissions at each site

**Feature Specification:**
- Study can have multiple "Sites" (e.g., AIIA Delhi, CARI Mumbai, RARI Bengaluru)
- Each site has its own PI, CRC, and Monitor
- A "Nodal PI" role has cross-site visibility (read-only on other sites' data)
- Monitor at Site A cannot see Site B's patient data
- Central analytics aggregate across all sites for Sponsor view
- Database lock requires all sites to close their queries independently

**Logic:**
CCRAS multi-centric trials are the highest-impact Ayurveda trials in India. Without multi-site support, SURTAMIND cannot serve the CCRAS use case — which is the most commercially significant institutional client.

---

### F-13: Protocol Version Control & Amendment Workflow

**Priority:** P1
**Research Basis:**
- Team B §7.5 (Protocol Amendments): Substantial protocol changes require new IEC approval; minor changes require notification only
- Team B (NDCT Rule 35): Amendment lifecycle must be documented and tracked
- Team B §7.3 (Re-consenting): If an amendment changes the risk-benefit ratio, all enrolled subjects must be re-consented

**Feature Specification:**
- Protocol stored with version number (e.g., v1.0, v1.1, v2.0) and date
- Amendment form: select fields changed, description of change, reason, classification (Substantial / Non-substantial)
- Substantial Amendment → triggers IEC re-submission workflow
- If amendment affects risk/benefit → system flags all enrolled subjects as "Re-consent Required"
- CRC sees per-subject re-consent status on dashboard

**Logic:**
Protocols change. The question is whether those changes are tracked, approved, and re-communicated to subjects. SURTAMIND's amendment workflow makes protocol evolution auditable and compliance-preserving.

---

### F-14: Trial Master File (TMF) Document Module

**Priority:** P1
**Research Basis:**
- Team B §9.2 (TMF): TMF is the administrative backbone of every trial — required for audit and inspection
- Team B (NDCT Rule 52): Documents archived ≥5 years post-completion
- Team B §6.4 (Audit & Inspection): TMF must be "inspection-ready" at all times

**Feature Specification:**
- Pre-structured TMF folder system per trial (Before Trial / During Trial / After Trial categories)
- Each folder has expected documents (e.g., "Ethics Approval Letter", "CTRI Certificate")
- Status per document: Missing / Uploaded / Verified
- Document upload with version, date, uploaded-by
- "TMF Completeness Score" shown on dashboard (% of expected documents present)
- Alerts for expiring documents (IEC approval, insurance certificates)

**Logic:**
Regulatory inspections fail most commonly because "the TMF was not inspection-ready." SURTAMIND's TMF module converts document management from a stressful pre-inspection scramble into a continuous, real-time process.

---

### F-15: Bilingual Interface (English + Hindi)

**Priority:** P1
**Research Basis:**
- Team A §1.2 (AIIA patient journey): Most Ayurveda patients and many CRCs in peripheral CCRAS institutes work in Hindi
- Existing implementation: Already partially implemented in SutraMind v1 via LanguageContext (EN/HI toggle)

**Feature Specification:**
- All UI labels, form field names, status messages, and error text available in both English and Hindi
- Devanagari rendering for all Hindi text (font: Noto Sans Devanagari or equivalent)
- Ayurveda-specific terms displayed in their Sanskrit/Hindi form with English transliteration in parentheses
- Language preference saved to user profile

**Logic:**
A CTMS that is only usable in English excludes the majority of Ayurveda practitioners and CRCs at peripheral CCRAS institutes. Hindi support is not a cosmetic feature — it is an access feature.

---

## 5. P2 Features — Phase 2 Roadmap

### F-16: CDISC SDTM Export

**Priority:** P2
**Research Basis:**
- Team C §11 (CDISC): SDTM is required for FDA/EMA regulatory submission; journals increasingly require standardized datasets for peer review
- Team C §11.3 (SDTM domains): DM, AE, VS, LB, CM, QS domains cover all standard Ayurveda trial data; AY custom domain for Ayurveda-specific variables

**Feature Specification:**
- "Export SDTM Package" button (PI and Statistician roles only)
- System generates: DM.xpt, AE.xpt, VS.xpt, LB.xpt, CM.xpt, QS.xpt, AY.xpt (custom)
- Each domain follows SDTM variable naming conventions (e.g., VSTESTCD, VSORRES, VSORRESU)
- Define-XML metadata file generated alongside datasets
- Validation against CDISC conformance rules before export

**Logic:**
Ayurveda research will never achieve global regulatory recognition without CDISC-formatted datasets. SURTAMIND's SDTM export layer is what converts local Ayurveda trial data into internationally interoperable scientific evidence.

---

### F-17: FHIR R4 Integration Layer

**Priority:** P2
**Research Basis:**
- Team C §12 (FHIR): AIIA's HIS can push Patient demographics to SURTAMIND via FHIR, eliminating manual re-entry errors
- Team C §12.1: Observation resources can carry LOINC-coded lab results directly from LIS to SURTAMIND eCRF
- Team C §12.2: ResearchSubject resource links patients to trials in a globally interoperable way

**Feature Specification:**
- FHIR R4 REST API endpoints:
  - `GET /fhir/Patient/{id}` — pull patient from HIS
  - `POST /fhir/Observation` — receive lab results from LIS
  - `GET /fhir/ResearchStudy/{id}` — trial info for external systems
  - `POST /fhir/ResearchSubject` — enrollment notification to HIS
- Prakriti captured as FHIR extension on Patient resource
- ICD-11 TM codes (via NAMASTE) used for Condition resources

**Logic:**
Manual data re-entry is the single largest source of transcription errors in clinical trials. FHIR integration eliminates re-entry for demographics and lab data — reducing errors and CRC workload simultaneously.

---

### F-18: PvPI Pharmacovigilance Module

**Priority:** P2
**Research Basis:**
- Team B §8.3 (PvPI): Ministry of Ayush's NPvCC is located at AIIA; Ayurveda ADR reporting goes through VigiFlow
- Team B §8.1 (SAE): SAE data collected in SURTAMIND must ultimately flow to the national pharmacovigilance system
- Team C §14.2: SURTAMIND is the only platform in the feature gap matrix with PvPI module checked ✅

**Feature Specification:**
- PV Officer dashboard: view all AEs/SAEs by system organ class, causality, severity
- WHO-UMC causality assessment wizard (guided decision tree)
- Auto-generate CIOMS I format safety report from SAE data
- E2B R3 XML export for VigiFlow/PvPI portal submission
- Signal detection: alert when same AE type appears in > N subjects within timeframe

**Logic:**
India has a growing Ayurveda pharmacovigilance system but almost no digital tools to feed it. SURTAMIND's PV module creates the first direct digital bridge between Ayurveda trial data and India's national drug safety reporting infrastructure.

---

## 6. Feature Logic Map

This diagram shows how each research finding directly produces a SURTAMIND feature:

```
RESEARCH FINDING                          SURTAMIND FEATURE
────────────────────────────────────────────────────────────
Team A: Ayurveda case history requires    → F-01: Ayurveda Baseline CRF
        Prakriti, Vikriti, Dashawidha        (Prakriti + Dashawidha Pariksha)

Team A: Anupana, Pathya, Apathya are     → F-02: Ayurveda Drug Formulation
        mandatory clinical fields               Capture with Anupana fields

Team A: Screening log documents even     → F-03: Screening Log Module
        rejected patients (bias proof)         (with exclusion reason tracking)

Team B: NDCT Rule 29 — IEC approval     → F-04: IEC Ethics Module
        gates trial commencement               (with enrollment gate logic)

Team B: NDCT Rule 42 — SAE within       → F-05: SAE Reporting with
        24 hours to CLA + IEC + Sponsor        24-hour countdown alerts

Team B: NDCT Rule 30 — CTRI before      → F-06: CTRI Number Validation
        first enrollment                       Gate on enrollment screen

Team C: ALCOA+ "Attributable" &         → F-07: Immutable Audit Trail
        "Contemporaneous" requirements         (append-only event log)

Team B: GCP principles 7,8,10 require   → F-08: 6-Role RBAC
        role-separated responsibilities        (API-enforced permissions)

Team C: Query resolution is Stage 3      → F-09: Query Management
        of clinical data lifecycle            Lifecycle (raised→closed)

Team A: Visit windows ± N days          → F-10: Visit Schedule &
        are protocol compliance points        Follow-up Management

Team A/B: Trial teams need real-time    → F-11: Role-Specific Analytics
          progress visibility                  Dashboards (6 dashboards)

Team A: CCRAS runs 5-8 site trials      → F-12: Multi-Site Architecture

Team B: Amendment workflow + re-consent → F-13: Protocol Version Control

Team B: TMF inspection-readiness        → F-14: TMF Document Module

Team A: Hindi-speaking CRCs at CCRAS   → F-15: Bilingual EN/HI Interface

Team C: CDISC required for global       → F-16: SDTM Export Layer
        regulatory submission

Team C: FHIR enables HIS integration    → F-17: FHIR R4 API Layer

Team B+C: PvPI Ayurveda PV system      → F-18: PvPI PV Module
```

---

## 7. What Makes SURTAMIND Irreplaceable

Based on the research across all three teams, SURTAMIND's competitive moat is not a single feature — it is the combination of three things no competitor has simultaneously:

### Pillar 1: Ayurveda-Native Data Model
No existing CTMS has ever been designed with Prakriti, Vikriti, Anupana, or Dashawidha Pariksha as first-class data fields. They are an architectural afterthought at best, or completely absent. SURTAMIND's data model was designed from day one around the Ayurvedic clinical consultation.

### Pillar 2: India-Specific Regulatory Compliance
No existing CTMS (Veeva, Medidata, REDCap, OpenClinica, Castor) has built-in CTRI workflow, NDCT 2019 compliance gates, or IEC ethics module. They are built for FDA and EMA. SURTAMIND is the only CTMS designed specifically for the Indian regulatory landscape as defined by NDCT Rules 2019.

### Pillar 3: Accessibility for Academic Institutions
Veeva and Medidata cost $20,000–$50,000+ per year — entirely out of reach for AIIA, NIA, CCRAS peripheral institutes, and Ayurvedic colleges. REDCap is free but is not a CTMS (no GCP compliance, no audit trail, no query management). SURTAMIND occupies the market gap: **GCP-compliant, feature-complete, and affordable/open for Indian academic Ayurveda research.**

---

### Summary Scorecard

| Dimension | Current SURTAMIND v1 | Target SURTAMIND v2 (SIH) |
|-----------|---------------------|--------------------------|
| Ayurveda data fields | ✅ Prakriti + Vikriti | ✅ + Dashawidha, Anupana, Pathya |
| Regulatory gates (IEC, CTRI) | ⚠️ Partial | ✅ Full gates |
| SAE 24-hour alert system | ❌ | ✅ |
| Immutable audit trail | ✅ | ✅ (enhanced) |
| 6-role RBAC | ✅ | ✅ |
| Query management | ✅ | ✅ |
| Screening log module | ❌ | ✅ |
| TMF document module | ❌ | ✅ (P1) |
| CDISC SDTM export | ❌ | ✅ (P2 roadmap) |
| FHIR R4 integration | ❌ | ✅ (P2 roadmap) |
| PvPI module | ❌ | ✅ (P2 roadmap) |
| Bilingual (EN/HI) | ✅ | ✅ (enhanced) |
| Multi-site architecture | ❌ | ✅ (P1) |

---

*End of SURTAMIND Features Report — Version 1.0*
*September 2026 | Smart India Hackathon (SIH) Submission*
