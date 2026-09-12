# SURTAMIND Team C Research Report — Technology, Data Standards & Digital CTMS

## MODULE 1: Health Informatics & Clinical Data Lifecycle (4 pages)

### 1.1 What is Health Informatics?
Health informatics is the multidisciplinary field that uses health information technology (HIT) to improve healthcare via any combination of higher quality, higher efficiency, and new opportunities. It lies at the intersection of information science, computer science, and healthcare. Unlike hospital management, which focuses primarily on the administration and operational aspects of running a healthcare facility (billing, HR, facility management), clinical informatics specifically deals with patient care and the integration of data to support clinical decision-making.

**Digital Health Ecosystem**
The modern digital health ecosystem encompasses Electronic Health Records (EHR), Personal Health Records (PHR), telemedicine, wearable devices, and Clinical Trial Management Systems (CTMS).

**Role in Clinical Research**
In clinical research, informatics ensures that data collected from trials is standardized, high-quality, and interoperable. It allows researchers to manage large datasets efficiently and extract meaningful insights.

**Why informatics is essential in Ayurveda**
Ayurveda research relies on highly subjective and multi-dimensional variables (Prakriti, doshas, subjective well-being). Informatics provides the structural framework to quantify, standardize, and analyze these variables, translating traditional knowledge into evidence-based science globally accepted by regulators.

**Why Excel is insufficient**
Excel lacks fundamental features required for clinical research data management:
- No audit trails (21 CFR Part 11 non-compliance).
- No inherent Role-Based Access Control (RBAC).
- Prone to manual entry errors without strict real-time validation.
- Difficult to handle complex longitudinal relational data.

### 1.2 Clinical Data Lifecycle
1. **Patient visits OPD**: Initial patient interaction.
2. **Doctor examines**: Clinical assessment and anamnesis.
3. **Source document created**: Doctor writes notes in patient file or EHR.
4. **CRF completed**: Relevant data is extracted into a Case Report Form (CRF).
5. **eCRF entry**: Data is transcribed into an electronic EDC/CTMS system.
6. **Data validation**: System runs edit checks for out-of-range or logically inconsistent data.
7. **Query resolution**: Discrepancies are queried back to the investigator and resolved.
8. **Database lock**: After all queries are resolved, data is locked to prevent further changes.
9. **Statistical analysis**: Data is extracted, transformed into CDISC formats, and analyzed.
10. **Publication**: Findings are reported in journals.

### 1.3 Source Data vs Research Data
- **Doctor's notes vs CRF values**: The doctor might write "patient felt slight nausea after taking meds," which is the source data. The CRF value will capture "Adverse Event: Nausea, Severity: Mild."
- **Lab reports vs SDTM dataset**: A PDF lab report from Pathology is source data. The SDTM LB (Laboratory) domain dataset extracts the exact analyte, result, unit, and reference range into standardized rows.
- **X-ray vs Structured variables**: The X-ray image is the source. The structured variable is "Bone fracture: Yes/No."
- **Prescription vs Analysis dataset**: A handwritten prescription for a painkiller is source. The ADaM dataset maps this to "Concomitant Medication: Ibuprofen, Dose: 400mg."

## MODULE 2: CDISC Standards (6 pages)

### 2.1 What is CDISC?
The Clinical Data Interchange Standards Consortium (CDISC) is a global non-profit organization that develops standard formats for the collection, exchange, and submission of clinical research data.
- **FDA Recognition**: The US FDA legally requires study data to be submitted in CDISC formats for NDA, BLA, and ANDA submissions.
- **Journal Preference**: Standardized datasets ensure reproducibility, peer-review transparency, and data pooling.

### 2.2 CDASH (Clinical Data Acquisition Standards Harmonization)
CDASH establishes standardized data collection variables at the site level.
- **Standard CRF variables**: Defines naming conventions for fields like BRTHDTC (Birth Date).
- **Data collection methodology**: Ensures all sites capture data the same way.
- **Required fields**: Specifies what must be collected (e.g., subject ID, visit date).

