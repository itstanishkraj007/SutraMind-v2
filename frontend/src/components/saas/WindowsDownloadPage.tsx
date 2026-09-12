import React from "react";
import {
  Download,
  ShieldCheck,
  HardDrive,
  Cpu,
  CheckCircle2,
  RefreshCw,
  Lock,
  ArrowRight,
  Terminal,
  FileCheck,
  AlertCircle
} from "lucide-react";

interface WindowsDownloadPageProps {
  onLaunchApp: () => void;
  lang: "en" | "hi";
}

export const WindowsDownloadPage: React.FC<WindowsDownloadPageProps> = ({ onLaunchApp, lang }) => {
  const t = {
    en: {
      badge: "Production Release • Version 1.0.0 (x64) • Windows 10 & 11",
      title: "SutraMind for Windows Desktop",
      subtitle:
        "High-performance, offline-first Clinical Trial Management workstation purpose-built for rural clinical trial sites, multi-center hospital nodes, and intermittent connectivity environments.",
      downloadBtn: "Download Windows Setup (.exe)",
      downloadSize: "64-bit Installer • ~85 MB • SHA-256 Verified",
      launchWebCta: "Open Web Workstation Instead",
      
      featuresTitle: "Why Use the SutraMind Desktop Client?",
      featuresSubtitle: "Enterprise resilience engineered specifically for Ayurveda clinical field operations.",
      features: [
        {
          icon: <HardDrive size={24} />,
          title: "Encrypted SQLite Local Outbox",
          desc: "Collect participant intake, baseline constitutional Prakriti assessments, and visit CRFs without an internet connection. Stored in AES-256 encrypted SQLite.",
        },
        {
          icon: <RefreshCw size={24} />,
          title: "Conflict-Free Bi-Directional Cloud Sync",
          desc: "Automated sync worker pings AWS EC2 (177.71.146.106) every 30 seconds. Transmits queued records and pulls approved protocols seamlessly upon network return.",
        },
        {
          icon: <Lock size={24} />,
          title: "Principal Investigator Gatekeeper",
          desc: "Restricted role enforcement. Field coordinators record offline; Principal Investigator cryptographically signs off on visit CRFs and adverse event reports.",
        },
        {
          icon: <ShieldCheck size={24} />,
          title: "NDCT Rule 42 Fast-Track Queue",
          desc: "Critical SAE alerts are prioritized at the front of the sync queue, ensuring 24-hour statutory regulatory compliance to Ethics Committees as soon as connectivity resumes.",
        },
      ],

      reqTitle: "Minimum System Specifications",
      os: "Windows 10 (21H2+) or Windows 11 (64-bit)",
      cpu: "Intel Core i3 / AMD Ryzen 3 or higher",
      ram: "4 GB RAM (8 GB recommended for multi-study caching)",
      disk: "500 MB free NVMe/SSD disk storage",
      net: "Periodic network connection required for cloud synchronization",

      stepsTitle: "Installation & Verification Walkthrough",
      steps: [
        {
          num: "01",
          title: "Download Installer",
          desc: "Click the primary download button above to retrieve SutraMind-Windows-Setup-v1.0.exe directly from our cloud repository.",
        },
        {
          num: "02",
          title: "Run Setup Wizard",
          desc: "Launch the installer. If Windows SmartScreen displays a prompt, click 'More info' and select 'Run anyway'.",
        },
        {
          num: "03",
          title: "Select Role & Authenticate",
          desc: "Launch SutraMind Desktop. Click the Principal Investigator (or Coordinator) card in the 3×2 grid and sign in with your trial credentials.",
        },
        {
          num: "04",
          title: "Autonomous Sync Ready",
          desc: "The desktop sync engine establishes an encrypted handshake with the AWS Cloud backend and begins caching study protocols.",
        },
      ],
    },
    hi: {
      badge: "प्रोडक्शन रिलीज • संस्करण 1.0.0 (x64) • विंडोज 10 एवं 11",
      title: "विंडोज डेस्कटॉप के लिए सूत्रमाइंड",
      subtitle:
        "दूरदराज के ग्रामीण परीक्षण केंद्रों, बहु-केंद्रीय अस्पतालों और रुक-रुक कर चलने वाले इंटरनेट के लिए निर्मित उच्च-प्रदर्शन, ऑफलाइन-फर्स्ट सीटीएमएस वर्कस्टेशन।",
      downloadBtn: "विंडोज सेटअप डाउनलोड करें (.exe)",
      downloadSize: "64-बिट इंस्टॉलर • ~85 MB • SHA-256 सत्यापित",
      launchWebCta: "इसके बजाय वेब वर्कस्टेशन खोलें",

      featuresTitle: "सूत्रमाइंड डेस्कटॉप क्लाइंट क्यों चुनें?",
      featuresSubtitle: "आयुर्वेद नैदानिक फील्ड संचालन के लिए विशेष रूप से इंजीनियर की गई कार्यक्षमता।",
      features: [
        {
          icon: <HardDrive size={24} />,
          title: "एन्क्रिप्टेड SQLite लोकल आउटबॉक्स",
          desc: "बिना इंटरनेट के भी प्रतिभागी का डेटा, प्रकृति निर्धारण और विज़िट सीआरएफ दर्ज करें। AES-256 सुरक्षित डेटाबेस में संग्रहित।",
        },
        {
          icon: <RefreshCw size={24} />,
          title: "स्वचालित दोतरफा क्लाउड सिंक",
          desc: "AWS EC2 क्लाउड से प्रत्येक 30 सेकंड में स्वतः समन्वय। इंटरनेट वापस आते ही सभी लंबित रिकॉर्ड क्लाउड में सिंक हो जाते हैं।",
        },
        {
          icon: <Lock size={24} />,
          title: "प्रधान अन्वेषक (PI) सुरक्षा द्वार",
          desc: "कड़ी भूमिका-आधारित सुरक्षा। फील्ड कोऑर्डिनेटर डेटा दर्ज करते हैं और पीआई अंतिम पुष्टि एवं डिजिटल हस्ताक्षर करते हैं।",
        },
        {
          icon: <ShieldCheck size={24} />,
          title: "एनडीसीटी नियम 42 त्वरित रिपोर्टिंग",
          desc: "गंभीर प्रतिकूल घटनाओं (SAE) के अलर्ट प्राथमिकता के साथ कतार में सबसे आगे रहते हैं, जिससे 24 घंटे का वैधानिक अनुपालन सुनिश्चित होता है।",
        },
      ],

      reqTitle: "न्यूनतम सिस्टम आवश्यकताएं",
      os: "विंडोज 10 (21H2+) या विंडोज 11 (64-बिट)",
      cpu: "इंटेल कोर i3 / एएमडी राइजन 3 या उच्च",
      ram: "4 GB रैम (8 GB अनुशंसित)",
      disk: "500 MB उपलब्ध डिस्क स्पेस",
      net: "क्लाउड समन्वय के लिए सामयिक इंटरनेट आवश्यक",

      stepsTitle: "इंस्टॉलेशन एवं सेटअप निर्देश",
      steps: [
        {
          num: "01",
          title: "इंस्टॉलर डाउनलोड करें",
          desc: "ऊपर दिए गए बटन पर क्लिक करके SutraMind-Windows-Setup-v1.0.exe डाउनलोड करें।",
        },
        {
          num: "02",
          title: "सेटअप चलाएं",
          desc: "डाउनलोड की गई फाइल खोलें और ऑन-स्क्रीन सेटअप निर्देशों का पालन करें।",
        },
        {
          num: "03",
          title: "रोल चुनें और लॉगिन करें",
          desc: "3×2 रोल ग्रिड से अपना रोल (जैसे PI) चुनें और क्रेडेंशियल्स दर्ज करें।",
        },
        {
          num: "04",
          title: "ऑफलाइन कार्य आरंभ करें",
          desc: "लोकल कैशिंग सक्रिय हो जाती है और सभी फॉर्म बिना इंटरनेट के भी उपलब्ध रहते हैं।",
        },
      ],
    },
  }[lang];

  return (
    <div className="saas-content">
      {/* Hero Section */}
      <section className="saas-hero" style={{ paddingBottom: "48px" }}>
        <div className="saas-container">
          <div className="saas-badge-wrap">
            <span className="saas-badge">
              <Terminal size={13} style={{ marginRight: "6px" }} />
              {t.badge}
            </span>
          </div>

          <h1 className="saas-hero-title" style={{ maxWidth: "860px", margin: "0 auto 16px" }}>
            {t.title}
          </h1>

          <p className="saas-hero-subtitle" style={{ maxWidth: "720px", margin: "0 auto 32px" }}>
            {t.subtitle}
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "14px",
              marginBottom: "36px",
            }}
          >
            <a
              href="/downloads/SutraMind-Windows-Setup-v1.0.exe"
              download
              className="saas-btn-primary"
              style={{
                fontSize: "1.05rem",
                padding: "14px 28px",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                boxShadow: "0 4px 14px rgba(15, 89, 83, 0.35)",
              }}
            >
              <Download size={20} />
              <span>{t.downloadBtn}</span>
            </a>

            <span style={{ fontSize: "0.82rem", color: "#64748b" }}>
              {t.downloadSize}
            </span>

            <button
              onClick={onLaunchApp}
              style={{
                background: "none",
                border: "none",
                color: "var(--primary-color)",
                fontSize: "0.88rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                marginTop: "4px",
              }}
            >
              <span>{t.launchWebCta}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section style={{ padding: "64px 0", background: "#f8faf9", borderTop: "1px solid rgba(15, 89, 83, 0.08)", borderBottom: "1px solid rgba(15, 89, 83, 0.08)" }}>
        <div className="saas-container">
          <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 48px" }}>
            <h2 style={{ fontSize: "1.85rem", fontWeight: 700, color: "var(--primary-dark)", marginBottom: "12px" }}>
              {t.featuresTitle}
            </h2>
            <p style={{ color: "#475569", fontSize: "0.98rem", lineHeight: 1.6 }}>
              {t.featuresSubtitle}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
            {t.features.map((feat, i) => (
              <div
                key={i}
                style={{
                  background: "#ffffff",
                  padding: "24px",
                  borderRadius: "12px",
                  border: "1px solid rgba(15, 89, 83, 0.12)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "8px",
                    background: "rgba(15, 89, 83, 0.08)",
                    color: "var(--primary-color)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {feat.icon}
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--primary-dark)", margin: 0 }}>
                  {feat.title}
                </h3>
                <p style={{ fontSize: "0.88rem", color: "#64748b", lineHeight: 1.5, margin: 0 }}>
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specifications & Instructions */}
      <section style={{ padding: "64px 0" }}>
        <div className="saas-container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "40px" }}>
            {/* System Requirements */}
            <div
              style={{
                background: "#ffffff",
                padding: "32px",
                borderRadius: "14px",
                border: "1px solid rgba(15, 89, 83, 0.15)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <Cpu size={22} color="var(--primary-color)" />
                <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--primary-dark)", margin: 0 }}>
                  {t.reqTitle}
                </h3>
              </div>

              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "14px" }}>
                <li style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "0.9rem", color: "#334155" }}>
                  <CheckCircle2 size={18} color="#0d9488" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div><strong>OS:</strong> {t.os}</div>
                </li>
                <li style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "0.9rem", color: "#334155" }}>
                  <CheckCircle2 size={18} color="#0d9488" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div><strong>Processor:</strong> {t.cpu}</div>
                </li>
                <li style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "0.9rem", color: "#334155" }}>
                  <CheckCircle2 size={18} color="#0d9488" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div><strong>RAM:</strong> {t.ram}</div>
                </li>
                <li style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "0.9rem", color: "#334155" }}>
                  <CheckCircle2 size={18} color="#0d9488" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div><strong>Disk Storage:</strong> {t.disk}</div>
                </li>
                <li style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "0.9rem", color: "#334155" }}>
                  <CheckCircle2 size={18} color="#0d9488" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div><strong>Network:</strong> {t.net}</div>
                </li>
              </ul>

              <div
                style={{
                  marginTop: "24px",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  background: "rgba(245, 158, 11, 0.08)",
                  border: "1px solid rgba(245, 158, 11, 0.25)",
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                <AlertCircle size={18} color="#d97706" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: "0.8rem", color: "#92400e", lineHeight: 1.4 }}>
                  Self-contained installer includes SQLite runtime and local schema seeders. No external database installation required.
                </span>
              </div>
            </div>

            {/* Step-by-Step Instructions */}
            <div
              style={{
                background: "#ffffff",
                padding: "32px",
                borderRadius: "14px",
                border: "1px solid rgba(15, 89, 83, 0.15)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <FileCheck size={22} color="var(--primary-color)" />
                <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--primary-dark)", margin: 0 }}>
                  {t.stepsTitle}
                </h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                {t.steps.map((step, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "14px" }}>
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: "var(--primary-color)",
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "0.82rem",
                        flexShrink: 0,
                      }}
                    >
                      {step.num}
                    </div>
                    <div>
                      <h4 style={{ margin: "0 0 4px", fontSize: "0.98rem", fontWeight: 700, color: "var(--primary-dark)" }}>
                        {step.title}
                      </h4>
                      <p style={{ margin: 0, fontSize: "0.86rem", color: "#64748b", lineHeight: 1.45 }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
