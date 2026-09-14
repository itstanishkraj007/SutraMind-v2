# SURTAMIND Research Compendium
## Smart Clinical Trial Management System for Ayurveda — SIH Documentation

> **Version:** 1.0 | **Date:** September 2026
> **Compiled by:** SURTAMIND Research Division (Teams A, B & C)

---

## Table of Contents

| Section | Team | Topic |
|---------|------|-------|
| Part 1 — Ayurveda & Clinical Research Foundation | Team A | §1–4 |
| Part 2 — Regulatory, Ethics & Compliance Framework | Team B | §5–9 |
| Part 3 — Technology, Data Standards & Digital CTMS | Team C | §10–14 |
| Part 4 — SURTAMIND System Mapping | Joint | §15 |
| Appendix — Glossaries & Reference Tables | All Teams | §16 |

---

# PART 1: AYURVEDA & CLINICAL RESEARCH FOUNDATION
### Team A — Domain & Workflow Research

---

## §1 — Ayurveda Research Ecosystem

### 1.1 Ministry of Ayush

The **Ministry of Ayush** (Ayurveda, Yoga & Naturopathy, Unani, Siddha, Sowa-Rigpa, and Homoeopathy) is the apex body under the Government of India responsible for developing, promoting, and regulating traditional medicine systems.

**Role & Mandate:**
- Formulates national policies for Ayush systems
- Provides intramural (in-house) and extramural (grants) research funding
- Coordinates national health programs integrating Ayush with modern healthcare
- Oversees National Institutes: AIIA, NIA, NIUM, NIMH

**Coordination with CDSCO:** CDSCO has a dedicated "Ayush vertical" for safety, quality, and efficacy oversight of ASU drugs. Ministry of Ayush and CDSCO co-regulate drug licensing and clinical trial approvals for Ayurvedic proprietary medicines.

**Coordination with ICMR:** A formal MoU was signed between Ministry of Ayush and ICMR in 2023 to promote Integrative Health Research, establishing joint ethical guidelines for evaluating traditional interventions using modern research methodologies.

**Organizational Hierarchy:**
```
Government of India
└── Ministry of Ayush
    ├── AIIA (All India Institute of Ayurveda) — New Delhi [apex clinical institute]
    ├── NIA (National Institute of Ayurveda) — Jaipur
    ├── NIUM (National Institute of Unani Medicine) — Bengaluru
    ├── NIMH (National Institute of Naturopathy) — Pune
    └── CCRAS (Central Council for Research in Ayurvedic Sciences) [apex research council]
        ├── CARI (Central Ayurveda Research Institute) — Mumbai
        ├── RARI (Regional Ayurveda Research Institutes) — PAN India (8 institutes)
        └── Peripheral Institutes (17 nationwide)
```

---

### 1.2 All India Institute of Ayurveda (AIIA)

AIIA, New Delhi, is the apex national institute for Ayurveda — hospital, teaching institution, and research centre simultaneously.

**Departments Conducting Clinical Research:**
- Kayachikitsa (Internal Medicine) — most active in RCTs
- Panchakarma (Bio-purification therapies)
- Shalakya Tantra (ENT & Ophthalmology)
- Prasuti Tantra & Stri Roga (Obstetrics & Gynaecology)
- Kaumarbhritya (Paediatrics)
- Shalya Tantra (Surgery)

**Patient Journey inside AIIA (OPD → Trial Enrollment):**
```
Patient Arrives at OPD Registration
       ↓
Initial Triage & Token Assignment
       ↓
Doctor Consultation (Ayurvedic + modern history)
       ↓
Prakriti Assessment & Nadi Pariksha
       ↓
Laboratory & Diagnostic Tests ordered
       ↓
Pre-Screening for Active Trials (entry into Screening Log)
       ↓
Screening Informed Consent obtained
       ↓
Full Baseline Assessment (V0)
       ↓
Randomization & Subject ID assigned
       ↓
Treatment Dispensed (V1)
       ↓
Scheduled Follow-up Visits (V2–V5)
       ↓
End of Study → Database Lock → Publication
```

**National Pharmacovigilance Centre for Ayush:** Located at AIIA — the nodal point for Ayurveda ADR reporting in India.

---

### 1.3 CCRAS vs AIIA — Key Differences

| Feature | AIIA | CCRAS |
|---------|------|-------|
| Primary Role | Hospital + Teaching + Research | Research Council only |
| Patient Care | Yes (OPD + IPD) | Limited (at peripheral institutes) |
| Clinical Trials | Site-level, single institution | Multi-centric across India |
| Drug Validation | Translational studies | Full lifecycle drug evaluation |
| National Mandate | Clinical excellence | Research coordination |

**Why CCRAS Multi-centric Trials Need SURTAMIND:** CCRAS coordinates trials across 5–8 peripheral institutes simultaneously. A "Nodal Institute" manages protocol implementation and data. This demands a centralized CTMS for data consistency — exactly what SURTAMIND provides.

---

### 1.4 ICMR Collaboration

- Published **National Ethical Guidelines for Biomedical and Health Research** (2017) — primary ethical framework
- Published **Addendum for Research in Integrative Medicine (RIM)** — IECs reviewing Ayush trials must co-opt ≥2 Ayush subject matter experts
- Co-investigator in Joint ICMR+Ayurveda multi-centre studies (COVID-19, RA, OA)

---

### 1.5 Evidence-Based Ayurveda (EBA) — Why It's the Biggest Challenge

| Challenge | Root Cause |
|-----------|-----------|
| Individualized treatment | RCTs require uniform interventions; Ayurveda is personalized to Prakriti |
| Placebo difficulty | Herbal formulations have distinct taste/smell/color — true blinding is near-impossible |
| Raw material variability | Plant potency varies by season, geography, and processing — batch inconsistency |
| Lack of validated instruments | No universal scales for Ayurvedic outcomes (Agni, Ojas, Bala) |
| Publication gap | Many completed trials unpublished due to negative results or limited funding |
| Regulatory ambiguity | Classical drugs bypass phase trials; proprietary formulations require full trial data |

**WHO Perspective:** WHO's *Traditional Medicine Strategy 2019–2025* recommends pragmatic clinical trials as the most suitable design for traditional medicine systems.

---

## §2 — Clinical Trial Fundamentals

### 2.1 What is a Clinical Trial?

A **clinical trial** is a prospective human research study assigning participants to health-related interventions to evaluate effects on outcomes. It is hypothesis-driven, protocol-governed, and ethically reviewed.

**Example (Ayurveda for OA Knee):**

| Component | Example |
|-----------|---------|
| Hypothesis | "Shallaki 500mg TID reduces WOMAC pain score ≥30% vs placebo at 8 weeks" |
| Intervention | Boswellia serrata extract 500mg capsule three times daily |
| Control group | Identical starch placebo capsule |
| Primary endpoint | % change in WOMAC pain score at Week 8 |
| Secondary endpoints | ROM (range of motion), quality of life (SF-36), Prakriti stability score |

---

### 2.2 Phases of Clinical Research

| Phase | Purpose | Participants | Ayurveda Context |
|-------|---------|-------------|-----------------|
| Phase 0 | Micro-dosing pharmacokinetics | 10–15 | Rarely applicable |
| Phase I | Safety, maximum tolerated dose | 20–80 healthy | Classical ASU drugs often skip (traditional use documented) |
| Phase II | Efficacy signal + dose finding | 100–300 patients | Typical entry point for Ayurveda formulations |
| Phase III | Large-scale efficacy + comparative | 300–3000+ | Required for new indications or proprietary formulations |
| Phase IV | Post-marketing surveillance | Population-level | Pharmacovigilance; long-term safety |