### 2.3 SDTM (Study Data Tabulation Model)
SDTM is the standard for organizing and formatting data to streamline data analysis and reporting.
- **DM (Demographics)**: Age, Sex, Race. (Ayurveda: could include baseline Prakriti).
- **AE (Adverse Events)**: Any untoward medical occurrence.
- **CM (Concomitant Medications)**: Medications taken alongside the study drug.
- **VS (Vital Signs)**: BP, Pulse, Temp.
- **LB (Laboratory)**: Standard lab tests.
- **EG (ECG)**: Electrocardiogram results.
- **Ayurveda specific**: Needs custom domains or extensions (e.g., subjective assessment of Agni, Koshta) mapped to SUPPQUAL or custom domains.

### 2.4 ADaM (Analysis Data Model)
ADaM defines dataset structures and variables that support statistical analysis.
- **Traceability**: Every data point in ADaM must be traceable back to SDTM.
- **Derived variables**: e.g., Change from baseline (CHG).
- **Structure**: One record per subject, or one record per subject per timepoint.

### 2.5 Why CDISC Matters for SURTAMIND
Without CDISC, Ayurveda clinical data remains isolated and difficult to compare against international allopathic trials. Implementing CDISC in SURTAMIND ensures that Ayurveda research can be submitted to global regulators (FDA, EMA) and accepted in high-impact medical journals, bridging the gap between traditional medicine and modern evidence-based research.

## MODULE 3: FHIR R4 & Interoperability (5 pages)

### 3.1 What is FHIR?
Fast Healthcare Interoperability Resources (FHIR) is a standard created by HL7. It leverages modern web APIs (RESTful architectures) and represents health data as JSON or XML resources. It is preferred over custom APIs because it offers a universal language for healthcare systems to communicate, reducing integration costs and ensuring longevity.

### 3.2 Core FHIR Resources
- **Patient**: Represents the trial participant. JSON includes `name`, `gender`, `birthDate`.
- **Practitioner**: The PI/Doctor. Includes `qualification`, `name`.
- **Observation**: Findings. E.g., BP or Prakriti assessment. Includes `code` (what is measured), `value` (the result).
- **Encounter**: OPD visit. Links Patient and Practitioner, includes `period`.
- **Medication**: Ayurveda drug.
- **Condition**: Disease/Vyadhi.
- **ResearchStudy**: The clinical trial itself.
- **ResearchSubject**: The enrolled participant, linking `Patient` to `ResearchStudy`.

### 3.3 Interoperability Workflow
- **HIS Integration**: SURTAMIND pulls demographics via FHIR `Patient` endpoint from Hospital Information Systems.
- **Lab Integration**: Pulls lab results via FHIR `Observation` and maps to SDTM LB.

### 3.4 SNOMED, LOINC & ICD
- **SNOMED CT**: Clinical terminology for diagnosis, procedures.
- **LOINC**: Laboratory and clinical observations.
- **ICD-10**: Disease classification for billing/epidemiology.
- **Ayurveda Mapping**: Project NAMASTE (National Ayush Morbidity and Standardized Terminologies Electronic Portal) is mapping Ayurveda terminology to standard codes. For example, specific Vyadhis are being mapped to ICD-11 traditional medicine chapters.

## MODULE 4: Data Integrity & Quality (4 pages)

### 4.1 ALCOA+
- **Attributable**: Who generated the data? (e.g., Dr. Smith signed the CRF).
- **Legible**: Can it be read? (eCRF ensures no bad handwriting).
- **Contemporaneous**: Recorded at the time it occurred. (Timestamped entry).
- **Original**: The first record of the data.
- **Accurate**: Correct and valid.
- **Complete, Consistent, Enduring, Available**: Data must not be missing, must align logically, must be stored long-term safely, and accessible for audits.

### 4.2 Audit Trail
- Records: Timestamp, User ID, Old Value, New Value, Reason for Change.
- Legal significance: Without an audit trail, data can be manipulated, rendering the trial invalid under 21 CFR Part 11.

