import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import { useSubscription } from '../../hooks/useSubscription';
import './Subscription.scss';

export default function SubscriptionBanner() {
  const { t } = useTranslation(['settings', 'private']);
  const navigate = useNavigate();
  const { isActive, isLoading, planName, billingCycle, expiryDate } =
    useSubscription();

  if (isLoading) {
    return (
      <div className="sb-skeleton">
        <div className="sk-icon" />
        <div className="sk-content">
          <div className="sk-line sk-line--short" />
          <div className="sk-line sk-line--med" />
          <div className="sk-line sk-line--long" />
        </div>
        <div className="sk-btn" />
      </div>
    );
  }

  if (isActive) {
    const isYearly = billingCycle === 2;
    const planTypeLabel = isYearly
      ? t('subscription.billing.yearly', { ns: 'settings' })
      : t('subscription.billing.monthly', { ns: 'settings' });

    const formattedDate = expiryDate
      ? new Date(expiryDate).toLocaleDateString()
      : t('subscription.notAvailable', { ns: 'settings' });

    return (
      <div className="subscription-banner subscription-banner--active">
        <div className="sb-icon sb-icon--premium">
          <FontAwesomeIcon icon={faCrown} />
        </div>
        <div className="sb-content">
          <div className="sb-premium-label">
            {t('accountSettings.premiumMember', { ns: 'settings' })}
          </div>
          <h4>
            {planName} ({planTypeLabel})
          </h4>
          <p>
            {t('accountSettings.nextBilling', { ns: 'settings' })}:{' '}
            {formattedDate}
          </p>
        </div>
        <button
          type="button"
          className="btn-manage"
          onClick={() => navigate('/dashboard/profile/settings/subscription')}
        >
          {t('accountSettings.manageSubscription', { ns: 'settings' })}
        </button>
      </div>
    );
  }

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
