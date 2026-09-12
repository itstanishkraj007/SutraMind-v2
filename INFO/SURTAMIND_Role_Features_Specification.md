# SURTAMIND — Complete Role-by-Role Features Specification
## Profile-Wise Feature Breakdown with Module Architecture, Sync & Notification System

> **Version:** 2.0 | **Date:** September 2026
> **Stack Context:** AWS (deployed) + Supabase (Auth) + SMTP (Email) + Windows Desktop App (offline sync)
> **Research Source:** Teams A, B, C + NDCT Rules 2019 + GCP for ASU Drugs

---

## Table of Contents

1. [System Architecture Overview](#1-system-architecture-overview)
2. [Authentication — Supabase](#2-authentication--supabase)
3. [Real-Time Sync & Notification Engine](#3-real-time-sync--notification-engine)
4. [Offline Sync — Windows Desktop App](#4-offline-sync--windows-desktop-app)
5. [SMTP Email System](#5-smtp-email-system)
6. [Role 1 — Admin](#6-role-1--admin)
7. [Role 2 — Principal Investigator (PI)](#7-role-2--principal-investigator-pi)
8. [Role 3 — Study Coordinator (CRC)](#8-role-3--study-coordinator-crc)
9. [Role 4 — Monitor (CRA)](#9-role-4--monitor-cra)
10. [Role 5 — Ethics Committee (IEC)](#10-role-5--ethics-committee-iec)
11. [Role 6 — Pharmacovigilance Officer (PV)](#11-role-6--pharmacovigilance-officer-pv)
12. [Cross-Role Notification Matrix](#12-cross-role-notification-matrix)
13. [Feature Visibility Matrix](#13-feature-visibility-matrix)

---

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     SURTAMIND SYSTEM                            │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Web Browser │  │ Windows App  │  │   Mobile (Future)    │  │
│  │  (React 19)  │  │  (Electron/  │  │                      │  │
│  │              │  │   Tauri)     │  │                      │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────────────────┘  │
│         │                 │                                      │
│         └─────────────────┼────────────────────────────────────┐│
│                           │ REST + WebSocket                    ││
│                           ▼                                     ││
│  ┌────────────────────────────────────────────────────────┐    ││
│  │                  FastAPI Backend (AWS EC2/ECS)          │    ││
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │    ││
│  │  │  Auth    │ │  RBAC    │ │  Realtime│ │   SMTP   │  │    ││
│  │  │ Supabase │ │  Guards  │ │  WS Hub  │ │  Service │  │    ││
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │    ││
│  └────────────────────────┬───────────────────────────────┘    ││
│                           │                                     ││
│  ┌────────────────────────▼───────────────────────────────┐    ││
│  │             PostgreSQL (AWS RDS)                        │    ││
│  │   Clinical Data + Audit Log + Notification Queue        │    ││
│  └────────────────────────────────────────────────────────┘    ││
│                                                                  │
│  Windows App also has:                                          │
│  ┌──────────────────────────────────┐                          │
│  │  Local SQLite (offline mirror)   │                          │
│  │  Sync Queue (pending operations) │                          │
│  └──────────────────────────────────┘                          │
└─────────────────────────────────────────────────────────────────┘
```

**Key Design Principles:**
- AWS hosts the FastAPI backend + PostgreSQL (primary source of truth)
- Supabase handles authentication (JWT tokens, password management, sessions)
- Supabase Realtime (WebSocket-based) pushes live events to all connected clients
- SMTP sends transactional emails for critical events (SAE, IEC approval, etc.)
- Windows Desktop App has a local SQLite mirror + sync queue for offline operation
- Every role sees ONLY the modules relevant to their job — nothing else

---

## 2. Authentication — Supabase

### Why Supabase for Auth

Supabase provides hosted PostgreSQL + Auth + Realtime in one platform. We use:
- **Supabase Auth** for: Email/password login, JWT token issuance, password reset, session management
- **Supabase Realtime** for: Live event push to all connected clients (notification system)
- Our own **FastAPI + PostgreSQL** for: All clinical data (patient records, CRFs, protocols, etc.)

### Authentication Flow

```
User enters email + password
         ↓
Supabase Auth validates credentials
         ↓
Supabase issues JWT token (contains: user_id, role, site_id, exp)
         ↓
All API requests include: Authorization: Bearer <token>
         ↓
FastAPI validates JWT → reads role → applies RBAC
         ↓
API returns only data permitted for that role
```

### Auth Features per Role

| Feature | Admin | PI | CRC | Monitor | IEC | PV |
|---------|-------|-----|-----|---------|-----|----|
| Email + Password login | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Password reset via email (SMTP) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Forced password change on first login | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Session timeout (8 hours inactivity) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Active session count visible | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Revoke other sessions | ✅ (Admin) | ✅ (own) | ✅ (own) | ✅ (own) | ✅ (own) | ✅ (own) |

### User Record Structure

```json
{
  "id": "uuid",
  "email": "pi@aiia.gov.in",
  "role": "PI",
  "full_name": "Dr. Ramesh Sharma",
  "designation": "Associate Professor, Kayachikitsa",
  "institution": "AIIA, New Delhi",
  "phone": "+91-9876543210",
  "gcp_certified": true,
  "gcp_cert_expiry": "2026-12-31",
  "assigned_studies": ["STUDY-001", "STUDY-002"],
  "assigned_sites": ["SITE-AIIA-DELHI"],
  "is_active": true,
  "created_at": "2025-01-01T00:00:00Z"
}
```

---

## 3. Real-Time Sync & Notification Engine

### How It Works

Supabase Realtime uses WebSocket connections. Every connected client (web browser or Windows app) maintains a live WebSocket channel. When any event happens in the database:

```
EVENT OCCURS IN DATABASE
(e.g., PI submits protocol to IEC)
         ↓
FastAPI triggers Supabase Realtime event
         ↓
Event broadcast to all subscribed channels
         ↓
Each role's channel receives only events meant for them
         ↓
Frontend shows: in-app notification bell + alert banner
Windows app shows: system tray notification + in-app alert
```

### Event-to-Notification Mapping

| Event Trigger | Who Created It | Who Gets Notified | Type |
|--------------|---------------|------------------|------|
| Protocol submitted to IEC | PI | IEC Members | In-app + Email |
| IEC approves protocol | IEC | PI + Admin | In-app + Email |
| IEC rejects protocol | IEC | PI | In-app + Email |
| IEC approval expiring in 30 days | System (cron) | PI + Admin | In-app + Email |
| SAE reported | CRC | PI + IEC + PV | In-app + 🚨 Alert + Email |
| Query raised | Monitor | CRC + PI | In-app |
| Query answered | CRC/PI | Monitor | In-app |
| Query closed | PI | CRC + Monitor | In-app |
| Enrollment completed (target reached) | System | PI + Admin + Monitor | In-app |
| Visit overdue (missed window) | System (cron) | CRC + PI | In-app |
| CTRI number missing (enrollment attempt) | System | PI + Admin | In-app |
| Database locked | PI | All roles on study | In-app + Email |
| Protocol amended | PI | IEC + CRC + Monitor | In-app + Email |
| New user added to study | Admin | New user | In-app + Email |

### Notification Object Structure

```json
{
  "id": "notif-uuid",
  "recipient_user_id": "user-uuid",
  "study_id": "STUDY-001",
  "event_type": "SAE_REPORTED",
  "severity": "CRITICAL",
  "title": "🚨 SAE Reported — Subject OA-003",
  "body": "Coordinator reported a Serious Adverse Event for Subject OA-003. Requires immediate review within 24 hours.",
  "action_url": "/studies/STUDY-001/safety/sae/SAE-003",
  "is_read": false,
  "created_at": "2026-09-12T10:30:00Z",
  "email_sent": true,
  "email_sent_at": "2026-09-12T10:30:05Z"
}
```

---

## 4. Offline Sync — Windows Desktop App

### Why a Windows Desktop App

Many AIIA and CCRAS peripheral institute CRCs work in areas with unstable internet. The Windows desktop app (built with Electron or Tauri wrapping the same React frontend) allows:
- Full offline data entry into a local SQLite database
- Sync to PostgreSQL (AWS) the moment internet is restored
- No data loss during outages

### Offline-First Architecture

```
ONLINE MODE:
React App → API calls → FastAPI → PostgreSQL (AWS)
                    ↑
            Supabase Realtime (WebSocket live)

OFFLINE MODE (Windows App):
React App → API calls → Local SQLite (on device)
All changes queued in: sync_queue table

RESTORATION (when internet comes back):
Sync Agent detects connectivity
         ↓
Reads all pending records from sync_queue
         ↓
Replays each operation to FastAPI (in order of created_at)
         ↓
Conflict check: if server record modified since offline session started
  → Use server version (newer wins) + flag for user review
         ↓
Clear synced items from sync_queue
         ↓
Supabase Realtime pushes fresh data back to Windows app
```

### Sync Queue Table (Local SQLite)

```sql
CREATE TABLE sync_queue (
  id            TEXT PRIMARY KEY,
  created_at    TEXT NOT NULL,           -- ISO timestamp of when change was made
  operation     TEXT NOT NULL,           -- INSERT | UPDATE | DELETE
  endpoint      TEXT NOT NULL,           -- e.g., /api/v1/participants/
  payload       TEXT NOT NULL,           -- JSON body of the API call
  status        TEXT DEFAULT 'PENDING',  -- PENDING | SYNCED | CONFLICT | FAILED
  retry_count   INTEGER DEFAULT 0,
  synced_at     TEXT,
  conflict_data TEXT                     -- server value if conflict
);
```

### What Can Be Done Offline

| Action | Offline Available | Reason |
|--------|------------------|--------|
| CRF data entry (all fields) | ✅ | Core CRC workflow |
| Screening log entry | ✅ | Core CRC workflow |
| Visit scheduling | ✅ | Core CRC workflow |
| AE/SAE reporting | ✅ | Critical — cannot wait |
| View existing protocol | ✅ (cached) | Read-only reference |
| Submit protocol to IEC | ❌ | Requires real-time IEC notification |
| Query resolution | ✅ | Queued for sync |
| Database lock | ❌ | Requires all queries confirmed closed |
| View audit trail | ✅ (cached) | Read-only |
| User management | ❌ | Admin-only, requires live sync |

### Sync Status Indicator

Windows app shows a persistent status bar:
- 🟢 **Live** — Connected to AWS, all data real-time
- 🟡 **Syncing** — Internet restored, replaying queued changes (shows count: "Syncing 12 changes...")
- 🔴 **Offline** — No internet. Working in local mode. Changes queued: N
- ⚠️ **Conflict** — N conflicts need your review

---

## 5. SMTP Email System

### Email Events & Recipients

| Trigger | Email To | Subject | Priority |
|---------|---------|---------|----------|
| SAE Reported | PI + IEC Secretary + PV Officer | 🚨 URGENT: SAE Reported — [Subject ID] in [Study Title] | CRITICAL |
| Protocol submitted to IEC | IEC Secretary | New Protocol for Review: [Study Title] | HIGH |
| IEC Approval granted | PI | Your Protocol Has Been Approved — [Study Title] | MEDIUM |
| IEC Approval rejected | PI | IEC Review Update — Action Required: [Study Title] | HIGH |
| IEC Approval expiring in 30 days | PI + Admin | Reminder: IEC Approval Expiring in 30 Days | MEDIUM |
| Database locked | Sponsor/Admin + PI | Database Locked — [Study Title] | MEDIUM |
| Protocol amended | IEC + CRC + Monitor | Protocol Amendment Notice — [Study Title] v[X.X] | HIGH |
| Password reset | User | Reset Your SURTAMIND Password | HIGH |
| New user onboarded | New user | Welcome to SURTAMIND — Your Login Details | MEDIUM |
| Visit overdue | PI + CRC | Subject Visit Overdue — [Subject ID], Visit [N] | MEDIUM |
| Query critical (unresolved 48h) | PI + CRC | Critical Query Unresolved — [Study Title] | HIGH |

### SAE Email Template (Most Critical)

```
Subject: 🚨 URGENT: Serious Adverse Event Reported — Study [STUDY-CODE]

Dear Dr. [PI Name],

A Serious Adverse Event (SAE) has been reported for the following study:

  Study:     [Study Title]
  Subject:   [Subject ID] (anonymized)
  Site:      [Site Name]
  Reported:  [Timestamp]
  SAE Type:  [Hospitalization / Life-threatening / Death / etc.]
  Reported By: [CRC Name]

⚠️ NDCT Rules 2019, Rule 42 requires you to submit an initial SAE report
to the CLA, IEC, and Sponsor within 24 HOURS of awareness.

  Time Remaining: 23 hours 47 minutes

Please log in to SURTAMIND to review and take action:
  [Direct link to SAE record]

This is an automated alert from SURTAMIND — AIIA Clinical Trial System.
Do not reply to this email.
```

---

## 6. Role 1 — Admin

### Who Is the Admin?

The Admin is the **system owner** — typically the Research Cell Head or IT Administrator at the institution (e.g., AIIA or a CCRAS nodal institute). They do NOT conduct clinical work; they govern who can access the system and what data is in it.

### What Admin Sees (Complete Module List)

```
Admin Dashboard
├── 1. User Management Module
│   ├── 1.1 Create User
│   ├── 1.2 Edit User
│   ├── 1.3 Assign Role
│   ├── 1.4 Assign to Study/Site
│   ├── 1.5 Deactivate/Suspend User
│   └── 1.6 GCP Certificate Tracker
│
├── 2. Master Dictionary Module
│   ├── 2.1 Vyadhi (Disease) List Manager
│   ├── 2.2 Prakriti Terms Manager
│   ├── 2.3 Ayurveda Drug Formulary
│   ├── 2.4 Dosage Forms Manager
│   ├── 2.5 Anupana (Vehicle) Manager
│   ├── 2.6 Agni / Bala / Satva Terms
│   └── 2.7 MedDRA / ICD-11 Mapping
│
├── 3. Study Configuration Module
│   ├── 3.1 Create Study (shell)
│   ├── 3.2 Add Sites to Study
│   ├── 3.3 Assign Staff per Site
│   └── 3.4 Study Status Control (DRAFT→ACTIVE→CLOSED)
│
├── 4. System Monitoring Module
│   ├── 4.1 Full Audit Log Viewer
│   ├── 4.2 Active Sessions Dashboard
│   ├── 4.3 Failed Login Attempts
│   ├── 4.4 Sync Status (offline Windows app queue)
│   └── 4.5 Storage & DB health
│
└── 5. System Settings
    ├── 5.1 SMTP Configuration
    ├── 5.2 Supabase API Keys
    ├── 5.3 Notification Preferences (system-wide)
    └── 5.4 Backup Configuration
```

---

### Module 1: User Management

**Mini-Modules & Why They Exist:**

#### 1.1 Create User
Fields: Full Name, Email, Role (dropdown), Designation, Institution, Phone, Assigned Studies, Assigned Sites, GCP Cert Expiry
- **Why:** Every person who touches trial data must have a unique, role-specific, audit-traceable login. Shared passwords violate ALCOA+ "Attributable" principle (Team C research).
- **Logic:** Supabase Auth creates the user record; FastAPI stores role + site assignment. Invitation email sent via SMTP.

#### 1.2 Edit User
- Change role, reassign to study/site, update contact details
- **Why:** Staff changes during long trials (PI transfers, new CRC) must be reflected in the system without losing historical audit records.
- **Logic:** Role changes are logged in audit_trail. Old role's actions remain attributed to them.

#### 1.3 Assign Role
- Strict roles: Admin, PI, CRC, Monitor, IEC, PV
- One user = One role (no dual-role to prevent compliance conflicts)
- **Why:** GCP Principle 7 requires defined, separated responsibilities. A Monitor who can edit CRF data is a GCP violation.

#### 1.4 Assign to Study/Site
- PI, CRC, Monitor: assigned to specific studies AND specific sites
- IEC: assigned to study-level (no site specificity)
- **Why:** CCRAS multi-centric trials have different staff at different sites. Site assignment prevents cross-site data leakage.

#### 1.5 Deactivate/Suspend User
- Soft delete (preserves all their historical records)
- Deactivated user's JWT tokens are invalidated immediately
- **Why:** NDCT Rule 52 requires historical data preservation. Hard-deleting a user would break audit trail attribution.

#### 1.6 GCP Certificate Tracker
- Stores each staff member's GCP training date + expiry
- Alert when any team member's GCP cert expires in 30 days
- **Why:** GCP Principle 8 mandates all trial staff be trained and qualified. Expired GCP certification makes their data entries non-compliant. (Team B research — GCP module)

---

### Module 2: Master Dictionary

#### 2.1–2.6 Term Managers
Each manager lets Admin add/edit/deactivate terms in the master_terms table with: Code, English Label, Hindi Label, Modern Mapping, Active status.

**Why a Master Dictionary?**
- CRFs use coded values (not free text) for Prakriti, Vyadhi, Agni, etc.
- Coded values enable consistent analysis across subjects
- Hindi labels enable the bilingual interface
- MedDRA mapping enables SDTM AE domain coding for regulatory submission
- Deactivating a term prevents new data from using deprecated codes, while preserving existing records that used those codes
- (Team A research: Ayurveda terms need standardization; Team C: CDASH custom variable AYPRAKRITI)

---

### Module 3: Study Configuration

#### 3.1 Create Study Shell
Admin creates the basic study: Code, Title, Phase, Type (Interventional/Observational), Target Sample Size, Start Date, Primary Site.
- **Why separate from PI's protocol?** Separation of administrative setup (Admin) from scientific content (PI) mirrors the GCP RACI matrix — Admin manages access and infrastructure; PI manages science.

#### 3.4 Study Status Control
- DRAFT → ACTIVE (only after IEC approval present)
- ACTIVE → CLOSED (only after database lock)
- **Why:** Study status gates are compliance checkpoints. A study cannot recruit without IEC approval (NDCT Rule 29). (Team B research)

---

### Module 4: System Monitoring

#### 4.1 Full Audit Log Viewer
- Searchable, filterable log of every data change across the entire system
- Filters: Study, User, Date Range, Table, Action Type
- Export to CSV for regulatory submission
- **Why:** Admin is responsible for system integrity and inspection readiness. During a regulatory audit (CDSCO), the auditor will ask to see the audit log. (Team B §6.4, Team C §13.2)

#### 4.4 Sync Status Dashboard
- Lists all Windows desktop app instances currently syncing
- Shows: Device ID, Last Sync Timestamp, Pending Queue Items, Conflict Count
- **Why:** Admin needs visibility into offline data that hasn't reached the database yet. If a CRC has 50 items pending for 3 days, that's a risk that needs admin intervention.

---

## 7. Role 2 — Principal Investigator (PI)

### Who Is the PI?

The PI is the **lead doctor** at the trial site — typically a faculty member at AIIA or a CCRAS institute (BAMS/MD Ayurveda). They are legally responsible for all trial conduct at their site, patient safety, protocol adherence, and SAE reporting. (Team A §3, Step 4; Team B §6.2 RACI)

### What PI Sees (Complete Module List)

```
PI Dashboard
├── 1. Protocol Creation Module
│   ├── 1.1 Study Information
│   ├── 1.2 Background & Rationale
│   ├── 1.3 Objectives & Hypotheses
│   ├── 1.4 Study Design Configurator
│   ├── 1.5 Eligibility Criteria Builder
│   ├── 1.6 Intervention & Control Configurator
│   ├── 1.7 Visit Schedule Builder
│   ├── 1.8 Outcome Measures
│   ├── 1.9 Statistical Analysis Plan
│   ├── 1.10 Safety & AE/SAE Plan
│   ├── 1.11 Ethics & CTRI Submission
│   └── 1.12 Protocol Amendment Workflow
│
├── 2. Study Overview Dashboard
│   ├── 2.1 Recruitment Progress
│   ├── 2.2 Visit Completion Rate
│   ├── 2.3 Open Queries (by severity)
│   ├── 2.4 SAE Counter & Status
│   ├── 2.5 IEC Approval Status
│   └── 2.6 CTRI Registration Status
│
├── 3. Participant Review Module
│   ├── 3.1 Enrollment Approval
│   ├── 3.2 Participant Overview (per subject)
│   └── 3.3 Consent Status per Subject
│
├── 4. Query Management (PI View)
│   ├── 4.1 Queries Requiring PI Action (ANSWERED queries)
│   ├── 4.2 Close Query
│   └── 4.3 Raise Query (on CRF)
│
├── 5. Safety Center
│   ├── 5.1 SAE Alert Dashboard
│   ├── 5.2 AE Summary View
│   ├── 5.3 SAE Causality Assessment
│   └── 5.4 SAE Reporting Checklist (24h timer)
│
├── 6. Database Lock Module
│   ├── 6.1 Pre-lock Checklist
│   ├── 6.2 Lock Confirmation
│   └── 6.3 Post-lock SDTM Export
│
└── 7. Analytics & Reports
    ├── 7.1 Prakriti Distribution Chart
    ├── 7.2 Vyadhi Distribution Chart
    ├── 7.3 Recruitment Timeline
    ├── 7.4 Visit Adherence Report
    └── 7.5 Study Progress Report (exportable PDF)
```

---

### Module 1: Protocol Creation — Complete Breakdown

This is the most complex and important module for the PI. It is a multi-step wizard that takes the PI from a blank page to a complete, IEC-submittable protocol.

#### 1.1 Study Information
Fields:
- Study Title (full, descriptive)
- Short Title / Protocol Code (e.g., AIIA-OA-2026-001)
- Study Phase (Phase I / II / III / IV / Academic / Observational)
- Study Type (Interventional / Observational)
- Principal Investigator (auto-filled from PI's profile)
- Institution
- Sponsor (Institution self-sponsored / External)
- Funding Source
- Protocol Version (starts at v1.0, auto-increments on amendment)
- Protocol Date (auto-filled, today)

**Why this sub-module exists:**
Every protocol submitted to CTRI and IEC requires a unique identifying code and version number. The version control is mandatory under NDCT Rule 35 — all amendments must track version history. This sub-module creates the permanent identity of the trial.

---

#### 1.2 Background & Rationale
Fields:
- Disease/Condition Overview (rich text editor)
- Classical Ayurvedic Perspective on this condition (Nidana, Samprapti — text)
- Literature Review Summary (text + references list)
- Research Gap (what is not known)
- Justification for this study (why this formulation, why this population)

**Why this sub-module exists:**
IECs and peer reviewers evaluate whether the trial is scientifically justified. Without a clear background, the IEC cannot determine if the research gap is real or if risks are justified by potential benefits. (Team B §7.2 — IEC submission requirements)

---

#### 1.3 Objectives & Hypotheses
Fields:
- Primary Objective (one statement)
- Primary Hypothesis (null + alternative)
- Primary Endpoint (what will be measured to answer it)
- Secondary Objectives (list, up to 5)
- Secondary Endpoints (one per objective)
- Exploratory Objectives (optional)

**Why this sub-module exists:**
The protocol hypothesis is the scientific foundation. CTRI registration requires primary and secondary endpoint specification. Without clearly stated objectives, the trial cannot be statistically analyzed, and the CSR cannot be written. (Team A §3 Step 1 — PICO framework)

---

#### 1.4 Study Design Configurator
Fields:
- Design Type: RCT / Open Label / Crossover / Observational (dropdown)
- Allocation: Randomized / Non-randomized
- Randomization Method: Simple / Block / Stratified (dropdown)
- Block Size (if block): 4 / 6 / 8
- Stratification Variables (if stratified): multi-select from study variables
- Blinding: Open / Single Blind / Double Blind
- If blinded: Who is blinded (Subject / Investigator / Assessor / All)
- Parallel Groups / Crossover (radio)
- Number of Arms: 2 / 3 / More
- Arm Names + Types (Intervention / Active Comparator / Placebo Control)
- Duration of Treatment (weeks)
- Duration of Follow-up (weeks after treatment ends)
- Total Study Duration

**Why this sub-module exists:**
Study design determines the entire data collection structure. The randomization method drives how subject IDs are generated. Blinding status determines CRF field visibility rules. A crossover design changes the visit structure completely. Everything downstream (visit schedule, CRF structure, statistics) depends on the design chosen here. (Team A §2.4, §2.5)

---

#### 1.5 Eligibility Criteria Builder
Two sections:

**Inclusion Criteria** (each criterion is a separate row):
- Criterion text
- Category: Age / Gender / Diagnosis / Lab Value / Duration / Consent / Other
- Value / Range (for quantitative criteria)

**Exclusion Criteria** (same structure):
- Criterion text
- Category: Pregnancy / Comorbidity / Medication / Allergy / Lab Value / Other

Example rows auto-populated for Ayurveda trials:
- Age between 18 and 70 years
- Diagnosis of [Vyadhi] as per Ayurvedic diagnostic criteria
- Prakriti assessment completed and documented
- No concurrent Ayurvedic treatment for the same condition
- Not pregnant or breastfeeding
- Willing to follow Pathya/Apathya during trial

**Why this sub-module exists:**
Eligibility criteria are the legal boundary of who can participate. The Screening Log module reads from this list to generate the "Reason for Exclusion" dropdown. CTRI requires eligibility criteria verbatim. (Team A §3, Step 5; Team B §7.3 — consent requires disclosure of who qualifies)

---

#### 1.6 Intervention & Control Configurator

**Intervention Arm:**
- Formulation Name (linked to Master Dictionary)
- Dosage Form: Vati / Kwatha / Churna / Taila / Bhasma / Avaleha
- Dose (quantity + unit: mg/g/ml/tablets)
- Frequency: OD / BD / TDS / QDS / Pratimarsha Nasya / etc.
- Route: Oral / Nasal / Topical / Rectal
- Anupana (vehicle): linked to Master Dictionary
- Pathya (dietary do's): multi-select + free text
- Apathya (dietary don'ts): multi-select + free text
- Duration of treatment

**Control Arm:**
- Type: Placebo / Active Comparator / Waitlist / Usual Care
- If Placebo: describe placebo composition and matching strategy
- If Active Comparator: drug name, dose, frequency, duration

**Why this sub-module exists:**
The intervention details are the scientific identity of the trial. Anupana is not optional in Ayurveda — it determines which dhatu (tissue) the drug reaches and modifies the pharmacodynamics. Pathya/Apathya are protocol-required lifestyle instructions that the CRC must communicate to subjects. Without structured capture, this information is lost in free text. (Team A §4, Drug Formulation section; Team C §11.2 CDASH AYANUPANA variable)

---

#### 1.7 Visit Schedule Builder
PI defines the complete Time & Events table:

For each visit:
- Visit Name (V0 Screening / V1 Baseline / V2 Week 2 / etc.)
- Target Day (e.g., Day 0, Day 14, Day 28...)
- Window: ± N days (e.g., ± 3 days)
- Assessments at this visit (multi-select checklist):
  - [ ] Informed Consent
  - [ ] Prakriti Assessment
  - [ ] Dashawidha Pariksha
  - [ ] Vital Signs (BP, Pulse, Temp, Weight, SpO2)
  - [ ] Pain/Symptom Score (specify scale)
  - [ ] Laboratory Tests (specify panel)
  - [ ] Drug Dispensing
  - [ ] Drug Compliance Check
  - [ ] Adverse Event Review
  - [ ] Vikriti Reassessment
  - [ ] Physical Examination
  - [ ] Randomization

**Why this sub-module exists:**
The visit schedule is the backbone of all CRC work. SURTAMIND generates visit-specific CRF checklists from this table. Without it, CRCs don't know what to collect at each visit. Visit windows are protocol compliance checkpoints — a visit outside the window is a deviation. (Team A §3, Steps 8–9; Team A §4 Visit Schedule template)

---

#### 1.8 Outcome Measures
Primary and secondary outcomes:
- Outcome Name
- Domain (Efficacy / Safety / Patient-Reported / Ayurveda-Specific)
- Measurement Tool / Scale (WOMAC / VAS / SF-36 / Prakriti Stability Scale / custom)
- Measurement Timepoints (select from visit names defined in 1.7)
- Direction (Lower is better / Higher is better)
- Minimum Clinically Important Difference (MCID) — for primary

**Why this sub-module exists:**
Outcomes must be pre-specified before data collection to prevent selective reporting bias (a common criticism of Ayurveda trials). CTRI requires primary outcome specification. The measurement tool links to QS domain in SDTM. (Team C §11.3 SDTM QS domain)

---

#### 1.9 Statistical Analysis Plan
Fields:
- Expected effect size (primary outcome)
- Standard deviation (from literature)
- Power: 80% / 90%
- Significance level: 0.05 / 0.01
- Calculated Sample Size (auto-calculated from the above)
- Dropout rate assumed (%)
- Adjusted sample size (with dropout)
- Primary analysis: ITT / Per-Protocol / Both
- Statistical test for primary outcome
- Covariate adjustments
- Subgroup analyses (specify variables)

**Why this sub-module exists:**
Sample size justification is a mandatory component of every IEC submission. An underpowered study is ethically unjustifiable (exposes subjects to risk without sufficient chance of generating evidence). The plan must be pre-specified; post-hoc analysis changes are a major reason Ayurveda studies fail peer review. (Team A §2.1 — primary endpoint; Team B §3.2 — IEC scientific review requires this)

---

#### 1.10 Safety & AE/SAE Plan
Fields:
- AE monitoring frequency (every visit / continuous / monthly)
- SAE definition for this study (pre-specified in addition to standard criteria)
- Expected adverse events for this formulation (from classical texts/prior studies)
- Stopping rules (criteria for suspending the trial)
- SAE reporting chain: PI → Sponsor → IEC → CLA (auto-populated from user records)
- Contact for medical emergencies at site (24h phone)

**Why this sub-module exists:**
NDCT Rule 42 requires the protocol to pre-define the SAE reporting pathway. When an SAE actually occurs, there should be zero ambiguity about who calls who within what timeframe. SURTAMIND's SAE alert engine reads the reporting chain from this configuration. (Team B §8 — Safety & Pharmacovigilance)

---

#### 1.11 Ethics & CTRI Submission
This sub-module manages the IEC submission process:
- Upload final protocol PDF (version-stamped)
- Upload ICF (English + Hindi versions)
- Upload Investigator Brochure
- Upload Investigator CV + GCP certificate
- Enter IEC name and registration number
- Submit to IEC (changes protocol status to "IEC_SUBMITTED")
- → **TRIGGERS: In-app notification + Email to IEC Secretary**
- CTRI Number field (with format validation: CTRI/YYYY/MM/XXXXXX)
- CTRI certificate upload

**Enrollment Gate Logic:**
When CRC tries to enroll a subject:
- Check 1: IEC status = APPROVED → if not, block with message
- Check 2: CTRI number present and valid format → if not, block with message
- Check 3: IEC approval not expired → if expired, block with message
Only when all 3 pass → Enrollment screen opens

**Why this sub-module exists:**
NDCT Rules 29 and 30 make IEC approval and CTRI registration mandatory prerequisites for enrollment. These are not optional reminders — they are legal gates. A trial that enrolls without these is running illegally, and all data collected is inadmissible. (Team B §5.2 NDCT table, §9.1 CTRI)

---

#### 1.12 Protocol Amendment Workflow
When PI needs to change the approved protocol:
- Select Protocol Version to amend
- Select Changed Sections (checklist of protocol sections)
- Describe changes (one text field per changed section)
- Classify: Substantial Amendment / Non-Substantial Amendment
  - Substantial: change to endpoints, eligibility, intervention, safety, blinding → REQUIRES new IEC approval
  - Non-Substantial: administrative changes (typos, contact details) → Notification only
- Generate Amendment Letter (PDF auto-generated from changes)
- If Substantial → Submit to IEC (triggers IEC notification)
- If re-consent needed → system flags all enrolled subjects as "Re-consent Required"
- Protocol version increments (v1.0 → v1.1 → v2.0)
- All data collected under old version is tagged with old version number

**Why this sub-module exists:**
Protocols change during trials. NDCT Rule 35 requires substantial amendments to get new IEC approval. SURTAMIND makes version control automatic — every CRF record is stamped with the protocol version under which it was collected. This is critical for the Clinical Study Report. (Team B §7.5 Protocol Amendments)

---

### Module 5: Safety Center (PI)

#### 5.1 SAE Alert Dashboard
- Red alert banner when any SAE is reported (never dismissable until actioned)
- Countdown timer showing time remaining to submit initial report (24h from SAE occurrence)
- Per-SAE card showing: Subject ID, SAE type, reported by, time elapsed, your action required

#### 5.3 SAE Causality Assessment
PI completes the official causality assessment:
- Was it related to the investigational product?
- Was it related to a protocol-required procedure?
- Classification: Definitely / Probably / Possibly / Unlikely / Unrelated / Unassessable (WHO-UMC scale)
- Narrative (free text — this goes into the SAE report sent to CLA)
- Outcome: Recovered / Recovering / Not recovered / Fatal / Unknown
- Action taken: Drug withdrawn / Dose reduced / Drug continued / Hospitalized

**Why this module exists for PI:**
Only the PI can make the final causality determination on SAEs — this is a GCP mandate (Principle 7: medical decisions by qualified physicians). The causality finding determines whether the subject gets NDCT Chapter VI compensation. (Team B §8.1, §8.2)

---

### Module 6: Database Lock

#### 6.1 Pre-Lock Checklist
System auto-checks:
- [ ] All subjects have reached their End of Study visit (or are documented as Withdrawn/Completed)
- [ ] Zero OPEN queries remain
- [ ] All SAEs have causality assessments completed
- [ ] All protocol deviations documented
- [ ] Last data entry > 24 hours ago (confirmation period)
- [ ] Statistical Analysis Plan is finalized and uploaded to TMF

#### 6.2 Lock Confirmation
- PI types "CONFIRM LOCK" to prevent accidental locking
- Digital signature (Supabase session token timestamp = legal signature)
- All write access to clinical tables REVOKED for all roles immediately
- Notification sent to all study team members

**Why this module exists:**
Database lock is the legal endpoint of data collection. It prevents data manipulation after lock, which is a fundamental regulatory requirement. Post-lock, only the Statistician can read data (read-only, anonymized). (Team C §13.1 ALCOA+ "Accurate"; Team A §3 Step 10)

---

## 8. Role 3 — Study Coordinator (CRC)

### Who Is the CRC?

The Clinical Research Coordinator (Study Coordinator) is the **operational backbone** of the trial — the person at the site who actually interacts with subjects, collects data, and enters it into SURTAMIND. Typically a trained nurse, dietician, or junior Vaidya at AIIA/CCRAS sites.

### What CRC Sees (Complete Module List)

```
CRC Dashboard
├── 1. Screening & Enrollment Module
│   ├── 1.1 Screening Log Entry
│   ├── 1.2 Eligibility Checker
│   ├── 1.3 Informed Consent Management
│   └── 1.4 Subject Registration & Randomization
│
├── 2. Participant Management
│   ├── 2.1 My Subjects List (this site only)
│   ├── 2.2 Subject Profile View
│   └── 2.3 Withdrawal Management
│
├── 3. eCRF Data Entry Module
│   ├── 3.1 Ayurveda Baseline CRF
│   ├── 3.2 Visit CRF (per visit, per subject)
│   ├── 3.3 Drug Dispensing Record
│   └── 3.4 Drug Compliance Record
│
├── 4. Visit Scheduling Module
│   ├── 4.1 My Visit Calendar
│   ├── 4.2 Schedule / Reschedule Visit
│   └── 4.3 Missed Visit Documentation
│
├── 5. AE / SAE Reporting Module
│   ├── 5.1 Record Adverse Event
│   └── 5.2 Report Serious Adverse Event (SAE)
│
├── 6. Query Response Module
│   ├── 6.1 My Open Queries (from Monitor/PI)
│   └── 6.2 Submit Response to Query
│
└── 7. Reference Module (Read-Only)
    ├── 7.1 View Approved Protocol
    ├── 7.2 View Visit Schedule
    └── 7.3 View Master Dictionary
```

---

### Module 1: Screening & Enrollment

#### 1.1 Screening Log Entry
Every patient assessed for trial eligibility gets a Screening Log entry — even if they don't qualify:

Fields:
- Screening Number (auto: SCR-001, SCR-002...)
- Date of Screening
- Patient Initials (first + last initial only — anonymized)
- Age (approximate)
- Sex
- OPD Registration Number (for source document link)
- Eligibility Assessment: run through each inclusion/exclusion criterion (checkboxes auto-populated from protocol)
- Result: Eligible / Not Eligible
- Reason for exclusion (multi-select from protocol exclusion list)
- Notes (free text)

**Why:** Screening log is mandatory per GCP. Monitors review it to confirm no selection bias. CTRI and IEC require it for continuing review submissions. Even failed screens must be documented so regulators can verify the enrollment rate was realistic and unmanipulated. (Team A §4.3; Team B §6.3 SDV)

---

#### 1.2 Eligibility Checker
Interactive checklist of all inclusion and exclusion criteria from the protocol:
- CRC checks each criterion
- Green checkmark when inclusion criterion met, red X when exclusion criterion present
- System calculates: "ELIGIBLE" only when ALL inclusions are ✅ and ALL exclusions are ❌
- Auto-populates the Screening Log entry result

**Why:** Reduces eligibility verification errors. In a manual system, a CRC might accidentally enroll a patient who meets an exclusion criterion. This interactive checker is a validation layer before consent is sought.

---

#### 1.3 Informed Consent Management
Per-subject consent records:
- Subject Initials (pre-filled from screening)
- Date consent signed
- ICF Version used (linked to protocol ICF version)
- Consented by: Subject Self / LAR + Witness (for illiterate/incapacitated)
- LAR Name + Relationship (if applicable)
- Witness Name + Contact (if applicable)
- A/V Recording: Yes / No / Not Applicable
- A/V Recording file ID (if yes — link to uploaded recording)
- CRC who witnessed: auto-populated from login
- Consent status: OBTAINED / PENDING / WITHDRAWN

**Why:** Informed consent is the legal permission for the subject to be in the trial. Without documented consent, every procedure performed is an ethical violation. NDCT Rule 44 specifies exact consent requirements including A/V recording for vulnerable subjects. (Team B §7.3)

---

#### 1.4 Subject Registration & Randomization
After consent is obtained and eligibility confirmed:
- Subject ID auto-generated (format from protocol: e.g., OA-001, OA-002...)
- Demographics: Full Name (encrypted), DOB, Age, Sex, Address (encrypted)
- Contact: Phone (encrypted), Emergency contact
- Modern Diagnosis (ICD-11 code via NAMASTE)
- Vyadhi Code (Ayurveda diagnosis, from Master Dictionary)
- Disease Duration (months)
- Randomization:
  - System generates Randomization ID based on method defined in protocol (Simple / Block / Stratified)
  - Arm assigned: Intervention A / Control B (or specific arm names)
  - Randomization sealed until system confirms enrollment is approved by PI

**Why:** Subject registration creates the permanent clinical identity. Randomization must be system-generated (not manual) to prevent selection bias and ensure allocation concealment — a fundamental RCT requirement. (Team A §2.4 Randomization; Team B §7 Ethics)

---

### Module 3: eCRF Data Entry

#### 3.1 Ayurveda Baseline CRF
Completed at V0 or V1 for each enrolled subject:

**Section A — Modern Parameters:**
- Vital Signs: BP (systolic/diastolic), Pulse, Temperature, SpO2, Weight, Height, BMI (auto-calculated)
- Primary Outcome Baseline: e.g., WOMAC pain score, VAS score (populated from protocol)
- Secondary Outcome Baseline: e.g., ROM, SF-36 (populated from protocol)
- Laboratory Results: linked fields for values from specified lab panel (CBC, LFT, RFT, etc.)

**Section B — Ayurveda Assessment (the unique SURTAMIND differentiator):**
- Prakriti (dropdown: 7 types from Master Dictionary)
- Vikriti (current doshic state, free text + dropdown)
- Dashawidha Pariksha (10 fields — see F-01 detailed specification)
- Nidana (etiology, multi-select from disease-specific list)
- Chief Complaint + Duration
- Purvarupa (premonitory symptoms)
- Rupa (current clinical features)
- Chikitsa Type: Shodhana / Shamana

**Section C — Formulation Details:**
- Formulation Name (pre-filled from intervention arm)
- Dose, Frequency, Route (pre-filled from protocol, editable for actual dispensed)
- Anupana (pre-filled, editable)
- Pathya/Apathya communicated to patient: Yes / No

**ALCOA+ enforcement:**
- All fields timestamped at entry
- CRC user auto-attributed on every field
- Any modification requires reason entry → auto-logged in audit_trail
- No field can be blank if marked mandatory in protocol

**Why:** This CRF is the primary scientific record of each subject's participation. The Ayurveda section is what no other CTMS captures — it's what makes SURTAMIND data scientifically meaningful within the Ayurvedic paradigm. (Team A §4.2; Team C §11.2 CDASH extensions)

---

#### 3.2 Visit CRF (per visit, per subject)
Only shows fields relevant to that specific visit (from the Visit Schedule built by PI):
- Visit Date (validated against window: target ± N days)
- Late/Early flag (auto: if outside window → "PROTOCOL DEVIATION — DOCUMENT REASON")
- Vital Signs (if in visit schedule)
- Primary/Secondary Outcome Assessment (if in visit schedule)
- Drug Compliance: Took all doses / Missed some / Stopped (if visit has compliance check)
- Pills remaining: count entered → system calculates % compliance
- Adverse Events since last visit (structured entry)
- Vikriti reassessment (if in visit schedule)
- Investigator Notes (free text)
- Save as DRAFT (can return to edit) or COMPLETE (triggers validation)

**On COMPLETE:**
- All mandatory fields validated
- Out-of-range values → auto-query generated and assigned to CRC
- Visit status changes to COMPLETED
- Next visit reminder scheduled

**Why:** Visit-specific CRFs prevent CRCs from seeing irrelevant fields (reduces errors). Auto-validation catches data quality issues at point of entry rather than during SDV weeks later. (Team C §13.4 Query Management; Team A §3 Step 8)

---

### Module 5: AE/SAE Reporting

#### 5.1 Record Adverse Event (AE)
- Subject ID (select)
- Visit (select — or "Between Visits")
- AE Term (free text + MedDRA auto-suggest from Master Dictionary)
- Onset Date
- Severity: Mild / Moderate / Severe
- Relationship to drug: Related / Not Related / Unknown
- Action: None / Dose reduced / Drug withdrawn / Concomitant medication added
- Outcome: Ongoing / Resolved / Unknown
- Resolution Date (if resolved)

**Why:** Every untoward event must be captured even if mild. AE patterns are reviewed by the PV Officer for signal detection. (Team B §8.1)

#### 5.2 Report Serious Adverse Event (SAE)
When CRC identifies an SAE:
- All AE fields above
- PLUS mandatory SAE classification: Death / Life-threatening / Hospitalization required / Prolongs hospitalization / Significant disability / Congenital anomaly
- Date/Time of SAE occurrence
- Date/Time CRC became aware
- Description (narrative, minimum 100 characters)
- Was subject hospitalized? Hospital name + dates
- Immediate action taken
- Medical management provided

**On SUBMIT:**
- 🚨 **IMMEDIATE IN-APP ALERT** pushed to PI dashboard (red banner, non-dismissable)
- 🚨 **IMMEDIATE IN-APP ALERT** pushed to IEC dashboard
- 🚨 **EMAIL SENT** to PI (registered email)
- 🚨 **EMAIL SENT** to IEC Secretary email
- **24-HOUR COUNTDOWN TIMER** starts on PI Safety Center dashboard
- SAE record locked from further CRC editing (PI must now assess)

**Why:** This is the most safety-critical flow in the entire system. NDCT Rule 42 requires 24-hour reporting. Manual processes fail — people forget, emails get buried. SURTAMIND's automated alert engine makes it impossible to miss. (Team B §8.2 SAE Reporting Timeline)

---

## 9. Role 4 — Monitor (CRA)

### Who Is the Monitor?

The Monitor (Clinical Research Associate / CRA) is assigned by the Sponsor to **verify the quality of the trial** at each site. They do NOT treat patients or enter data — they verify that what's in SURTAMIND matches what's in the source documents (SDV). (Team B §6.3)

### What Monitor Sees (Complete Module List)

```
Monitor Dashboard
├── 1. Site Monitoring Module
│   ├── 1.1 My Assigned Sites
│   ├── 1.2 Site Overview (enrollment, visit completion, open queries)
│   └── 1.3 Monitoring Visit Log
│
├── 2. Source Data Verification (SDV) Module
│   ├── 2.1 Participant List (enrolled at my sites)
│   ├── 2.2 CRF Field-Level SDV Interface
│   ├── 2.3 SDV Completion Tracker (% per subject)
│   └── 2.4 SDV Visit Report
│
├── 3. Query Management (Monitor View)
│   ├── 3.1 Raise New Query (on any CRF field)
│   ├── 3.2 View My Open Queries
│   ├── 3.3 View Answered Queries (review responses)
│   └── 3.4 Re-open Query (if answer is insufficient)
│
├── 4. Protocol Deviation Tracker
│   ├── 4.1 Log Protocol Deviation
│   ├── 4.2 Deviation Classification
│   └── 4.3 CAPA Recommendation
│
├── 5. Monitoring Visit Report Module
│   ├── 5.1 Create Visit Report (SIV / RMV / COV)
│   ├── 5.2 Attach Findings
│   └── 5.3 Submit Report (to PI + Sponsor)
│
└── 6. Read-Only Access
    ├── 6.1 View Protocol (read-only)
    ├── 6.2 View Audit Trail (for their site)
    └── 6.3 View Ethics Status
```

---

### Module 2: Source Data Verification (SDV)

#### 2.2 CRF Field-Level SDV Interface
This is the Monitor's primary tool. For each subject, for each visit:
- All CRF fields are displayed
- Monitor reviews each value against source document (they have the paper records in front of them)
- For each field: Mark as "Verified ✅" or "Query ❓"
- If Query: immediately raises a query linked to that exact field

**SDV Status per field:**
- ⬜ Unreviewed
- ✅ Verified (matches source)
- ❓ Query Raised (discrepancy found)
- 🔒 Query Resolved (verified after correction)

**Why:** SDV is the primary quality mechanism in clinical trials. It is the process that makes clinical trial data trustworthy. Without SDV, there is no way to know if the eCRF reflects reality. SURTAMIND's field-level SDV interface makes the verification process systematic and auditable. (Team B §6.3 SDV; Team C §10.1 Stage 4 of data lifecycle)

---

### Module 3: Query Management

#### 3.1 Raise New Query
- Select Subject + Visit + CRF Field
- Query type: Data Discrepancy / Missing Value / Out of Range / Protocol Deviation / Clarification Needed
- Severity: Critical (affects primary endpoint or safety) / Major / Minor
- Query Text (the specific question to the CRC)
- Auto-linked to the exact CRF field (Query card appears inline on the CRF field)

#### 3.3 Review Answered Queries
- CRC has responded
- Monitor reads the response
- If satisfied: No action (PI closes the query)
- If not satisfied: Re-open the query with additional question

**Why:** The Monitor cannot close queries — only the PI can. This is deliberate. It creates a three-party chain of custody: Monitor raises → CRC responds → PI closes. This separation prevents data manipulation collusion. (Team C §13.4 Query Management; Team B §6.2 RACI — Monitor=Responsible, PI=Accountable for query closure)

---

### Module 4: Protocol Deviation Tracker

#### 4.1 Log Protocol Deviation
When Monitor discovers a departure from the approved protocol:
- Subject ID (or leave blank for site-level deviation)
- Deviation type: Eligibility / Visit Window / Drug Compliance / Consent / Laboratory / Endpoint Assessment / Reporting / Other
- Description
- Was it discovered: Before / During / After it occurred
- Severity: Minor (no impact on subject safety or data integrity) / Major (potential impact) / Critical (impact on key endpoints or subject safety)
- Root Cause
- CAPA Plan (Corrective + Preventive action)
- PI acknowledgment required (PI signs off on CAPA)

**Why:** GCP requires all protocol deviations to be documented, evaluated, and corrected. Undocumented deviations are a primary reason regulatory inspections fail. SURTAMIND's deviation tracker creates the paper trail needed for the CSR deviation section. (Team B §6.3 CAPA; Team C §13.1 ALCOA+ "Accurate")

---

### Module 5: Monitoring Visit Report

Three visit types:
- **SIV (Site Initiation Visit):** Before first subject enrolled — verifies site is ready
- **RMV (Routine Monitoring Visit):** During active enrollment — ongoing quality check
- **COV (Close-Out Visit):** After last subject completes — ensures complete TMF, final reconciliation

Report contains:
- Date + Site visited
- Staff met
- Number of subjects screened/enrolled/completed/withdrawn since last visit
- SDV % completed
- Open queries count (by severity)
- Deviations found
- Action items (numbered list with responsible person and deadline)
- Next visit planned date

**Why:** Monitoring visit reports are TMF documents — they must be inspection-ready. They also serve as the communication channel between Monitor and PI for quality improvement. Risk-based monitoring plans prioritize sites based on these reports. (Team B §6.3 Monitoring; Team B §9.2 TMF)

---

## 10. Role 5 — Ethics Committee (IEC)

### Who Is the IEC Member?

The Institutional Ethics Committee (IEC) member is a **participant protection authority** — legally mandated to review all research at their institution before it begins. They may be physicians from other departments, legal experts, social scientists, or community representatives. They do NOT see patient-level data. (Team B §7.1 IEC Composition)

### What IEC Sees (Complete Module List)

```
IEC Dashboard
├── 1. Protocol Review Module
│   ├── 1.1 Incoming Protocol Submissions (with notification)
│   ├── 1.2 Scientific Review Panel
│   ├── 1.3 Ethics Review Panel
│   ├── 1.4 Query / Clarification Request
│   └── 1.5 Issue Approval / Rejection Letter
│
├── 2. Active Studies Monitor (Meta-Level Only)
│   ├── 2.1 Study Status Overview (no patient data)
│   ├── 2.2 Enrollment Progress (aggregate count only)
│   └── 2.3 SAE Summary (counts and types, no patient identifiers)
│
├── 3. Continuing Review Module
│   ├── 3.1 Continuing Review Schedule
│   ├── 3.2 Annual Progress Report Review
│   └── 3.3 Re-approve / Suspend / Close Study
│
├── 4. SAE Notification Center
│   ├── 4.1 SAE Alerts (in-app notification + email)
│   ├── 4.2 SAE Summary View (aggregate, no patient ID)
│   └── 4.3 IEC SAE Opinion Submission (to CLA, within 30 days)
│
├── 5. Amendment Review Module
│   ├── 5.1 Incoming Amendment Submissions
│   ├── 5.2 Review Changes
│   └── 5.3 Approve / Reject Amendment
│
└── 6. IEC Meeting Management
    ├── 6.1 Meeting Calendar
    ├── 6.2 Agenda Builder
    └── 6.3 Meeting Minutes Entry
```

---

### Module 1: Protocol Review Module

#### 1.1 Incoming Protocol Submissions
When PI submits a protocol:
- **IN-APP NOTIFICATION** appears on IEC dashboard: "New Protocol Submitted for Review: [Study Title] by [PI Name]"
- **EMAIL sent** to IEC Secretary
- Submission card shows: Study Title, PI, Submission Date, Protocol Version, all attached documents (protocol PDF, ICF, IB, Investigator CV)

**Why:** The IEC cannot begin review without being notified. Manual submission processes (physical couriers, emails) create delays and lost documents. Supabase Realtime ensures the notification is instant.

---

#### 1.2 Scientific Review Panel
IEC assigns subject matter experts (including mandatory ≥2 Ayurveda experts per ICMR RIM Addendum) to review:
- Study design soundness
- Sample size adequacy
- Statistical plan validity
- Feasibility at the site
- Literature review completeness
- Outcome measure appropriateness

Each reviewer submits a structured scientific review form with: Adequate/Inadequate rating per section + Comments.

#### 1.3 Ethics Review Panel
Full board reviews:
- Risk-benefit ratio
- Consent process adequacy
- Vulnerable population protections
- Compensation plan (does it meet NDCT Chapter VI requirements?)
- Conflicts of interest disclosures

#### 1.4 Query / Clarification Request
IEC can send written queries to PI:
- Select protocol section
- Type query
- → **IN-APP NOTIFICATION** to PI
- PI responds through PI's Protocol module
- → **IN-APP NOTIFICATION** back to IEC

#### 1.5 Issue Approval/Rejection Letter
After full board vote:
- Decision: Approved / Rejected / Approved with Conditions / More Information Required
- Approval validity: [Date] to [Date + 1 year]
- Approved Protocol Version: [v1.0]
- Approved ICF Version: [v1.0]
- Conditions (if any): text field
- Generate Approval Letter (PDF auto-generated with IEC letterhead format)
- Upload signed approval letter
- → **IN-APP NOTIFICATION** to PI + Admin
- → **EMAIL sent** to PI

**Why this entire module exists:**
IEC approval is a mandatory prerequisite for enrollment (NDCT Rule 29). The IEC is the first and most important safety layer. Digital IEC workflow eliminates paper submissions, courier delays, and lost documents — problems that currently cause 2–4 week delays in Ayurveda trial approval. (Team B §7.2 Ethics Approval Workflow)

---

### Module 4: SAE Notification Center

#### 4.1 SAE Alerts
When CRC reports an SAE:
- **IMMEDIATE IN-APP ALERT** on IEC dashboard (red banner, stays until acknowledged)
- **EMAIL sent** to IEC Secretary email
- Alert card shows: Study, SAE type, time reported (no patient identifiers)
- IEC acknowledges receipt (within 24h of PI's report)

#### 4.3 IEC SAE Opinion Submission
Within 30 days of SAE occurrence, IEC must submit opinion to CLA:
- Summary of SAE (from PI's causality report)
- IEC causality opinion: Agree with PI / Disagree (with reason) / Cannot Determine
- Recommendation: Continue trial / Suspend trial / Terminate trial
- Generate IEC SAE Opinion Letter (PDF)
- Upload signed letter
- Mark as submitted to CLA (with date)

**Why:** NDCT Rule 42 requires IEC to forward its opinion to CLA within 30 days. Failure to do so is a compliance violation. SURTAMIND tracks this deadline and alerts IEC when 7 days remain. (Team B §8.2 SAE Reporting Timeline)

---

### What IEC Cannot See
- Individual patient names or identifiers
- CRF field-level data
- Subject demographics beyond aggregates
- Drug dispensing records
- Queries between Monitor and CRC

**Why:** Privacy protection. IEC's role is study-level governance, not patient-level care. This data segregation is a privacy principle (GCP Principle 11). (Team C §13.3 RBAC matrix)

---

## 11. Role 6 — Pharmacovigilance Officer (PV)

### Who Is the PV Officer?

The Pharmacovigilance Officer is responsible for **drug safety surveillance** throughout the trial. At AIIA, this role connects to the National Pharmacovigilance Centre for Ayush (NPvCC-Ayush) located there. They analyze AE/SAE patterns to detect emerging safety signals. (Team B §8.3)

### What PV Officer Sees (Complete Module List)

```
PV Dashboard
├── 1. Safety Surveillance Dashboard
│   ├── 1.1 AE/SAE Count Summary (by severity, by system organ class)
│   ├── 1.2 SAE Alert Feed (real-time)
│   ├── 1.3 AE Timeline Chart
│   └── 1.4 AE by Formulation Chart
│
├── 2. Individual AE/SAE Review Module
│   ├── 2.1 AE/SAE List (all events, anonymized)
│   ├── 2.2 SAE Detail View
│   └── 2.3 Log Additional Observations
│
├── 3. Causality Assessment Module
│   ├── 3.1 WHO-UMC Causality Wizard
│   └── 3.2 Naranjo Scale Calculator
│
├── 4. Signal Detection Module
│   ├── 4.1 Frequency Threshold Alerts
│   ├── 4.2 Disproportionality Analysis
│   └── 4.3 Signal Report Generator
│
├── 5. Safety Report Generation (P2)
│   ├── 5.1 CIOMS I Form Generator
│   ├── 5.2 E2B XML Export (for PvPI/VigiFlow)
│   └── 5.3 Development Safety Update Report (DSUR)
│
└── 6. Reference (Read-Only)
    ├── 6.1 Protocol Safety Plan
    └── 6.2 Investigational Product information (from Master Dictionary)
```

---

### Module 3: Causality Assessment Module

#### 3.1 WHO-UMC Causality Wizard
Step-by-step guided assessment:
1. Is there a plausible time sequence between drug administration and the AE? → Y/N
2. Did the reaction follow a known pharmacological pattern for this drug? → Y/N
3. Did the AE improve when the drug was stopped? → Y/N
4. Did the AE reappear on re-challenge? → Y/N/NA
5. Are there alternative explanations (comorbidity, concomitant medication)? → Y/N

**Output: Certain / Probable-Likely / Possible / Unlikely / Conditional-Unclassified / Unassessable**

**Why:** Causality determines whether the event must be reported to PvPI and whether NDCT Chapter VI compensation applies. A systematic wizard prevents inconsistent assessments between different reviewers. (Team B §8.3 PvPI — WHO-UMC scale)

---

### Module 4: Signal Detection

#### 4.1 Frequency Threshold Alerts
System auto-alerts PV Officer when:
- Same AE term appears in > 3 subjects (configurable threshold)
- Same AE term appears in > 10% of enrolled subjects
- Any AE classified as "Severe" appears more than once
- Any unexpected SAE (not listed in protocol's expected AEs list)

**Why:** Signal detection is the primary purpose of pharmacovigilance. A single SAE may be coincidence; a pattern of similar events may indicate a drug safety signal that requires trial modification or termination. This is how Ayurveda pharmacovigilance generates real-world safety evidence. (Team B §8.3 Signal Detection; AIIA NPvCC-Ayush mandate)

---

## 12. Cross-Role Notification Matrix

This table summarizes every automated notification in the system:

| Event | CRC | PI | Monitor | IEC | PV | Admin | Email? |
|-------|-----|----|---------|-----|----|-------|--------|
| SAE Reported | (sent) | 🚨 Alert | — | 🚨 Alert | 🚨 Alert | — | ✅ PI + IEC |
| AE Reported | — | 🔔 | — | — | 🔔 | — | ❌ |
| Protocol submitted to IEC | — | — | — | 🔔 | — | 🔔 | ✅ IEC |
| IEC Approves Protocol | 🔔 | 🔔 | — | — | — | 🔔 | ✅ PI |
| IEC Rejects Protocol | — | 🚨 | — | — | — | 🔔 | ✅ PI |
| IEC Approval expiring (30d) | — | 🔔 | — | — | — | 🔔 | ✅ PI + Admin |
| Protocol Amended | 🔔 | — | 🔔 | 🔔 | — | 🔔 | ✅ IEC + CRC |
| Query Raised (Monitor→CRC) | 🔔 | 🔔 | — | — | — | — | ❌ |
| Query Answered | — | 🔔 | 🔔 | — | — | — | ❌ |
| Query Closed | 🔔 | — | 🔔 | — | — | — | ❌ |
| Critical Query Unresolved 48h | 🔔 | 🚨 | — | — | — | — | ✅ PI |
| Visit Overdue (missed window) | 🚨 | 🔔 | — | — | — | — | ❌ |
| Enrollment Target Reached | — | 🔔 | 🔔 | — | — | 🔔 | ✅ PI |
| Re-consent Required | 🚨 | — | — | — | — | — | ❌ |
| Database Locked | 🔔 | — | 🔔 | 🔔 | — | 🔔 | ✅ All |
| GCP Cert Expiring (30d) | 🔔 | 🔔 | 🔔 | 🔔 | 🔔 | 🔔 | ✅ User |
| Safety Signal Detected | — | 🚨 | — | 🚨 | 🚨 | — | ✅ PI + IEC |
| New User Added to Study | 🔔 | 🔔 | 🔔 | 🔔 | 🔔 | — | ✅ New User |

**Legend:** 🚨 = Critical alert (non-dismissable red banner) | 🔔 = Standard notification | — = Does not receive

---

## 13. Feature Visibility Matrix

Complete summary of which features each role can access:

| Module / Feature | Admin | PI | CRC | Monitor | IEC | PV |
|-----------------|-------|-----|-----|---------|-----|----|
| **Authentication** |
| Login / Logout | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Password reset | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Admin Only** |
| User Management | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Master Dictionary | ✅ | 👁️ | ❌ | 👁️ | ❌ | ❌ |
| Study shell creation | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| System settings (SMTP) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Full audit log | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Sync status dashboard | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Protocol** |
| Create/edit protocol | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View protocol | 👁️ | ✅ | 👁️ | 👁️ | 👁️ | 👁️ |
| Submit protocol to IEC | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Protocol amendment | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Ethics (IEC)** |
| Review protocol submissions | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Approve/Reject protocol | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| View IEC status | ✅ | ✅ | ❌ | 👁️ | ✅ | ❌ |
| Submit SAE opinion to CLA | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Screening & Enrollment** |
| Screening log entry | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Eligibility checker | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Consent management | ❌ | ✅ (approve) | ✅ (enter) | ❌ | ❌ | ❌ |
| Subject registration | ❌ | ✅ (approve) | ✅ (enter) | ❌ | ❌ | ❌ |
| View enrollment list | ✅ | ✅ | ✅ (own site) | ✅ (own site) | ❌ | 👁️ (anon) |
| **eCRF** |
| Ayurveda Baseline CRF entry | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Visit CRF entry | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| View CRF data | ✅ | ✅ | ✅ | ✅ | ❌ | 👁️ (anon) |
| Edit CRF (post-entry) | ❌ | ✅ | ✅ + reason | ❌ | ❌ | ❌ |
| Drug dispensing record | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Safety** |
| Log AE | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Report SAE | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| View SAE alerts | ❌ | ✅ (🚨) | ❌ | ❌ | ✅ (🚨) | ✅ (🚨) |
| SAE causality assessment | ❌ | ✅ | ❌ | ❌ | 👁️ | ✅ |
| Safety reports / CIOMS | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Signal detection | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Queries** |
| Raise query | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Respond to query | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Close query | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View all queries | ✅ | ✅ | ✅ (own) | ✅ (own) | ❌ | ❌ |
| **SDV & Monitoring** |
| Source Data Verification | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Monitoring visit reports | ❌ | 👁️ | ❌ | ✅ | ❌ | ❌ |
| Protocol deviation log | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |
| View audit trail | ✅ | ✅ (own site) | ❌ | ✅ (own site) | ❌ | ❌ |
| **Database Lock** |
| Initiate database lock | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View locked database | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| **Data Export** |
| SDTM export | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Analytics dashboard | ✅ | ✅ | 👁️ | 👁️ | ❌ | 👁️ |
| **Documents (TMF)** |
| Upload TMF documents | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ |
| View TMF | ✅ | ✅ | ✅ | ✅ | 👁️ | ❌ |

**Legend:** ✅ = Full access | 👁️ = Read-only | 🚨 = Receives alert | ❌ = No access

---

*End of SURTAMIND Role-by-Role Features Specification — Version 2.0*
*September 2026 | Built for Smart India Hackathon (SIH) + AIIA Clinical Research Division*