> **ASU Drug Pathway:** Classical formulations per Schedule I of D&C Act, used for their traditional indications, often enter Phase II/III directly without Phase I safety studies.

---

### 2.3 Interventional vs. Observational Studies

| Aspect | Interventional | Observational |
|--------|---------------|--------------|
| Assignment | Investigator assigns treatment | Observes existing treatment |
| Randomization | Possible | Not applicable |
| Evidence quality | Highest (RCT) | Moderate–Low |
| Best Ayurveda use | Testing formulation vs placebo | Studying Prakriti-disease correlations |

---

### 2.4 RCT — Randomization & The Blinding Problem

**Randomization Types:**
- **Simple:** Coin-toss equivalent; can create imbalanced groups in small trials
- **Block (n=4–6):** Ensures equal allocation at intervals; standard for most Ayurveda trials
- **Stratified:** Randomize separately within strata (e.g., Prakriti type) — ensures balanced arms

**The Blinding Challenge in Ayurveda:**
1. Herbal formulations have distinct *Rasa* (taste), *Gandha* (smell), *Varna* (color) — subjects can identify them
2. Some therapies (Panchakarma, Nasya, Shirodhara) cannot be physically blinded
3. Individualized dosing contradicts fixed-dose placebo design

**Practical Solutions:**
- Double-dummy design (both groups take two preparations)
- Active comparator instead of placebo
- Single-blind / open-label with stated rationale
- Matching gelatin capsule shells to mask appearance

---

### 2.5 Pragmatic Clinical Trials

| Feature | Explanatory (Efficacy RCT) | Pragmatic (Real-World) |
|---------|---------------------------|----------------------|
| Setting | Controlled, ideal conditions | Real OPD/IPD setting |
| Population | Narrow inclusion criteria | Broad, inclusive |
| Intervention | Fixed protocol dose | Flexible (Vaidya-adjusted) |
| Comparator | Placebo | Usual care |
| Ayurveda fit | Low | **High** — preserves individualization |

---

## §3 — End-to-End Trial Workflow

### Complete 10-Step Lifecycle

**Step 1 — Research Question (PICO)**
Population: Adults 40–65 with knee OA | Intervention: Shallaki 500mg | Comparator: Placebo | Outcome: WOMAC at 8 weeks

**Step 2 — Protocol Creation**
Sections: Title → Background → Objectives → Study Design → Eligibility Criteria → Intervention & Control → Randomization Method → Outcome Measures → Visit Schedule (Time & Events table) → Statistical Analysis Plan → Safety & AE/SAE reporting rules → Ethics & Consent → Regulatory compliance → References → Appendices (CRF, ICF, Lab normals)

**Step 3 — Site Selection & Feasibility**
Infrastructure check | PI GCP certification | Patient footfall (OPD volume) | Pharmacy readiness | Laboratory availability | IEC registration status

**Step 4 — Ethics Submission & CTRI Registration**
IEC package → Scientific review → Ethics review → Approval letter → CTRI registration → Enrollment opens

**Step 5 — Patient Recruitment**
OPD screening list | IEC-approved advertisements | Referral from affiliated hospitals

**Step 6 — Screening (V0)**
Screening consent → Medical history → Prakriti assessment → Laboratory tests → Eligibility verification → Screening Log entry (even for failures)

**Step 7 — Enrollment & Randomization**
Subject ID assigned → Full informed consent (V0/V1) → Randomization code opened → Baseline CRF completed

**Step 8 — Follow-up Visits (V2–V4)**
Vitals → Efficacy assessment → AE query → Drug compliance check → eCRF entry → Query resolution → Vikriti re-assessment

**Step 9 — End of Study (V5)**
Final efficacy assessments → Safety labs → Drug reconciliation → Patient debriefing → Protocol deviation documentation

**Step 10 — Database Lock & Publication**
All queries closed → PI signs database lock certificate → SDTM datasets exported → Statistician analyzes → CSR written → Journal submission → Archival (≥5 years)

---

### Visit Schedule Template

| Visit | Name | Timepoint | Key Activities |
|-------|------|-----------|---------------|
| V0 | Screening | Day −14 to Day 0 | Screening consent, Prakriti, labs, eligibility check, Screening Log entry |
| V1 | Baseline/Randomization | Day 0 | Full consent, randomization, drug dispensing, baseline eCRF |
| V2 | Week 2 Follow-up | Day 14 ± 3 | Vitals, AE check, pain score, drug compliance |
| V3 | Week 4 Follow-up | Day 28 ± 3 | Vitals, efficacy outcomes, labs, AE, compliance |
| V4 | Week 8 Assessment | Day 56 ± 5 | Primary endpoint, labs, AE, Vikriti reassessment |
| V5 | End of Study | Day 84 ± 5 | Final efficacy, safety labs, patient satisfaction, drug reconciliation |
| FU | Follow-up (Optional) | Day 112 ± 7 | Post-treatment AE, sustainability of effect |

---

## §4 — Clinical Documents

### 4.1 CRF vs eCRF

| Feature | Paper CRF | eCRF (SURTAMIND) |
|---------|-----------|-----------------|
| Entry | Handwritten, manual | Digital, real-time |
| Validation | Manual, error-prone | Automated edit checks |
| Audit Trail | Handwritten corrections | System-generated, tamper-proof |
| Query Management | Physical forms | In-system lifecycle |
| ALCOA+ | Partial | Full compliance |
| CDISC Export | Manual conversion | Automated SDTM/ADaM |

### 4.2 Ayurveda Case History — What Makes It Different

```
PATIENT IDENTIFICATION
Subject ID: ___________  Date: ___________  Visit: ___________

AYURVEDIC ASSESSMENT
Prakriti:  [  ] Vata  [  ] Pitta  [  ] Kapha  [  ] V-P  [  ] V-K  [  ] P-K  [  ] Tridosha
Vikriti (current imbalance): _______________________

DASHAVIDHA PARIKSHA (Tenfold Examination)
1. Prakriti (Constitution):           _______________________
2. Vikriti (Pathology):               _______________________
3. Sara (Tissue quality):             _______________________
4. Samhanana (Compactness/build):     _______________________
5. Pramana:  Height ___cm  Weight ___kg
6. Satmya (Adaptability/tolerance):   _______________________
7. Sattva (Mental strength):          _______________________
8. Aharashakti (Digestive power):     _______________________
9. Vyayamashakti (Exercise capacity): _______________________
10. Vaya (Age stage):                 _______________________

CLINICAL HISTORY
Chief Complaint: _______________________  Duration: _______
Nidana (Etiology): _______________________
Purvarupa (Premonitory symptoms): _______________________
Rupa (Clinical features): _______________________

CHIKITSA (Treatment)
Type: [  ] Shodhana  [  ] Shamana
Formulation: _________________  Dose: ___  Anupana: _______  Frequency: ___
Pathya (Recommended): _______  Apathya (Contraindicated): _______

MODERN PARAMETERS
BP: ___/___  Pulse: ___  SpO2: ___%  Temp: ___°F  Weight: ___kg
Pain Score (VAS): ___/10
```

