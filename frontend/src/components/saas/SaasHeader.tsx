import React, { useState } from 'react';
import { ExternalLink, Globe, Menu, X } from 'lucide-react';

interface SaasHeaderProps {
  activePage: 'home' | 'dashboard' | 'problem' | 'progress' | 'download';
  onNavigate: (page: 'home' | 'dashboard' | 'problem' | 'progress' | 'download') => void;
  onLaunchApp: () => void;
  lang: 'en' | 'hi';
  onToggleLang: () => void;
  isAuthenticated: boolean;
}

export const SaasHeader: React.FC<SaasHeaderProps> = ({
  activePage,
  onNavigate,
  onLaunchApp,
  lang,
  onToggleLang,
  isAuthenticated,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = {
    en: {
      brand: 'SutraMind',
      tag: 'Ayurveda CTMS',
      home: 'Home',
      dashboard: 'Live Dashboard',
      problem: 'Problem Statement',
      progress: 'Roadmap & Progress',
      download: 'Windows App (.exe)',
      launchApp: isAuthenticated ? 'Open Clinical App' : 'Launch CTMS Platform',
    },
    hi: {
      brand: 'सूत्रमाइंड',
      tag: 'आयुर्वेद सीटीएमएस',
      home: 'होम',
      dashboard: 'लाइव डैशबोर्ड',
      problem: 'समस्या विवरण (PS)',
      progress: 'प्रगति एवं रोडमैप',
      download: 'विंडोज ऐप (.exe)',
      launchApp: isAuthenticated ? 'क्लिनिकल ऐप खोलें' : 'सीटीएमएस शुरू करें',
    },
  }[lang];

  const handleNav = (page: 'home' | 'dashboard' | 'problem' | 'progress' | 'download') => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="saas-header">
      <div className="saas-container">
        <div className="saas-header-inner">
          <div className="saas-brand" onClick={() => handleNav('home')}>
            <img src="/brand/sutramind-logo.png" alt="SutraMind Logo" className="saas-brand-logo" />
            <div>
              <span className="saas-brand-title">
                {t.brand}
                <span className="saas-brand-tag">{t.tag}</span>
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="saas-nav">
            <button
              className={`saas-nav-link ${activePage === 'home' ? 'active' : ''}`}
              onClick={() => handleNav('home')}
            >
              {t.home}
            </button>
            <button
              className={`saas-nav-link ${activePage === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleNav('dashboard')}
            >
              {t.dashboard}
            </button>
            <button
              className={`saas-nav-link ${activePage === 'problem' ? 'active' : ''}`}
              onClick={() => handleNav('problem')}
            >
              {t.problem}
            </button>
            <button
              className={`saas-nav-link ${activePage === 'progress' ? 'active' : ''}`}
              onClick={() => handleNav('progress')}
            >
              {t.progress}
            </button>
            <button
              className={`saas-nav-link ${activePage === 'download' ? 'active' : ''}`}
              onClick={() => handleNav('download')}
              style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
            >
              <span>💻</span>
              <span>{t.download}</span>
            </button>
          </nav>

          <div className="saas-header-actions">
            <a
              href="/downloads/SutraMind-Windows-Setup-v1.0.exe"
              download
              className="saas-btn-download"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "#0f172a",
                color: "#ffffff",
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "0.82rem",
                fontWeight: 600,
                textDecoration: "none",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                transition: "all 0.15s ease"
              }}
              title="Download Windows Desktop App (Offline Client)"
            >
              <span>💻</span>
              <span>Windows App</span>
              <span style={{ fontSize: "10px", background: "#0d9488", color: "#fff", padding: "1px 4px", borderRadius: "3px" }}>v1.0</span>
            </a>

            <button
              className="saas-lang-btn"
              onClick={onToggleLang}
              title="Toggle Language / भाषा बदलें"
            >
              <Globe size={15} />
              <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            <button
              className="saas-btn-primary"
              onClick={onLaunchApp}
              title="Launch CTMS Clinical Workbench"
            >
              <span>{t.launchApp}</span>
              <ExternalLink size={14} />
            </button>

            {/* Mobile menu trigger */}
            <button
              className="saas-lang-btn"
              style={{ display: 'none' }} // shown via media queries if needed
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
