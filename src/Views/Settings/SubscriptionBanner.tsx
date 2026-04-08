import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import './Subscription.scss';

export default function SubscriptionBanner() {
  const { t } = useTranslation('settings');
  const navigate = useNavigate();
  return (
    <div className="subscription-banner">
      <div className="sb-icon">
        <FontAwesomeIcon icon={faCrown} />
      </div>
      <div className="sb-content">
        <h4>{t('subscriptionBanner.title')}</h4>
        <p>{t('subscriptionBanner.description')}</p>
      </div>
      <button
        type="button"
        className="btn-subscribe"
        onClick={() => navigate('/dashboard/profile/settings/plans')}
      >
        {t('subscriptionBanner.button')}
      </button>
    </div>
  );
}