### 4.3 Screening Log Template

| Field | Description |
|-------|-------------|
| SL No. | Sequential screening number |
| Date | Date of screening assessment |
| Initials | Patient initials (not full name — anonymized) |
| Age | Approximate age |
| Sex | M/F/O |
| Eligible? | Yes / No |
| Reason for Exclusion | Specific criterion failed |
| Enrolled? | Yes / No |
| Screening Log Entry By | CRC initials |

**Why rejected patients must be documented:** Proves no selection bias was introduced. Regulators and monitors review the screening log to confirm that eligible patients were not arbitrarily excluded.

### 4.4 Real Ayurveda RCT Case Study

| Parameter | Details |
|-----------|---------|
| Study Title | Efficacy and Safety of Ashwagandha Root Extract in Improving Memory and Cognitive Functions |
| Disease | Mild Cognitive Impairment / General Cognitive Health |
| Source | PubMed Central — Journal of Dietary Supplements, 2017 |
| Study Design | Prospective, randomized, double-blind, placebo-controlled |
| Sample Size | 50 healthy adults (25 per arm) |
| Intervention | Ashwagandha root extract (KSM-66) 300 mg capsule twice daily |
| Control | Identical starch placebo capsule |
| Duration | 8 weeks |
| Primary Endpoints | Immediate Memory, General Memory (Wechsler Memory Scale-III) |
| Results | Significant improvement in memory (p<0.001), executive function (p<0.05) |
| Limitations | Small sample, short duration, healthy volunteers only, industry-funded |
| CTRI Reference | CTRI/2013/06/003737 |
| SURTAMIND Relevance | Demonstrates need for structured psychometric scale fields, Prakriti baseline data capture, and dynamic Ayurveda CRF design |

---

# PART 2: REGULATORY, ETHICS & COMPLIANCE FRAMEWORK
### Team B — Legal & GCP Research

---

## §5 — Indian Regulatory Framework

### 5.1 Drugs & Cosmetics Act, 1940 — ASU Drug Classification

| Category | Description | Regulatory Treatment |
|----------|-------------|---------------------|
| Classical Formulations | Per Schedule I authorized texts (Charaka Samhita, Sushruta, etc.) | Manufacturing license from SLA; no clinical trial required for traditional indications |
| Proprietary/Patent ASU | New combinations, dosage forms, or indications | Clinical trial data required for approval |
| New ASU Drug | Novel extract, new indication for classical formula | Full regulatory pathway including clinical evaluation |

**What counts as a "New Drug" in Ayurveda?**
- Novel botanical extract not in classical texts
- Classical formula used for a new indication
- New dosage form (e.g., converting churna into IV preparation)
- Fixed-dose combinations not in Schedule I

---

### 5.2 NDCT Rules, 2019 — Chapter-by-Chapter Reference

| Topic | Rule | Practical Meaning for SURTAMIND |
|-------|------|--------------------------------|
| IEC Registration | Ch. III, Rules 7–8 | IECs must be CLA-registered. Store IEC number + expiry in system |
| Academic/IIT Trials | Ch. V, Rule 28 | No CLA approval needed — only IEC. System must distinguish trial category |
| Ethics Approval Required | Ch. V, Rule 29 | Trial CANNOT start without written IEC approval. SURTAMIND GATES enrollment |
| CTRI Registration | Ch. V, Rule 30 | Mandatory prospective registration. SURTAMIND blocks enrollment if CTRI# missing |
| Informed Consent | Ch. V, Rule 44 | A/V recording mandatory for vulnerable subjects. System tracks consent version + media |
| SAE Reporting | Ch. V, Rule 42 | 24-hour reporting to CLA, Sponsor, IEC. SURTAMIND auto-alerts with countdown |
| Compensation for Injury | Ch. VI, Rules 39–40 | Formula-based compensation. Sponsor liable. SURTAMIND flags SAEs for compensation |
| Protocol Amendment | Ch. V, Rule 35 | Substantial changes need new IEC approval. Protocol version control mandatory |
| Archiving | Ch. V, Rule 52 | Essential documents archived ≥5 years post-completion |

---

### 5.3 Regulatory Hierarchy (India)

```
Central Government
├── CDSCO (Central Drugs Standard Control Organization)
│   ├── DCGI (Drugs Controller General of India) — Head
│   ├── Approves: Modern drugs, clinical trials for new chemical entities
│   └── Issues: WHO-CoPP (Certificate of Pharmaceutical Product)
│
└── Ministry of Ayush
    ├── Regulates: ASU drug policy, research institutions, licensing framework
    ├── ASUDTAB (ASU Drugs Technical Advisory Board) — statutory advisory
    └── Coordinates with SLAs for manufacturing licenses

State Governments
└── SLAs (State Licensing Authorities)
    ├── Grant manufacturing + marketing licenses for ASU drugs
    └── Inspect manufacturing facilities

Ethics Infrastructure (across all institutions)
└── IEC (Institutional Ethics Committee)
    ├── Must be registered under NDCT Rules (Chapter III)
    ├── Reviews ALL trials — academic and regulatory
    └── Sole guardian of human participant rights
```

---

## §6 — Good Clinical Practice (GCP) for Ayurveda

### 6.1 The 13 Core GCP Principles (Ministry of Ayush Version)

| # | Principle | Ayurveda Context |
|---|-----------|-----------------|
| 1 | Ethics override science | Holistic wellbeing of patient precedes data completeness |
| 2 | Benefits must outweigh risks | Traditional safety profile (classical texts) + modern tox data both valid |
| 3 | Protect subjects' rights and safety | Consent in local language; Vaidya must explain in patient's own terms |
| 4 | Adequate prior data must support trial | Classical text evidence + modern pharmacology data both accepted |
| 5 | Follow scientifically sound protocol | Pragmatic and N-of-1 designs recognized for Ayurveda |
| 6 | Adhere strictly to approved protocol | Prakriti-based dosage adjustments = protocol deviation unless pre-specified |
| 7 | Medical decisions by qualified physicians | Qualified Vaidya (BAMS/MD Ayu) meets requirement |
| 8 | All staff must be qualified | GCP training mandatory; Ayurveda-specific GCP modules recommended |
| 9 | Obtain freely given Informed Consent | No coercion; local language; literacy accommodations required |
| 10 | Accurate recording and storage of data | ALCOA+ applies to ALL Ayurveda-specific parameters |
| 11 | Protect confidentiality | Patient identity masked; subject IDs used in publications |
| 12 | Manufacture/store IP per GMP | Classical preparations follow Ayurvedic pharmacopoeia (API) |
| 13 | Implement quality assurance systems | SURTAMIND IS the quality assurance system |

---

### 6.2 Full RACI Matrix — All Stakeholders

| Task | Sponsor | PI | Sub-PI | CRC | Monitor | IEC |
|------|---------|-----|--------|-----|---------|-----|
| Protocol Design | R,A | C | I | I | I | C |
| Ethics Submission | I | R,A | C | R | I | — |
| Ethics Review & Approval | — | — | — | — | — | R,A |
| CTRI Registration | R | C | — | — | — | I |
| Informed Consent | I | A | R | R | I | I |
| Patient Screening | I | A | R | R | I | — |
| eCRF Data Entry | I | A | R | R | I | — |
| Source Data Verification | I | I | I | I | R,A | — |
| AE Recording | I | A | R | R | I | — |
| SAE Reporting to IEC | R | R,A | R | R | C | — |
| SAE Reporting to CLA | R,A | R | — | — | I | — |
| Protocol Amendment | R,A | C | — | — | — | R,A |
| Query Resolution | I | A | R | R | — | — |
| Database Lock | A | C | — | — | C | — |
| TMF Maintenance | R,A | I | I | I | R | — |

