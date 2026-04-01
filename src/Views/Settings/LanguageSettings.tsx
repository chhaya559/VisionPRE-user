import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setLanguage } from '../../Store/Common';
import './Settings.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faCircleInfo,
  faGlobe,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';

const LANGUAGES = [
  { code: 'en', name: 'English', subKey: 'englishUS', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', subKey: 'frenchName', flag: '🇫🇷' },
  { code: 'es', name: 'Español', subKey: 'spanishName', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', subKey: 'germanName', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', subKey: 'italianName', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', subKey: 'portugueseName', flag: '🇵🇹' },
  { code: 'ar', name: 'العربية', subKey: 'arabicName', flag: '🇦🇪' },
  { code: 'zh', name: '中文', subKey: 'chineseName', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', subKey: 'japaneseName', flag: '🇯🇵' },
];

export default function LanguageSettings() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { i18n, t } = useTranslation('settings');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(i18n.language);

  const filteredLanguages = LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase())
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
        >
          <FontAwesomeIcon icon={faChevronLeft} />
          {t('language.back')}
        </button>
        <div className="header-info">
          <h1>{t('language.title')}</h1>
          <p>{t('language.description')}</p>
        </div>
      </header>

      <div className="settings-card">
        <div className="search-wrapper">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
          <input
            type="text"
            placeholder={t('language.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="settings-section-block">
          <h3 className="settings-section-title">
            <FontAwesomeIcon icon={faGlobe} />
            {t('language.allLanguages')}
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
                  <p>{t(`language.${lang.subKey}`)}</p>
                </div>
                <div className="radio-circle" />
              </div>
            ))}
          </div>
        </div>

        <div className="restart-notice">
          <FontAwesomeIcon icon={faCircleInfo} />
          {t('language.applyNote')}
        </div>

        <button className="btn-save" onClick={handleApply}>
          {t('language.apply')}
        </button>
      </div>
    </div>
  );
}
