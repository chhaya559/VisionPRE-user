import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setLanguage } from '../../Store/Common';
import './Settings.scss';

const LANGUAGES = [
  { code: 'en', name: 'English', subName: 'English (US)', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', subName: 'French', flag: '🇫🇷' },
  { code: 'es', name: 'Español', subName: 'Spanish', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', subName: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', subName: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', subName: 'Portuguese', flag: '🇵🇹' },
  { code: 'ar', name: 'العربية', subName: 'Arabic', flag: '🇦🇪' },
  { code: 'zh', name: '中文', subName: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', subName: 'Japanese', flag: '🇯🇵' },
];

export default function LanguageSettings() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { i18n, t } = useTranslation('private');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(i18n.language);

  const filteredLanguages = LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.subName.toLowerCase().includes(search.toLowerCase())
  );

  const handleApply = () => {
    i18n.changeLanguage(selected);
    dispatch(setLanguage(selected));
    navigate(-1);
  };

  return (
    <div className="edit-profile-container">
      <header className="edit-profile-header secondary">
        <button
          className="back-btn"
          onClick={() => navigate(-1)}
          style={{ position: 'static', marginBottom: '16px', padding: 0 }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            width="20"
            height="20"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          {t('settings.language.back')}
        </button>
        <div className="header-info">
          <h1>{t('settings.language.title')}</h1>
          <p>{t('settings.language.description')}</p>
        </div>
      </header>

      <div className="settings-card">
        <div className="search-wrapper">
          <svg
            className="search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            width="20"
            height="20"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder={t('settings.language.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3
            style={{
              color: '#9ca3af',
              fontSize: '0.875rem',
              fontWeight: 600,
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              width="18"
              height="18"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            {t('settings.language.allLanguages')}
          </h3>
          <div className="language-grid">
            {filteredLanguages.map((lang) => (
              <div
                key={lang.code}
                className={`language-card ${selected.startsWith(lang.code) ? 'selected' : ''
                  }`}
                onClick={() => setSelected(lang.code)}
              >
                <div className="flag-box">{lang.flag}</div>
                <div className="lang-info">
                  <h4>{lang.name}</h4>
                  <p>{lang.subName}</p>
                </div>
                <div className="radio-circle" />
              </div>
            ))}
          </div>
        </div>

        <div className="restart-notice">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            width="20"
            height="20"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          {t('settings.language.applyNote')}
        </div>

        <button className="btn-save" onClick={handleApply}>
          {t('settings.language.apply')}
        </button>
      </div>
    </div>
  );
}
