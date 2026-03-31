import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Settings.scss';

export default function PrivacyPolicy() {
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
          <h1>Privacy Policy</h1>
          <p>Last updated: March 2024</p>
        </div>
      </header>

      <div className="settings-card">
        <div className="policy-card">
          <h2>Vision PME Privacy Policy</h2>

          <div className="policy-section">
            <h3>{t('information')}</h3>
            <p>{t('information_str')}</p>
          </div>

          <div className="policy-section">
            <h3>{t('use_info')}</h3>
            <p>{t('use_infoStr')}</p>
          </div>

          <div className="policy-section">
            <h3>{t('sharing')}</h3>
            <p>{t('sharing_str')}</p>
          </div>

          <div className="policy-section">
            <h3>{t('security')}</h3>
            <p>{t('security_str')}</p>
          </div>

          <div className="policy-section">
            <h3>{t('rights')}</h3>
            <p>{t('rights_str')}</p>
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
