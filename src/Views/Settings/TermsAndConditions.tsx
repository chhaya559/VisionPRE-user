import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Settings.scss';

export default function TermsAndConditions() {
  const navigate = useNavigate();
  const { t } = useTranslation('terms');

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
          Back
        </button>
        <div className="header-info">
          <h1>Terms & Conditions</h1>
          <p>Last updated: March 2024</p>
        </div>
      </header>

      <div className="settings-card">
        <div className="policy-card">
          <h2>Vision PME Terms of Service</h2>

          <div className="policy-section">
            <h3>1. {t('acceptance')}</h3>
            <p>{t('acceptance_str')}</p>
          </div>

          <div className="policy-section">
            <h3>2. {t('license')}</h3>
            <p>{t('license_str')}</p>
          </div>

          <div className="policy-section">
            <h3>3. {t('account')}</h3>
            <p>{t('account_str')}</p>
          </div>

          <div className="policy-section">
            <h3>4. {t('privacy')}</h3>
            <p>{t('privacy_str')}</p>
          </div>

          <div className="policy-section">
            <h3>5. {t('grant')}</h3>
            <p>{t('grant_str')}</p>
          </div>
        </div>

        <button
          className="btn-save"
          onClick={() => navigate(-1)}
          style={{ marginTop: '40px' }}
        >
          I Understand
        </button>
      </div>
    </div>
  );
}