*(R=Responsible, A=Accountable, C=Consulted, I=Informed)*

---

### 6.3 Monitoring & Quality Assurance

**Source Data Verification (SDV):** Monitor visits the trial site and compares each eCRF entry against the original source document (patient notes, lab printout, X-ray). Discrepancies generate queries. This is the primary quality mechanism in clinical trials.

**Risk-Based Monitoring (RBM):** Focuses intensive SDV on:
- Primary efficacy endpoint fields
- All SAE records
- Informed consent documentation
- High-risk sites (new, previous issues)

**CAPA (Corrective & Preventive Action):** For each deviation:
1. Identify root cause
2. Implement correction (fix the current problem)
3. Implement prevention (stop it recurring)
4. Document and follow up

---

## §7 — Ethics & Human Subject Protection

### 7.1 IEC Composition (NDCT Rules, Chapter III)

```
IEC (7–15 members)
├── Chairperson [MUST be from OUTSIDE the institution — independence required]
├── Member Secretary [from the institution — manages administration]
├── Basic Medical Scientist (pharmacologist/physiologist/biochemist)
├── Clinician (relevant specialty to the trial area)
├── Legal Expert (for regulatory and rights evaluation)
├── Social Scientist or NGO Representative (community perspective)
├── Layperson (non-healthcare community member)
├── Ayurveda Subject-matter Expert × 2 [MANDATORY per ICMR RIM Addendum for Ayush trials]
└── [Optional] Statistician, ethicist, patient representative
```

**Quorum:** Minimum 5 members, including at least one from each category: Medical Scientist, Clinician, Legal/Social, and Layperson.

---

### 7.2 Ethics Approval Workflow

```
STEP 1: SUBMISSION (PI → IEC)
  Documents: Protocol + ICF (English + local language) + IB + Investigator CV
  + CTRI draft + Insurance certificate + Budget justification

STEP 2: SCIENTIFIC REVIEW
  Subject matter experts assess: Methodology, sample size rationale,
  statistical power, feasibility at site

STEP 3: ETHICS REVIEW (Full Board Meeting)
  Full IEC votes on: Risk-benefit ratio | Consent process adequacy
  Vulnerable population protections | Compensation plan adequacy

STEP 4: QUERIES / REVISION CYCLE
  IEC sends written queries → PI responds in writing → Re-review if substantial

STEP 5: APPROVAL LETTER ISSUED
  Contains: Protocol version approved, ICF version approved,
  Approval validity (typically 1 year), Continuing review date

STEP 6: TRIAL BEGINS
  CTRI registration number confirmed → Enrollment opens

STEP 7: CONTINUING REVIEW (Annual minimum)
  PI submits annual progress report → IEC reviews → Re-approves or suspends

STEP 8: CLOSURE
  PI submits final study report → IEC archives and formally closes study
```

---

### 7.3 Informed Consent — Mandatory Components (NDCT Rule 44)

All of the following MUST be present in every ICF:

- [ ] Study title and purpose in plain language
- [ ] Why this specific participant is being invited
- [ ] Experimental nature of the treatment
- [ ] All foreseeable risks, discomforts, and inconveniences
- [ ] Expected benefits (to participant and/or society)
- [ ] Alternative treatments available if participant declines
- [ ] Confidentiality of records and its limits
- [ ] Compensation for study-related injury or death (specific formula reference)
- [ ] Free medical management for any trial-related injury
- [ ] Voluntary participation — right to withdraw at any time without penalty
- [ ] Contact details: PI + IEC Chairperson + 24-hour emergency contact
- [ ] Statement that study has IEC approval with approval number and date

**Special Consent Requirements by Population:**

| Population | Additional Requirement |
|-----------|----------------------|
| Illiterate participants | Legally Acceptable Representative (LAR) signs + Impartial Witness countersigns |
| Children (< 12 years) | Parent/guardian consent + child assent if cognitively capable |
| Pregnant women | Separate ICF with explicit teratogenicity risk disclosure |
| Tribal/rural communities | Community leader consultation + ICF in local dialect |
| Vulnerable subjects (Rule 44) | A/V recording of consent process mandatory in specific trial types |

---

## §8 — Safety & Pharmacovigilance

### 8.1 AE vs SAE — Definitive Comparison

| Feature | Adverse Event (AE) | Serious Adverse Event (SAE) |
|---------|-------------------|----------------------------|
| Definition | Any untoward medical occurrence | AE meeting ≥1 seriousness criterion |
| Seriousness criteria | None — all AEs are recorded | Death, Life-threatening, Requires hospitalization, Prolongs hospitalization, Persistent disability, Congenital anomaly |
| Examples | Mild headache, nausea, rash | Anaphylaxis, liver failure, hospitalization |
| Reporting timeline | Recorded in CRF; reported at next data cut | **24-hour expedited reporting to CLA + IEC + Sponsor** |
| Causality assessment | Done at analysis | Mandatory; drives compensation eligibility |
| Compensation | Not applicable | Full NDCT Chapter VI compensation assessment |

---

### 8.2 SAE Reporting Timeline (NDCT Rule 42)

```
EVENT OCCURS
     ↓
PI BECOMES AWARE (Day 0)
     ↓ [Within 24 HOURS]
INITIAL REPORT sent to:
  → CLA (CDSCO/Ministry of Ayush)
  → Sponsor
  → IEC
     ↓ [Within 14 DAYS from awareness]
DETAILED FOLLOW-UP REPORT submitted by Sponsor to CLA
     ↓ [Within 30 DAYS]
IEC FORWARDS its opinion and causality assessment to CLA
     ↓
CLA MAKES DECISION:
  → Compensation quantum
  → Continue / Suspend / Terminate trial
```

---

### 8.3 PvPI & Ayurveda Pharmacovigilance

**National Structure:**
- **PvPI (modern drugs):** Indian Pharmacopoeia Commission (IPC), Ghaziabad
- **Ayush PV (ASU+H drugs):** Ministry of Ayush parallel programme
- **NPvCC-Ayush (National PV Coordination Centre):** Located at AIIA, New Delhi

**SURTAMIND PV Integration Roadmap:**
1. Automated SAE detection from eCRF AE fields
2. E2B XML safety report generation (CIOMS I compatible)
3. Direct electronic submission to VigiFlow/PvPI portal
4. Pharmacovigilance signal detection dashboard
5. WHO-UMC causality assessment wizard (Certain/Probable/Possible/Unlikely)

---

## §9 — CTRI & Regulatory Documentation

### 9.1 CTRI Registration — Key Requirements

| Field Category | Fields |
|----------------|--------|
| Trial Identity | Full title, CTRI number (format: CTRI/YYYY/MM/XXXXXX) |
| Study Design | Phase, type (interventional/observational), allocation, blinding |
| Disease & Intervention | ICD-10 disease code, intervention name + dose + frequency + duration |
| Eligibility | Age range, sex, inclusion/exclusion criteria verbatim |
| Sites | Site names, PI names, number of sites |
| Outcomes | Primary endpoint with measurement method; secondary endpoints |
| Timeline | Enrollment start date, expected completion date |
| Sponsor | Organization, funding source, contact details |

