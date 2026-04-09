import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Settings.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

export default function TermsAndConditions() {
  const navigate = useNavigate();
  const { t } = useTranslation('settings');

  return (
    <div className="edit-profile-container">
      <header className="edit-profile-header secondary">
        <button type="button" className="back-btn" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faChevronLeft} />
          {t('terms.back')}
        </button>
        <div className="header-info">
          <h1>{t('terms.title')}</h1>
          <p>{t('terms.lastUpdated')}</p>
        </div>
      </header>

      <div className="settings-card">
        <div className="policy-card">
          <h2>{t('terms.content')}</h2>

          <div className="policy-section">
            <h3>1. {t('terms.acceptance')}</h3>
            <p>{t('terms.acceptance_str')}</p>
          </div>

          <div className="policy-section">
            <h3>2. {t('terms.license')}</h3>
            <p>{t('terms.license_str')}</p>
          </div>

          <div className="policy-section">
            <h3>3. {t('terms.account')}</h3>
            <p>{t('terms.account_str')}</p>
          </div>

          <div className="policy-section">
            <h3>4. {t('terms.privacy')}</h3>
            <p>{t('terms.privacy_str')}</p>
          </div>

          <div className="policy-section">
            <h3>5. {t('terms.grant')}</h3>
            <p>{t('terms.grant_str')}</p>
          </div>
        </div>

        <button
          type="button"
          className="btn-save policy-action"
          onClick={() => navigate(-1)}
        >
          {t('terms.understand')}
        </button>
      </div>
    </div>
  );
}