### 4.3 RBAC (Role-Based Access Control)
| Role | View Patient Data | Enter CRF | Raise Query | Close Query | Lock DB | View Audit Trail |
|---|---|---|---|---|---|---|
| PI | Yes | Yes | No | Yes | Yes | Yes |
| CRC | Yes | Yes | No | No | No | No |
| Monitor | Yes | No | Yes | No | No | Yes |
| Statistician | Anonymized | No | No | No | No | No |

### 4.4 Query Management
Queries are essential for data cleaning. Workflow: CRC enters data -> Validation fails (e.g., HR = 250) -> Query auto-generated -> PI provides reason or corrects it -> Query closed.

## MODULE 5: Existing CTMS & Market Gap (5 pages)

### 5.1 Platform Research
- **Veeva Vault CTMS**: Enterprise-grade, highly expensive, rigid.
- **Medidata Rave**: Industry standard EDC, expensive, proprietary.
- **OpenClinica**: Open source, older UI, hard to customize for non-allopathic.
- **REDCap**: Academic favorite, free for non-profits, but lacks strict CTMS workflows.
- **Castor EDC**: Modern, affordable, but generic.

### 5.2 Feature Gap Matrix
| Feature | Veeva | Medidata | OpenClinica | REDCap | Castor | SURTAMIND |
|---|---|---|---|---|---|---|
| Ayurveda Case History | No | No | No | Partial | No | Yes |
| Prakriti Assessment | No | No | No | No | No | Yes |
| CDISC Export | Yes | Yes | Yes | No | Yes | Yes |
| FHIR Integration | Yes | Yes | Partial | Partial | Yes | Yes |
| Open Source/Cost | Very High | Very High | Free/Med | Free | Med | Accessible |

### 5.3 SURTAMIND Technical Architecture
- **Frontend**: React + TypeScript (Robust, scalable UI).
- **Backend**: FastAPI (Python) (High performance, async, great for data processing).
- **Database**: PostgreSQL (Relational integrity, JSONB support for dynamic CRFs).
- **Data Standards**: CDISC SDTM export layer.
- **Interoperability**: FHIR R4 REST API.

## MANDATORY RESEARCH QUESTIONS TO ANSWER
1. **Why is CDISC internationally accepted?** It standardizes data making regulatory review efficient and pooled analysis possible.
2. **Why do journals ask for standardized datasets?** For reproducibility and independent verification.
3. **Difference between CDASH, SDTM, ADaM?** CDASH is for collection, SDTM is for tabulation/storage, ADaM is for statistical analysis.
4. **Can Ayurveda variables be represented in CDISC?** Yes, via custom domains or SUPPQUAL, though standardization efforts are ongoing.
5. **What is FHIR R4?** The 4th release of Fast Healthcare Interoperability Resources, establishing stable RESTful APIs for healthcare.
6. **Patient vs ResearchSubject?** Patient is the person in a hospital; ResearchSubject is that same person's specific enrollment in a trial.
7. **How would AIIA's HIS communicate with SURTAMIND?** Via FHIR REST APIs exchanging Patient and Observation resources.
8. **Why use REST APIs instead of custom formats?** Standard APIs like FHIR ensure any 3rd party system can integrate without custom coding.
9. **What is ALCOA+?** Principles for data integrity: Attributable, Legible, Contemporaneous, Original, Accurate, Complete, Consistent, Enduring, Available.
10. **Why is audit trail legally important?** Proves no fraudulent data manipulation occurred.
11. **What is Source Data Verification?** Comparing the eCRF data back to the original hospital source docs.
12. **How are queries resolved?** By investigators correcting the data or providing justification.
13. **Why is Veeva expensive?** Enterprise validation, pharma-grade compliance, proprietary lock-in.
14. **Why is REDCap popular in academia?** Free for non-profits and easy to set up basic forms.
15. **Why doesn't any CTMS support Ayurveda well?** They are hardcoded for allopathic variables and lack traditional medicine ontologies.
16. **What is SURTAMIND's unique technical advantage?** Combines robust CDISC/FHIR compliance with specialized Ayurveda modules (Prakriti, modern + traditional integration).
