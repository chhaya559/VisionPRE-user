import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faCircleCheck,
  faCalendarAlt,
  faCreditCard,
  faTrophy,
  faBolt,
  faBellSlash,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useGetSubscriptionQuery, useCancelSubscriptionMutation } from '../../Services/Api/module/SubscriptionApi';
import { useWallet } from '../../hooks/useWallet';
import './Subscription.scss';

export default function SubscriptionDetails() {
  const { t } = useTranslation('settings');
  const navigate = useNavigate();
  const { account } = useWallet();
  const { data: subscription, isLoading } = useGetSubscriptionQuery(undefined);
  const [cancelSubscription, { isLoading: isCancelling }] = useCancelSubscriptionMutation();

  const handleCancel = async () => {
    if (!account) {
      alert(t('subscription.connectWallet'));
      return;
    }

    if (window.confirm(t('subscription.confirmCancel'))) {
      const activeHash = subscription?.transactionHash || localStorage.getItem('active_subscription_hash') || ('0x' + 'f'.repeat(64));

      try {
        await cancelSubscription({
          TransactionHash: activeHash,
          WalletAddress: account
        }).unwrap();
        toast.success(t('subscription.cancelSuccess'), { position: 'top-right' });
        navigate(-1);
      } catch (err: any) {
        console.error('Cancellation error:', err);
        toast.error(t('subscription.cancelError'), { position: 'top-right' });
      }
    }
  };

  if (isLoading) {
    return <div className="loading">{t('subscription.loading')}</div>;
  }

  return (
    <div className="subscription-details-page">
      <header className="account-settings-header">
        <div className="header-inner">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faChevronLeft} />
            {t('accountSettings.back')}
          </button>
          <div className="header-copy">
            <h1>{t('subscription.subTitle')}</h1>
            <p>{t('subscription.subDescription')}</p>
          </div>
        </div>
      </header>

      <div className="account-settings-content">
        <div className="account-settings-main">
          <div className="pc-badge">
            <FontAwesomeIcon icon={faCircleCheck} /> {t('subscription.active')}
          </div>

          <div className="plan-info-header">
            <h2>{subscription?.planName || 'Vision PME Passeport'}</h2>
            <p>{subscription?.planType || 'Annual Subscription'}</p>
          </div>

          <div className="plan-highlight-card">
            <div className="ph-left">
              <span className="label">{t('subscription.currentPlan')}</span>
              <span className="val">${subscription?.price || '150.00'}{t('subscription.yearly')}</span>
            </div>
            <div className="ph-right">
              {t('subscription.savings')}
            </div>
          </div>

          <div className="info-list">
            <div className="info-item">
              <div className="ii-icon">
                <FontAwesomeIcon icon={faCalendarAlt} />
              </div>
              <div className="ii-text">
                <span className="label">{t('subscription.nextBilling')}</span>
                <span className="val">{subscription?.nextBilling || 'February 28, 2025'}</span>
              </div>
            </div>
            <div className="info-item">
              <div className="ii-icon">
                <FontAwesomeIcon icon={faCreditCard} />
              </div>
              <div className="ii-text">
                <span className="label">{t('subscription.paymentMethod')}</span>
                <span className="val">{subscription?.paymentMethod || 'Visa **** 4242'}</span>
              </div>
            </div>
            <div className="info-item">
              <div className="ii-icon">
                <FontAwesomeIcon icon={faCalendarAlt} />
              </div>
              <div className="ii-text">
                <span className="label">{t('subscription.startedOn')}</span>
                <span className="val">{subscription?.startDate || 'February 28, 2024'}</span>
              </div>
            </div>
          </div>

          <div className="benefits-section">
            <h3>{t('subscription.benefits')}</h3>
            <div className="benefits-list">
              <div className="benefit-item">
                <div className="bi-icon">
                  <FontAwesomeIcon icon={faTrophy} />
                </div>
                <div className="bi-text">
                  <h5>{t('subscription.unlimitedApps')}</h5>
                  <p>{t('subscription.unlimitedAppsDesc')}</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="bi-icon">
                  <FontAwesomeIcon icon={faBolt} />
                </div>
                <div className="bi-text">
                  <h5>{t('subscription.priorityAccess')}</h5>
                  <p>{t('subscription.priorityAccessDesc')}</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="bi-icon">
                  <FontAwesomeIcon icon={faBellSlash} />
                </div>
                <div className="bi-text">
                  <h5>{t('subscription.adFree')}</h5>
                  <p>{t('subscription.adFreeDesc')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="cancel-notice">
            <FontAwesomeIcon icon={faTriangleExclamation} />
            <div className="cn-text">
              <h5>{t('subscription.thinkingCancel')}</h5>
              <p>{t('subscription.loseAccess')}</p>
            </div>
          </div>

          <button
            className="btn-cancel-membership"
            onClick={handleCancel}
            disabled={isCancelling}
          >
            {isCancelling ? t('subscription.cancelling') : t('subscription.cancelMembership')}
          </button>
        </div>
      </div>
    </div>
  );
}
