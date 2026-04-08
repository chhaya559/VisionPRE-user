import { useNavigate } from 'react-router-dom';
import './IntroSteps.scss';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket } from '@fortawesome/free-solid-svg-icons';

export default function AlmostReady() {
  const navigate = useNavigate();
  const { t } = useTranslation('profile');

  return (
    <div className="intro-step">
      <div className="rocket-icon-wrapper">
        <FontAwesomeIcon icon={faRocket} className="rocket-icon-fa" />
      </div>

      <h1>{t('ready_title')}</h1>
      <p className="subtitle">{t('ready_subtitle')}</p>

      <div className="stats-grid">
        <div className="stat-card large">
          <h2>{t('ready_grant_price')}</h2>
          <p>{t('ready_grant_price2')}</p>
        </div>

        <div className="stat-card large">
          <h2>{t('ready_grants_str')}</h2>
          <p>{t('ready_grants_str2')}</p>
        </div>
      </div>

      <button
        type="button"
        className="btn-continue"
        onClick={() => navigate('/setup/name')}
      >
        {t('continue')}
      </button>
    </div>
  );
}
