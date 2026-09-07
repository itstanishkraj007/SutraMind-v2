import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Database,
  Lock,
  Languages,
  CheckCircle2,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: 'home' | 'dashboard' | 'problem' | 'progress') => void;
  onLaunchApp: () => void;
  lang: 'en' | 'hi';
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onLaunchApp, lang }) => {
  const [activeRoleTab, setActiveRoleTab] = useState<'pi' | 'coordinator' | 'monitor' | 'ethics' | 'admin' | 'pv'>('pi');

  const t = {
    en: {
      badge: 'Smart India Hackathon 2026 • Ministry of Ayush • AYUSH-GCP Compliant',
      heroTitlePrefix: 'The Native Clinical Trial Management System for ',
      heroTitleHighlight: 'Ayurveda Research',
      heroDesc:
        'Bridge classical Ayurvedic clinical observations (Prakriti, Agni, Bala, Doshic variation, Anupana) with global clinical trial rigor (Good Clinical Practice, Schedule Y, 21 CFR Part 11, CDISC SDTM).',
      ctaLaunch: 'Launch CTMS Platform',
      ctaProblem: 'Explore Problem Statement',
      metrics: [
        { val: '100%', lbl: 'Structured Ayurveda Data' },
        { val: '6 Roles', lbl: 'Strict Role-Based Access' },
        { val: '12 / 12', lbl: 'Automated Tests Passing' },
        { val: 'EN | HI', lbl: 'Bilingual Interface' },
      ],
      workflowTitle: 'End-to-End Ayurvedic Trial Workflow',
      workflowDesc: 'A unified clinical journey from protocol definition to regulatory KPI aggregation.',
      steps: [
        {
          num: '1',
          title: 'Protocol & Ethics Setup',
          desc: 'Configure study parameters, Vyadhi diagnosis, classical intervention, Anupana, and track IEC review.',
        },
        {
          num: '2',
          title: 'Participant Enrollment',
          desc: 'Enrol subjects with age, gender, randomization IDs, and study site allocation.',
        },
        {
          num: '3',
          title: '5-Point Ayurveda Baseline',
          desc: 'Record constitutional Prakriti, digestive Agni, physical Bala, mental Satva, and Vikriti symptoms.',
        },
        {
          num: '4',
          title: 'Digital CRF & Vitals Capture',
          desc: 'Conduct scheduled visits, record intervals vitals, drug compliance, and lock completed forms.',
        },
        {
          num: '5',
          title: 'Field Discrepancy Queries',
          desc: 'CRA monitors raise field-level queries; coordinators submit evidence; PIs close resolutions.',
        },
        {
          num: '6',
          title: 'Real-Time Research KPIs',
          desc: 'Instant aggregation of recruitment progress, adherence rates, Prakriti distribution, and ethics status.',
        },
      ],
      pillarsTitle: 'Engineered Specifically for Ayurveda',
      pillarsDesc: 'Why generic Western CTMS platforms fail and how SutraMind solves the structural gap.',
      pillars: [
        {
          icon: <Database className="w-6 h-6" />,
          title: 'Structured Ayurveda Ontology',
          desc: 'Eliminates the "unstructured text box trap" by providing controlled master dictionaries for Prakriti, Agni, Bala, Satva, and classical formulations.',
        },
        {
          icon: <ShieldCheck className="w-6 h-6" />,
          title: 'Multi-Role Segregation of Duties',
          desc: 'Enforces strict clinical trial boundaries between Investigators (PI), Coordinators, Monitors (CRA), Ethics Committees (IEC), and Administrators.',
        },
        {
          icon: <Lock className="w-6 h-6" />,
          title: 'Data Integrity & Form Locking',
          desc: 'CRFs support drafting during patient visits and automatically freeze into read-only records upon completion, preventing retroactive alteration.',
        },
        {
          icon: <Languages className="w-6 h-6" />,
          title: 'Bilingual Clinical Operation',
          desc: 'Full English and Hindi localization enables tier-2/3 Ayurvedic hospital coordinators and traditional Vaidyas to record clinical data with ease.',
        },
      ],
      rolesTitle: 'Tailored Workspaces for Every Trial Stakeholder',
      rolesDesc: 'Click each role to inspect their dedicated operational boundaries and capabilities.',
      roles: {
        pi: {
          name: 'Principal Investigator (PI)',
          badge: 'Trial Governance & Protocol Owner',
          desc: 'PIs design and initiate clinical trials, specify protocol Vyadhi mappings and Anupana, govern site teams, verify coordinator query responses, and monitor research KPIs.',
          items: [
            'Trial creation and protocol version control',
            'Final query closure and discrepancy arbitration',
            'Study activation following IEC approval',
            'Full trial participant oversight and KPI analytics',
          ],
        },
        coordinator: {
          name: 'Clinical Research Coordinator (CRC)',
          badge: 'Data Entry & Patient Interaction',
          desc: 'Coordinators work directly with participants at trial sites, capturing baseline Ayurvedic evaluations, scheduling follow-ups, filling eCRFs, and responding to monitor queries.',
          items: [
            'Participant enrollment and randomization ID assignment',
            '5-Point Ayurveda baseline recording (Prakriti, Agni, Bala, Satva)',
            'Visit scheduling and eCRF clinical data entry',
            'Query response with clinical source verification notes',
          ],
        },
        monitor: {
          name: 'Clinical Research Associate (Monitor / CRA)',
          badge: 'Source Data Verification (SDV)',
          desc: 'Monitors independently verify clinical trial records against hospital source documents, detect anomalies, and raise field-specific discrepancy queries. Monitors cannot edit trial data.',
          items: [
            'Read-only access to enrolled participant CRFs and visits',
            'Field-level discrepancy query generation (weight, BP, vitals)',
            'Monitoring visit progress and data completeness',
            'Zero edit permissions on primary clinical records',
          ],
        },
        ethics: {
          name: 'Institutional Ethics Committee (IEC)',
          badge: 'Ethical Oversight & Patient Privacy',
          desc: 'Ethics committee members oversee ethical clearance, approval renewals, and protocol compliance. To preserve patient confidentiality, ethics users cannot see participant health records.',
          items: [
            'IEC approval number, decision status, and validity dates',
            'Continuing ethics review and renewal tracking',
            'Zero access to identifying participant medical data',
            'Independent regulatory audit readiness',
          ],
        },
        admin: {
          name: 'System Administrator',
          badge: 'Access Control & Vocabulary Governance',
          desc: 'Administrators manage user accounts, assign team roles to study sites, and maintain the controlled Ayurvedic master dictionary without disrupting existing records.',
          items: [
            'User provisioning across all 6 clinical roles',
            'Controlled terminology activation / deactivation',
            'Addition of new Ayurvedic formulations and diagnosis terms',
            'Global trial oversight across all registered institutions',
          ],
        },
        pv: {
          name: 'Pharmacovigilance (PV) Officer',
          badge: 'Safety Surveillance Framework',
          desc: 'Safety officers monitor study metadata and trial interventions, preparing for adverse event tracking and post-market safety surveillance of ASU&H medicines.',
          items: [
            'Intervention and formulation safety surveillance',
            'Monitoring study activation and adherence statistics',
            'Foundation for Phase 2 expedited AE/SAE reporting',
          ],
        },
      },
      ctaBannerTitle: 'Ready to Experience SutraMind CTMS?',
      ctaBannerDesc: 'Log in with pre-seeded demo accounts across all 6 clinical roles or inspect live trial workflows in your browser.',
      ctaBannerBtn: 'Launch Interactive CTMS',
    },
    hi: {
      badge: 'स्मार्ट इंडिया हैकथॉन 2026 • आयुष मंत्रालय • आयुष-जीसीपी अनुपालक',
      heroTitlePrefix: 'आयुर्वेद अनुसंधान हेतु समर्पित ',
      heroTitleHighlight: 'क्लीनिकल ट्रायल मैनेजमेंट सिस्टम',
      heroDesc:
        'पारंपरिक आयुर्वेदिक प्रेक्षणों (प्रकृति, अग्नि, बल, सत्व, दोष, अनुपान) को वैश्विक नैदानिक मानकों (जीसीपी, शिड्यूल वाई, 21 सीएफआर पार्ट 11, सीडीआईएससी) से जोड़ें।',
      ctaLaunch: 'सीटीएमएस शुरू करें',
      ctaProblem: 'समस्या विवरण देखें',
      metrics: [
        { val: '100%', lbl: 'संरचित आयुर्वेद डेटा' },
        { val: '6 भूमिकाएं', lbl: 'सख्त आरबीएसी नियंत्रण' },
        { val: '12 / 12', lbl: 'सत्यापित स्वचालित टेस्ट' },
        { val: 'अंग्रेजी | हिन्दी', lbl: 'द्विभाषी इंटरफ़ेस' },
      ],
      workflowTitle: 'सम्पूर्ण आयुर्वेदिक नैदानिक कार्यप्रवाह',
      workflowDesc: 'प्रोटोकॉल परिभाषा से लेकर नियामक केपीआई तक एक एकीकृत यात्रा।',
      steps: [
        {
          num: '1',
          title: 'प्रोटोकॉल एवं आचार समिति',
          desc: 'अध्ययन पैरामीटर, व्याधि निदान, शास्त्रीय औषधि, अनुपान और आईईसी स्वीकृति दर्ज करें।',
        },
        {
          num: '2',
          title: 'प्रतिभागी नामांकन',
          desc: 'उम्र, लिंग, रैंडमाइजेशन आईडी और अध्ययन केंद्र के साथ प्रतिभागियों का नामांकन करें।',
        },
        {
          num: '3',
          title: '5-बिंदु आयुर्वेद बेसलाइन',
          desc: 'प्रकृति, जठराग्नि, शारीरिक बल, मानसिक सत्व और विकृति लक्षणों का रिकॉर्ड रखें।',
        },
        {
          num: '4',
          title: 'डिजिटल सीआरएफ और वाइटल्स',
          desc: 'निर्धारित विज़िट करें, वाइटल्स, औषधि अनुपालन दर्ज करें और पूर्ण फॉर्म को लॉक करें।',
        },
        {
          num: '5',
          title: 'डेटा विसंगति समाधान (क्वेरी)',
          desc: 'मॉनिटर प्रश्न उठाते हैं; समन्वयक उत्तर देते हैं; मुख्य अन्वेषक (PI) समाधान बंद करते हैं।',
        },
        {
          num: '6',
          title: 'वास्तविक समय अनुसंधान केपीआई',
          desc: 'भर्ती प्रगति, दवा अनुपालन दर, प्रकृति वितरण और आचार स्थिति का त्वरित विश्लेषण।',
        },
      ],
      pillarsTitle: 'विशेष रूप से आयुर्वेद के लिए निर्मित',
      pillarsDesc: 'सामान्य पश्चिमी सीटीएमएस क्यों असफल होते हैं और सूत्रमाइंड इसे कैसे हल करता है।',
      pillars: [
        {
          icon: <Database className="w-6 h-6" />,
          title: 'संरचित आयुर्वेद शब्दावली',
          desc: 'प्रकृति, अग्नि, बल, सत्व और शास्त्रीय औषधियों के लिए नियंत्रित मास्टर डिक्शनरी प्रदान करता है।',
        },
        {
          icon: <ShieldCheck className="w-6 h-6" />,
          title: 'भूमिका-आधारित सख्त नियंत्रण',
          desc: 'मुख्य अन्वेषक, समन्वयक, मॉनिटर, आचार समिति और एडमिन के बीच कार्य विभाजन लागू करता है।',
        },
        {
          icon: <Lock className="w-6 h-6" />,
          title: 'डेटा अखंडता एवं फॉर्म लॉकिंग',
          desc: 'पूर्ण सीआरएफ स्वचालित रूप से केवल-पठनीय बन जाते हैं, जिससे पूर्वव्यापी छेड़छाड़ रुकती है।',
        },
        {
          icon: <Languages className="w-6 h-6" />,
          title: 'द्विभाषी संचालन (हिन्दी/अंग्रेजी)',
          desc: 'टियर-2/3 आयुर्वेदिक अस्पतालों और पारंपरिक वैद्यों के लिए आसान नैदानिक डेटा प्रविष्टि।',
        },
      ],
      rolesTitle: 'प्रत्येक प्रतिभागी के लिए विशिष्ट कार्यस्थल',
      rolesDesc: 'उनकी समर्पित सीमाओं और क्षमताओं को देखने के लिए प्रत्येक भूमिका पर क्लिक करें।',
      roles: {
        pi: {
          name: 'मुख्य अन्वेषक (PI)',
          badge: 'ट्रायल प्रशासन एवं प्रोटोकॉल स्वामी',
          desc: 'पीआई अध्ययन शुरू करते हैं, प्रोटोकॉल और अनुपान तय करते हैं, टीम नियंत्रित करते हैं और अंतिम क्वेरी बंद करते हैं।',
          items: [
            'ट्रायल निर्माण और प्रोटोकॉल संस्करण नियंत्रण',
            'अंतिम क्वेरी समाधान और विवाद मध्यस्थता',
            'आईईसी अनुमोदन के बाद अध्ययन सक्रियण',
            'प्रतिभागी निगरानी और केपीआई विश्लेषण',
          ],
        },
        coordinator: {
          name: 'अध्ययन समन्वयक (CRC)',
          badge: 'डेटा प्रविष्टि एवं रोगी संपर्क',
          desc: 'समन्वयक बेसलाइन आयुर्वेद मूल्यांकन दर्ज करते हैं, विज़िट शेड्यूल करते हैं और मॉनिटर प्रश्नों के उत्तर देते हैं।',
          items: [
            'प्रतिभागी नामांकन और रैंडमाइजेशन कोड',
            '5-बिंदु आयुर्वेद बेसलाइन (प्रकृति, अग्नि, बल, सत्व)',
            'विज़िट शेड्यूलिंग और सीआरएफ डेटा प्रविष्टि',
            'स्रोत डेटा सत्यापन के साथ क्वेरी उत्तर',
          ],
        },
        monitor: {
          name: 'क्लिनिकल मॉनिटर (CRA)',
          badge: 'स्रोत डेटा सत्यापन (SDV)',
          desc: 'मॉनिटर स्वतंत्र रूप से रिकॉर्ड की जांच करते हैं और विसंगति प्रश्न उठाते हैं। वे डेटा बदल नहीं सकते।',
          items: [
            'सीआरएफ और विज़िट्स का केवल-पठनीय अवलोकन',
            'विशिष्ट फ़ील्ड विसंगति प्रश्न (वजन, बीपी, वाइटल्स)',
            'डेटा पूर्णता और प्रोटोकॉल अनुपालन जांच',
            'प्राथमिक रिकॉर्ड पर शून्य संपादन अधिकार',
          ],
        },
        ethics: {
          name: 'संस्थागत आचार समिति (IEC)',
          badge: 'नैतिक निगरानी एवं गोपनीयता',
          desc: 'आचार समिति अनुमोदन संख्या, निर्णय और वैधता की निगरानी करती है। वे रोगी का व्यक्तिगत डेटा नहीं देख सकते।',
          items: [
            'आईईसी अनुमोदन संख्या और स्थिति ट्रैकिंग',
            'निरंतर समीक्षा और नवीनीकरण प्रबंधन',
            'रोगी के व्यक्तिगत डेटा पर शून्य पहुंच',
            'नियामक ऑडिट तैयारी',
          ],
        },
        admin: {
          name: 'सिस्टम एडमिनिस्ट्रेटर',
          badge: 'एक्सेस नियंत्रण एवं शब्दावली प्रबंधन',
          desc: 'उपयोगकर्ता खाते बनाते हैं और रिकॉर्ड तोड़े बिना नियंत्रित आयुर्वेद मास्टर डिक्शनरी प्रबंधित करते हैं।',
          items: [
            'सभी 6 भूमिकाओं में उपयोगकर्ता प्रबंधन',
            'मास्टर शब्दावली सक्रिय/निष्क्रिय करना',
            'नई आयुर्वेदिक औषधियों और व्याधियों का समावेश',
            'सभी संस्थानों में वैश्विक परीक्षण प्रबंधन',
          ],
        },
        pv: {
          name: 'फार्माकोविजिलेंस (PV) अधिकारी',
          badge: 'सुरक्षा निगरानी ढांचा',
          desc: 'दवाओं की सुरक्षा निगरानी और प्रतिकूल घटनाओं (AE/SAE) की रिपोर्टिंग के लिए अध्ययन डेटा की निगरानी।',
          items: [
            'शास्त्रीय योगों की सुरक्षा निगरानी',
            'अध्ययन सक्रियण और अनुपालन आंकड़े',
            'फेज 2 त्वरित रिपोर्टिंग का आधार',
          ],
        },
      },
      ctaBannerTitle: 'क्या आप सूत्रमाइंड सीटीएमएस देखने के लिए तैयार हैं?',
      ctaBannerDesc: 'सभी 6 भूमिकाओं के लिए पूर्व-निर्मित डेमो खातों से लॉग इन करें या लाइव ट्रायल वर्कफ़्लो का निरीक्षण करें।',
      ctaBannerBtn: 'सीटीएमएस लाइव शुरू करें',
    },
  }[lang];

  const currentRole = t.roles[activeRoleTab];

  return (
    <div className="saas-animate-fade">
      {/* Hero Section */}
      <section className="saas-hero">
        <div className="saas-container">
          <div className="saas-hero-content">
            <div className="saas-pill">
              <span className="saas-pill-dot" />
              <span>{t.badge}</span>
            </div>

            <h1 className="saas-hero-title">
              {t.heroTitlePrefix}
              <span className="highlight">{t.heroTitleHighlight}</span>
            </h1>

            <p className="saas-hero-desc">{t.heroDesc}</p>

            <div className="saas-hero-ctas">
              <button className="saas-btn-gold" onClick={onLaunchApp}>
                <Sparkles size={18} />
                <span>{t.ctaLaunch}</span>
                <ArrowRight size={16} />
              </button>
              <button className="saas-btn-secondary" onClick={() => onNavigate('problem')}>
                <span>{t.ctaProblem}</span>
              </button>
            </div>

            {/* Interactive Hero Preview Card (Stylized Live Trial Mockup) */}
            <div className="saas-hero-preview">
              <div className="saas-mockup-header">
                <div className="saas-mockup-dots">
                  <span className="saas-mockup-dot red" />
                  <span className="saas-mockup-dot yellow" />
                  <span className="saas-mockup-dot green" />
                </div>
                <span className="saas-mockup-title">
                  SutraMind CTMS • Active Study Workbench (Phase II Trial)
                </span>
                <span className="saas-status-badge completed">● ONLINE PROTOTYPE</span>
              </div>

              <div className="saas-mockup-body">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Active Clinical Trial</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f5953', marginTop: '4px' }}>AMAVATA-001</div>
                    <div style={{ fontSize: '0.82rem', color: '#475569' }}>Yogaraja Guggulu in Amavata (Rheumatoid Arthritis)</div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>IEC Ethics Review</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#16a34a', marginTop: '4px' }}>APPROVED</div>
                    <div style={{ fontSize: '0.82rem', color: '#475569' }}>AIIA-IEC-DEMO-001 • Valid to 2027</div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Ayurveda Baseline Spec</div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                      <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>Prakriti: P6 (Vata-Kapha)</span>
                      <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>Agni: A2 (Tikshnagni)</span>
                      <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>Bala: B2 (Madhyama)</span>
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Intervention & Anupana</div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>Yogaraja Guggulu (Vati / DF01)</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Anupana: Koshna Jala (Warm Water • AN01)</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #edf2f7', fontSize: '0.85rem', color: '#64748b', flexWrap: 'wrap', gap: '8px' }}>
                  <span>🔒 eCRF Locked on Completion • 21 CFR Part 11 Architecture Ready</span>
                  <button
                    onClick={onLaunchApp}
                    style={{ background: 'none', border: 'none', color: '#0f5953', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <span>Click to open live workbench</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Bar */}
      <section className="saas-container">
        <div className="saas-metrics-bar">
          {t.metrics.map((m, idx) => (
            <div key={idx} className="saas-metric-card">
              <div className="saas-metric-val">{m.val}</div>
              <div className="saas-metric-lbl">{m.lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow Timeline */}
      <section className="saas-section" style={{ background: 'var(--saas-surface)' }}>
        <div className="saas-container">
          <div className="saas-section-header">
            <div className="saas-section-tag">Lifecycle Management</div>
            <h2 className="saas-section-title">{t.workflowTitle}</h2>
            <p className="saas-section-desc">{t.workflowDesc}</p>
          </div>

          <div className="saas-workflow-steps">
            {t.steps.map((step, idx) => (
              <div key={idx} className="saas-step-card">
                <div className="saas-step-badge">{step.num}</div>
                <h3 className="saas-step-title">{step.title}</h3>
                <p className="saas-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Core Pillars */}
      <section className="saas-section">
        <div className="saas-container">
          <div className="saas-section-header">
            <div className="saas-section-tag">Core Value Proposition</div>
            <h2 className="saas-section-title">{t.pillarsTitle}</h2>
            <p className="saas-section-desc">{t.pillarsDesc}</p>
          </div>

          <div className="saas-grid-2">
            {t.pillars.map((pillar, idx) => (
              <div key={idx} className="saas-card">
                <div className="saas-card-icon">{pillar.icon}</div>
                <h3 className="saas-card-title">{pillar.title}</h3>
                <p className="saas-card-text">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Explorer */}
      <section className="saas-section" style={{ background: 'var(--saas-surface-muted)' }}>
        <div className="saas-container">
          <div className="saas-section-header">
            <div className="saas-section-tag">Role-Based Access Control (RBAC)</div>
            <h2 className="saas-section-title">{t.rolesTitle}</h2>
            <p className="saas-section-desc">{t.rolesDesc}</p>
          </div>

          <div className="saas-tabs-header">
            {(['pi', 'coordinator', 'monitor', 'ethics', 'admin', 'pv'] as const).map((roleKey) => (
              <button
                key={roleKey}
                className={`saas-tab-btn ${activeRoleTab === roleKey ? 'active' : ''}`}
                onClick={() => setActiveRoleTab(roleKey)}
              >
                {t.roles[roleKey].name.split(' (')[0]}
              </button>
            ))}
          </div>

          <div className="saas-tab-content saas-animate-fade" key={activeRoleTab}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--saas-primary-dark)' }}>
                {currentRole.name}
              </h3>
              <span className="saas-status-badge completed">{currentRole.badge}</span>
            </div>

            <p style={{ fontSize: '1.05rem', color: 'var(--saas-text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
              {currentRole.desc}
            </p>

            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--saas-primary)', marginBottom: '12px' }}>
              Key Role Responsibilities & Permissions:
            </h4>

            <ul className="saas-checklist">
              {currentRole.items.map((item, idx) => (
                <li key={idx} className="saas-checklist-item">
                  <div className="saas-check-icon green">
                    <CheckCircle2 size={14} />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="saas-container">
        <div className="saas-cta-banner">
          <h2 className="saas-cta-title">{t.ctaBannerTitle}</h2>
          <p className="saas-cta-desc">{t.ctaBannerDesc}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button className="saas-btn-gold" onClick={onLaunchApp}>
              <Sparkles size={18} />
              <span>{t.ctaBannerBtn}</span>
              <ArrowRight size={16} />
            </button>
            <button
              className="saas-btn-secondary"
              style={{ background: 'transparent', color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)' }}
              onClick={() => onNavigate('dashboard')}
            >
              <span>View Interactive Analytics</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