> **CRITICAL COMPLIANCE REQUIREMENT:** CTRI registration must occur BEFORE the first patient is enrolled. Retrospective registration is penalized and flagged. SURTAMIND must enforce this by blocking enrollment until CTRI number is entered and validated.

### 9.2 Trial Master File (TMF) — Essential Documents

| Phase | Documents |
|-------|-----------|
| **Before Trial** | Protocol + Amendments (all versions), Investigator's Brochure, ICF (all versions), Ethics Approval letter, CTRI certificate, Clinical Trial Insurance, Clinical Trial Agreement, Lab normal ranges, Investigator CV + GCP certificates |
| **During Trial** | Signed ICFs (all subjects), Screening Log, Enrollment Log, Randomization code list (sealed), eCRF data, SAE forms, Monitoring visit reports, CAPA records, Protocol deviation logs |
| **After Trial** | Database lock certificate, Statistical Analysis Plan (final), Final statistical report, Clinical Study Report (CSR), Publication manuscript, Archival confirmation |

**TMF vs CRF:** TMF = administrative and regulatory backbone (who approved what, when, and how the trial was managed). CRF = clinical data from each individual patient.

---

# PART 3: TECHNOLOGY, DATA STANDARDS & DIGITAL CTMS
### Team C — Technical Architecture Research

---

## §10 — Health Informatics & Clinical Data Lifecycle

### 10.1 Clinical Data Lifecycle — Stage by Stage

```
STAGE 1: SOURCE GENERATION
  Patient visits AIIA OPD → Doctor examines → Source document created
  [Principle: Source document is "the truth" — all other data traces here]

STAGE 2: DATA CAPTURE
  CRC reads source doc → Enters into eCRF in SURTAMIND
  [Automated edit checks: pain score 0–10? age ≥18? visit date sequence valid?]

STAGE 3: QUALITY CONTROL (Query Management)
  Edit check fails → Automated query raised → Assigned to CRC or PI
  CRC reviews source → Corrects data or provides justification → Query closed

STAGE 4: MONITORING (SDV)
  Monitor visits site → Compares every eCRF entry against source document
  Discrepancy found → Monitor raises new query → Resolved as above

STAGE 5: DATABASE LOCK
  All queries closed → All deviations documented → PI certifies accuracy
  → Database locked (no further changes possible)

STAGE 6: STATISTICAL ANALYSIS
  SDTM datasets exported from SURTAMIND → ADaM derived variables created
  → Statistician runs per Statistical Analysis Plan
  [Traceability: ADaM ← SDTM ← CRF ← Source Document]

STAGE 7: DISSEMINATION
  CSR written → Journal submitted → Peer reviewed → Published
  → Data archived for minimum 5 years
```

### 10.2 Why Excel Fails Clinical Research

| Requirement | Excel | SURTAMIND |
|-------------|-------|-----------|
| Audit trail (21 CFR Part 11) | ❌ None | ✅ Full immutable log |
| RBAC | ❌ None | ✅ 6-role API-enforced |
| Real-time validation | ❌ Manual formulas | ✅ Automated edit checks |
| Query management | ❌ None | ✅ Full lifecycle |
| CDISC export | ❌ Manual | ✅ Automated SDTM/ADaM |
| Regulatory acceptance | ❌ Rejected | ✅ GCP-compliant |
| Multi-site access | ❌ File sharing | ✅ Web-based, real-time |

---

## §11 — CDISC Standards

### 11.1 CDISC Ecosystem Overview

```
CDISC
├── CDASH (Collection Layer)
│   → Standardizes CRF variables at the site
│   → Example: VSTEST = "Systolic Blood Pressure", VSORRES = "128 mmHg"
│
├── SDTM (Tabulation Layer — for regulatory submission)
│   → Organizes data into standard domains (DM, AE, VS, LB, CM, EG...)
│   → Example: VS.VSTESTCD = "SYSBP", VS.VSORRES = "128", VS.VSORRESU = "mmHg"
│
├── ADaM (Analysis Layer)
│   → Derives statistical analysis datasets from SDTM
│   → Example: ADVS.AVAL = 128, ADVS.BASE = 135, ADVS.CHG = -7
│
└── Define-XML (Metadata Layer)
    → Machine-readable description of all datasets for FDA/EMA
```

**Why FDA mandates CDISC:** Required for all NDA, BLA, and ANDA submissions since January 2017. Any Ayurveda study aspiring global regulatory recognition must produce SDTM and ADaM datasets.

---

### 11.2 Ayurveda-Specific CDASH Extensions

**Standard variables remain unchanged. Proposed custom Ayurveda domain (AY):**

| Variable | Description | Example Value |
|----------|-------------|---------------|
| AYPRAKRITI | Prakriti (constitution) | VATA-PITTA |
| AYVIKRITI | Current pathological state | VATA-PREDOMINANT |
| AYAGNI | Digestive fire status | SAMA / VISHAMA / TEEKSHNA / MANDA |
| AYBALA | Strength assessment | PRAVARA / MADHYAMA / AVARA |
| AYSATTVA | Mental strength | PRAVARA / MADHYAMA / AVARA |
| AYFORMULA | Formulation name | Ashwagandha KSM-66 |
| AYDOSEFORM | Dosage form | CHURNA / VATI / KWATHA / TAILA |
| AYANUPANA | Adjuvant / vehicle | Warm milk / Honey / Ghee |
| AYPATHYA | Recommended diet/lifestyle | Light, warm food; early sleep |
| AYAPATHYA | Contraindicated items | Cold food, heavy diet, day sleep |

---

### 11.3 SDTM Domain Map for Ayurveda Trials

| Domain | Standard Content | Ayurveda Addition |
|--------|-----------------|-------------------|
| DM | Age, sex, race, country | + AYPRAKRITI baseline |
| VS | BP, pulse, temp, weight | + Nadi pariksha rate if captured |
| AE | Adverse event terms (MedDRA coded) | + Ayurveda ADR terms |
| CM | Concomitant medications | + Concurrent Ayurveda preparations |
| LB | Lab values: CBC, LFT, RFT | Standard; include relevant Ayurveda biomarkers |
| QS | Questionnaires and scales | WOMAC, SF-36, VAS, Ayurveda-specific scales |
| SUPPQUAL | Supplemental qualifiers | Custom Ayurveda parameters (Agni, Ojas status) |
| **AY** | Custom Ayurveda domain | Dashavidha Pariksha findings, Nadi, Jihwa, Mala, Mutra |

---

### 11.4 SDTM → ADaM Transformation

| SDTM (VS domain) | ADaM (ADVS dataset) |
|-----------------|---------------------|
| VSTESTCD = "SYSBP" | PARAM = "Systolic Blood Pressure (mmHg)" |
| VSORRES = "128" | AVAL = 128 |
| [Baseline record] | BASE = 135 |
| [Derived] | CHG = -7 (change from baseline) |
| [Derived] | PCHG = -5.19 (percent change) |
| [Analysis flag] | ANL01FL = "Y" (included in primary analysis) |

---

## §12 — FHIR R4 & Interoperability

### 12.1 Core FHIR Resources for SURTAMIND

