import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Settings.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  const { t } = useTranslation('settings');

  return (
    <div className="edit-profile-container">
      <header className="edit-profile-header secondary">
        <button type="button" className="back-btn" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faChevronLeft} />
          {t('privacy.back')}
        </button>
        <div className="header-info">
          <h1>{t('privacy.title')}</h1>
          <p>{t('privacy.lastUpdated')}</p>
        </div>
      </header>

      <div className="settings-card">
        <div className="policy-card">
          <h2>{t('privacy.content')}</h2>

          <div className="policy-section">
            <h3>{t('privacy.information')}</h3>
            <p>{t('privacy.information_str')}</p>
          </div>

          <div className="policy-section">
            <h3>{t('privacy.use_info')}</h3>
            <p>{t('privacy.use_infoStr')}</p>
          </div>

          <div className="policy-section">
            <h3>{t('privacy.sharing')}</h3>
            <p>{t('privacy.sharing_str')}</p>
          </div>

          <div className="policy-section">
            <h3>{t('privacy.security')}</h3>
            <p>{t('privacy.security_str')}</p>
          </div>

          <div className="policy-section">
            <h3>{t('privacy.rights')}</h3>
            <p>{t('privacy.rights_str')}</p>
          </div>
        </div>

        <button
          type="button"
          className="btn-save policy-action"
          onClick={() => navigate(-1)}
        >
          {t('privacy.understand')}
        </button>
      </div>
    </div>
  );
}