| Resource | Represents | Key Attributes |
|----------|-----------|----------------|
| Patient | Trial participant | name, gender, birthDate, + Prakriti extension |
| Practitioner | PI or Sub-PI | name, qualification, identifier |
| Observation | BP, pain score, Prakriti assessment | code (LOINC/custom), value, subject, encounter |
| Encounter | OPD or follow-up visit | Patient ref, Practitioner ref, period start/end |
| Medication | Ayurveda drug dispensed | ingredient, form (Vati/Churna), NAMASTE code |
| Condition | Disease / Vyadhi | ICD-11 TM code (via NAMASTE mapping) |
| ResearchStudy | The clinical trial | title, status, identifier (CTRI#), protocol |
| ResearchSubject | Enrolled participant | links Patient to ResearchStudy; status, arm |

**Patient Resource with Ayurveda Prakriti Extension:**
```json
{
  "resourceType": "Patient",
  "id": "OA001",
  "name": [{"family": "Sharma", "given": ["Ramesh"]}],
  "gender": "male",
  "birthDate": "1975-03-15",
  "extension": [
    {
      "url": "http://surtamind.aiia.gov.in/fhir/ext/prakriti",
      "valueString": "VATA-PITTA"
    }
  ]
}
```

**ResearchSubject (links Patient to Trial):**
```json
{
  "resourceType": "ResearchSubject",
  "id": "RS-OA001",
  "status": "on-study",
  "study": {"reference": "ResearchStudy/CTRI-2025-OA-001"},
  "individual": {"reference": "Patient/OA001"},
  "assignedArm": "Intervention"
}
```

---

### 12.2 Terminology Standards for Ayurveda

| Standard | Purpose | Ayurveda Mapping Status |
|----------|---------|------------------------|
| SNOMED CT | Clinical concepts, diagnoses, procedures | Limited mapping; NAMASTE project bridging |
| LOINC | Lab tests, clinical observations | Good for modern labs; Ayurveda-specific tests largely unmapped |
| ICD-11 Chapter 26 | Traditional Medicine disease codes | Sandhivata = SA76; major Vyadhis being mapped |
| MedDRA | Adverse event coding (regulatory) | Used for SAE/AE coding in all regulatory submissions |
| **NAMASTE** | National Ayush standardized terminologies | Ministry of Ayush portal mapping Vyadhi names → ICD-11 TM codes |

---

## §13 — Data Integrity & Audit Compliance

### 13.1 ALCOA+ — All Nine Principles

| Principle | What It Means | SURTAMIND Implementation |
|-----------|--------------|--------------------------|
| **A** Attributable | Every entry linked to a specific person | User login + digital signature on each CRF field |
| **L** Legible | Data readable and permanent | Digital entry; no handwriting; standardized fonts |
| **C** Contemporaneous | Recorded at time of occurrence | System UTC timestamp locked at entry; late entry flagged |
| **O** Original | First capture of data | Source document traceability; no phantom re-transcription |
| **A** Accurate | Correct and truthful | Edit checks, range validations, mandatory fields |
| **+C** Complete | No missing required data | Mandatory field enforcement; missing data query |
| **+C** Consistent | Internally and externally coherent | Cross-field validations (Visit 2 date > Visit 1 date) |
| **+E** Enduring | Stored durably | PostgreSQL + backups; 5-year archival post-trial |
| **+A** Available | Accessible to authorized parties | RBAC-enforced access; export for regulatory submission |

---

### 13.2 Audit Trail — System Design

Every field change in SURTAMIND generates an immutable audit log entry:

| Column | Description |
|--------|-------------|
| event_id | Unique UUID |
| timestamp | UTC datetime of change |
| user_id | Who changed it |
| user_role | Their role (CRC/PI/Monitor) |
| table_name | Which database table |
| record_id | Primary key of changed record |
| field_name | Specific field modified |
| old_value | Value before change |
| new_value | New value |
| reason | MANDATORY justification when modifying existing data |

**Example:**

| Timestamp | User | Role | Field | Old → New | Reason |
|-----------|------|------|-------|-----------|--------|
| 2025-03-15T10:42 | crc001 | CRC | pain_score | 8 → 6 | Patient re-evaluated; initial score was transcription error per source document entry |

---

### 13.3 RBAC — Complete Permission Matrix

| Permission | Admin | PI | CRC | Monitor | Statistician | IEC | PV Officer |
|------------|-------|-----|-----|---------|-------------|-----|-----------|
| View patient demographics | ✅ | ✅ | ✅ | ✅ | ❌ (anonymized) | ❌ | ✅ |
| Enter / edit CRF data | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View CRF data | ✅ | ✅ | ✅ | ✅ | ✅ (anon) | ❌ | ✅ |
| Raise data queries | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Respond to queries | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Close / resolve queries | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Lock database | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View audit trail | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Manage users | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View ethics submissions | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Log SAE / AE | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| View safety dashboard | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ |
| Export SDTM / ADaM | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Master dictionary management | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## §14 — CTMS Market Analysis

### 14.1 Platform Comparison

| Platform | Type | FHIR | CDISC | Audit Trail | India Compliance | Cost | Ayurveda |
|----------|------|------|-------|-------------|-----------------|------|---------|
| Veeva Vault | Enterprise SaaS | ✅ | ✅ Full | ✅ | ⚠️ Partial | Very High ($50K+/yr) | ❌ |
| Medidata Rave | Enterprise EDC | ✅ | ✅ Full | ✅ | ⚠️ Partial | High ($20–50K/yr) | ❌ |
| OpenClinica | Open-source CTMS | ⚠️ Partial | ✅ SDTM | ✅ | ❌ None | Free CE / Paid | ❌ |
| REDCap | Survey/EDC | ⚠️ Module | ❌ Native | ❌ | ❌ None | Free (non-profit) | ❌ |
| Castor EDC | Modern SaaS EDC | ✅ | ⚠️ Partial | ✅ | ❌ None | Medium ($5–20K/yr) | ❌ |
| **SURTAMIND** | **Purpose-built** | **✅** | **✅ Planned** | **✅** | **✅ Full NDCT** | **Accessible/Open** | **✅ Native** |

---

### 14.2 Feature Gap Matrix — SURTAMIND's Winning Position

| Feature | Veeva | Medidata | OpenClinica | REDCap | Castor | SURTAMIND |
|---------|-------|---------|------------|--------|--------|-----------|
| Ayurveda Case History | ❌ | ❌ | ❌ | ❌ | ❌ | **✅** |
| Prakriti Assessment | ❌ | ❌ | ❌ | ❌ | ❌ | **✅** |
| Dashawidha Pariksha | ❌ | ❌ | ❌ | ❌ | ❌ | **✅** |
| Ayurveda Drug Capture (Vati/Kwatha/Churna/Anupana) | ❌ | ❌ | ❌ | ❌ | ❌ | **✅** |
| CTRI Workflow | ⚠️ | ⚠️ | ❌ | ❌ | ❌ | **✅** |
| NDCT 2019 Compliance | ❌ | ❌ | ❌ | ❌ | ❌ | **✅** |
| IEC Ethics Module | ❌ | ❌ | ❌ | ❌ | ❌ | **✅** |
| PvPI Pharmacovigilance | ⚠️ | ⚠️ | ❌ | ❌ | ❌ | **✅** |
| Bilingual EN/HI | ❌ | ❌ | ❌ | ❌ | ❌ | **✅** |
| CDISC SDTM Export | ✅ | ✅ | ✅ | ❌ | ⚠️ | ✅ (Planned) |
| FHIR R4 Integration | ✅ | ✅ | ⚠️ | ⚠️ | ✅ | ✅ (Planned) |
| Immutable Audit Trail | ✅ | ✅ | ✅ | ❌ | ✅ | **✅** |
| Query Management | ✅ | ✅ | ✅ | ❌ | ✅ | **✅** |
| Affordable / Open | ❌ | ❌ | ✅ | ✅ | ❌ | **✅** |

---

### 14.3 SURTAMIND Technical Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                       │
│  React 19 + TypeScript + Vite                               │
│  Tailwind CSS — Ayurvedic Teal & Ivory botanical design     │
│  Bilingual toggle: English ↔ Hindi (Devanagari)             │
│  6 role-specific dashboards                                 │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API (JSON over HTTPS)
┌────────────────────────▼────────────────────────────────────┐
│                        BACKEND LAYER                        │
│  FastAPI (Python 3.11+) — async, high performance           │
│  JWT Authentication + RBAC dependency guards                │
│  FHIR R4 resource endpoints                                 │
│  CDISC SDTM/ADaM export service                             │
│  SAE Notification Engine (24-hour countdown alerts)         │
│  Audit trail trigger (append-only on every write)           │
└────────────────────────┬────────────────────────────────────┘
                         │ SQLAlchemy ORM
┌────────────────────────▼────────────────────────────────────┐
│                       DATABASE LAYER                        │
│  PostgreSQL (production) / SQLite (dev — zero config)        │
│  JSONB columns for flexible Ayurveda CRF fields             │
│  Immutable audit_log table (append-only, no DELETE trigger) │
└─────────────────────────────────────────────────────────────┘

External Integrations (FHIR R4 REST):
├── AIIA HIS ─────────────→ Patient demographics (Patient resource)
├── Pathology LIS ─────────→ Lab results (Observation resource)
├── Pharmacy System ───────→ Drug dispensing (MedicationDispense)
├── Ministry of Ayush PV ──→ SAE reports (E2B XML → VigiFlow)
└── CTRI ──────────────────→ Trial registration data exchange
```

---

# PART 4: SURTAMIND SYSTEM MAPPING — JOINT SECTION

## §15 — Research → Feature Mapping

### 15.1 Complete Research-to-Feature Traceability

| Research Finding | Source Team | SURTAMIND Feature | Priority |
|----------------|------------|-------------------|----------|
| Ayurveda trials need Prakriti/Vikriti/Dashawidha Pariksha | Team A | Ayurveda Baseline CRF with all 10 Dashawidha fields | P0 |
| Screening log needed even for rejected patients | Team A | Screening Log module with reason-for-exclusion capture | P0 |
| Pragmatic trials need flexible visit schedules | Team A | Configurable visit timeline per protocol | P0 |
| IEC approval must gate trial enrollment | Team B (NDCT Rule 29) | Ethics module with approval status gate on enrollment flow | P0 |
| CTRI number must precede first enrollment | Team B (NDCT Rule 30) | CTRI number validation field blocking enrollment if absent | P0 |
| SAE reporting within 24 hours mandatory | Team B (NDCT Rule 42) | Automated SAE alert system with countdown timer | P0 |
| Informed consent tracked per subject | Team B (NDCT Rule 44) | Per-subject consent status, version, date, A/V recording flag | P0 |
| ALCOA+ requires immutable audit trail | Team C | Append-only audit_log table capturing every field change | P0 |
| RBAC for multi-role trial team | Team C | 6-role RBAC enforced at FastAPI dependency level | P0 |
| Query management is core CTMS feature | Team C | Query lifecycle: raised → responded → resolved → closed | P0 |
| CCRAS multi-centric trials need central data | Team A | Multi-site architecture with site-specific role assignment | P1 |
| Protocol amendments need IEC re-approval | Team B | Protocol version control with amendment workflow + re-consent trigger | P1 |
| TMF must be inspection-ready at all times | Team B | Document management module with TMF categorization | P1 |
| CDISC required for international regulatory acceptance | Team C | SDTM domain export (DM, AE, VS, LB, CM, QS, AY custom) | P2 |
| FHIR needed for hospital interoperability | Team C | FHIR R4 REST API layer (Patient, Observation, Encounter, ResearchSubject) | P2 |
| PvPI integration for pharmacovigilance | Team B + C | E2B XML SAE generation + VigiFlow submission module | P2 |
| Ayurveda drug dispensing data needed | Team A | Formulation capture: name, dose form, anupana, pathya/apathya | P0 |
| No existing CTMS supports Ayurveda | Team C (market analysis) | SURTAMIND's entire existence is the competitive advantage | P0 |

---

### 15.2 SURTAMIND's Unique Value Proposition for SIH Judges

> **The Problem India's Ayurveda Research Community Faces:**  
> India conducts hundreds of Ayurveda clinical trials annually through AIIA, CCRAS, NIA, and private Ayurvedic colleges. Not a single institution has access to a purpose-built CTMS. They manage critical safety data using Excel sheets, WhatsApp groups, and paper CRFs — leading to data loss, missed SAE timelines, protocol deviations, and ultimately, research that fails international peer review and regulatory submission.
>
> **SURTAMIND is the Solution:**  
> The first purpose-built, Ayurveda-native, GCP-compliant, FHIR-interoperable CTMS that:
> 1. Preserves Ayurvedic clinical intelligence (Prakriti, Vikriti, Dashawidha Pariksha) as first-class structured data — not afterthought fields
> 2. Enforces NDCT 2019 compliance automatically through system gates (IEC gate, CTRI gate, SAE 24-hour countdown alerts)
> 3. Produces CDISC-ready datasets (SDTM domains) for international regulatory submission and journal publication
> 4. Is open and affordable for academic institutions — unlike Veeva ($50K+/yr) or Medidata ($20K+/yr)
> 5. Supports bilingual operation (English + Hindi/Devanagari) for India's diverse research workforce
> 6. Connects to India's healthcare ecosystem via FHIR R4 APIs — bridging AIIA's HIS, pathology labs, and pharmacovigilance portals

---

# APPENDIX — GLOSSARIES & REFERENCE TABLES

## §16 — Master Glossary (70+ Terms)

### Clinical Research Terms (Team A)

| Term | Definition |
|------|-----------|
| Clinical Trial | Prospective human study evaluating medical interventions under controlled conditions |
| Protocol | Master document defining all trial objectives, design, methods, and procedures |
| PI (Principal Investigator) | Lead researcher with full responsibility for trial conduct at a site |
| CRC (Clinical Research Coordinator) | Professional supporting PI in trial management, data entry, and logistics |
| Subject | Human participant enrolled in a clinical trial |
| Screening | Process of evaluating potential participants against eligibility criteria |
| Enrollment | Official entry of a screened and eligible subject into the trial |
| Randomization | Chance-based allocation of subjects to intervention or control arms |
| Intervention | Treatment being tested (drug, procedure, lifestyle change) |
| Control | Comparison arm — placebo or standard of care |
| Endpoint | Outcome measure used to evaluate trial efficacy or safety |
| Inclusion Criteria | Characteristics a subject MUST have to participate |
| Exclusion Criteria | Characteristics that disqualify a subject from participation |
| Informed Consent | Voluntary, documented agreement by participant after full disclosure |
| CRF (Case Report Form) | Structured paper form for recording protocol-required clinical data |
| eCRF | Electronic Case Report Form used within a digital CTMS |
| Source Data | Original medical records from which CRF data is transcribed |
| Baseline | Initial measurements taken before intervention begins |
| Follow-up | Scheduled reassessment after intervention commencement |
| Visit Window | Acceptable date range for a scheduled protocol visit (e.g., Day 28 ± 3) |
| SAE (Serious Adverse Event) | AE resulting in death, hospitalization, disability, or life-threatening condition |
| AE (Adverse Event) | Any untoward medical occurrence in a trial participant |
| Efficacy | Ability of treatment to produce desired effect under ideal conditions |
| Safety | Risk profile and harm potential of an intervention |
| Placebo | Inactive substance designed to resemble the active treatment |
| Blinding | Concealment of treatment assignment from participant and/or investigator |
| RCT | Randomized Controlled Trial — gold standard of clinical evidence |
| Cohort | Group of subjects with shared characteristics followed over time |
| Outcome Measure | Variable used to quantify trial endpoints |
| Database Lock | Irreversible freezing of data before statistical analysis |
| Audit Trail | Immutable chronological record of all data changes with user and timestamp |
| GCP | Good Clinical Practice — international ethical research standard |
| Ethics Committee | Independent body ensuring protection of human research subjects |
| Sponsor | Organization or individual initiating and funding the trial |
| Site | Physical location where trial activities are conducted |
| Monitoring | Ongoing oversight of trial conduct and data quality by CRA |
| Deviation | Any unplanned departure from the approved protocol |
| Pragmatic Trial | Real-world effectiveness study with flexible, broad design |
| Clinical Study Report | Final comprehensive scientific report of trial methodology and results |
| Publication | Peer-reviewed dissemination of trial findings |
| Evidence-Based Ayurveda | Integration of Ayurvedic wisdom with rigorous scientific evidence generation |

### Ayurveda-Specific Terms (Team A)

| Term | Definition |
|------|-----------|
| Prakriti | Inherent psychosomatic constitution of an individual based on Dosha balance (Vata/Pitta/Kapha) |
| Vikriti | Current pathological state; doshic imbalance from one's baseline Prakriti |
| Dashawidha Pariksha | Tenfold Ayurvedic clinical examination of patient (constitution, tissues, build, adaptability, mental strength, etc.) |
| Chikitsa | Therapeutic plan and treatment protocol |
| Nidana | Etiology — causative factors producing the disease |
| Shodhana | Purification/bio-detoxification therapies (Panchakarma) |
| Shamana | Palliation therapies — oral formulations to pacify doshas |
| Anupana | Vehicle or adjuvant co-administered with the primary drug (e.g., honey, ghee, warm milk) |
| Pathya | Recommended dietary and lifestyle modifications during treatment |
| Apathya | Contraindicated foods and lifestyle factors during treatment |
| OPD | Outpatient Department |
| IPD | Inpatient Department |

### Regulatory & Compliance Terms (Team B)

| Term | Definition |
|------|-----------|
| NDCT Rules | New Drugs and Clinical Trials Rules, 2019 — primary legislation governing Indian clinical trials |
| CDSCO | Central Drugs Standard Control Organization |
| DCGI | Drugs Controller General of India — head of CDSCO |
| IEC | Institutional Ethics Committee — independent body reviewing all trials |
| ICF | Informed Consent Form |
| ADR | Adverse Drug Reaction — AE with a suspected causal relationship to the drug |
| CAPA | Corrective and Preventive Action — quality response to protocol deviations |
| TMF | Trial Master File — complete dossier of all essential trial documents |
| CTRI | Clinical Trials Registry – India (ICMR-hosted public registry) |
| SDV | Source Data Verification — comparing eCRF entries to original source documents |
| Protocol Amendment | Approved formal change to any aspect of the trial protocol |
| Vulnerable Subject | Participant requiring additional ethical protections (children, pregnant women, illiterate, tribal) |
| PvPI | Pharmacovigilance Programme of India |
| Monitor / CRA | Clinical Research Associate — quality oversight professional assigned by Sponsor |

### Technology Terms (Team C)

| Term | Definition |
|------|-----------|
| CDISC | Clinical Data Interchange Standards Consortium |
| CDASH | Clinical Data Acquisition Standards Harmonization — CRF variable naming standards |
| SDTM | Study Data Tabulation Model — regulatory submission data format |
| ADaM | Analysis Data Model — statistical analysis-ready datasets |
| FHIR | Fast Healthcare Interoperability Resources — HL7 REST API healthcare data standard |
| RBAC | Role-Based Access Control — permissions assigned by role, not individual |
| ALCOA+ | Data integrity framework: Attributable, Legible, Contemporaneous, Original, Accurate + Complete, Consistent, Enduring, Available |
| CTMS | Clinical Trial Management System |
| EDC | Electronic Data Capture |
| HIS | Hospital Information System |
| LIS | Laboratory Information System |
| LOINC | Logical Observation Identifiers Names and Codes — lab and clinical test standard |
| SNOMED CT | Systematized Nomenclature of Medicine — clinical terminology standard |
| ICD-11 | International Classification of Diseases 11th edition (includes Traditional Medicine Chapter 26) |
| NAMASTE | National Ayush Morbidity and Standardized Terminologies Electronic Portal |
| Define-XML | Machine-readable CDISC metadata file for regulatory submission packages |

---

## Primary Sources & References

| Source | Type | Reference |
|--------|------|-----------|
| Ministry of Ayush | Government | https://ayush.gov.in |
| All India Institute of Ayurveda (AIIA) | Government | https://aiia.gov.in |
| Central Council for Research in Ayurvedic Sciences (CCRAS) | Government | https://ccras.nic.in |
| Indian Council of Medical Research (ICMR) | Government | https://icmr.gov.in |
| Clinical Trials Registry – India (CTRI) | Government | https://ctri.nic.in |
| CDSCO — NDCT Rules 2019 | Legislation | https://cdsco.gov.in |
| Drugs & Cosmetics Act, 1940 (Chapter IV-A) | Legislation | Sections covering ASU drugs |
| ICMR National Ethical Guidelines (2017) | Guidelines | https://icmr.gov.in/ethical_guidelines |
| GCP Guidelines for ASU Drugs | Guidelines | Ministry of Ayush official publication |
| Pharmacovigilance Programme of India (PvPI) | Government | https://pvpi.gov.in |
| CDISC Standards (CDASH, SDTM, ADaM) | International | https://www.cdisc.org |
| HL7 FHIR R4 Specification | International | https://www.hl7.org/fhir/R4/ |
| PubMed — Ashwagandha RCT (2017) | Peer-reviewed | Journal of Dietary Supplements, PMC |
| Veeva Vault CTMS | Commercial | https://www.veeva.com |
| Medidata Rave | Commercial | https://www.medidata.com |
| OpenClinica | Open Source | https://openclinica.com |
| REDCap | Academic | https://projectredcap.org |
| Castor EDC | Commercial | https://www.castoredc.com |

---

*End of SURTAMIND Research Compendium — Version 1.0*
*Compiled: September 2026 | Smart India Hackathon (SIH) Submission*
