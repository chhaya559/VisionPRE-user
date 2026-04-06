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
  faCircleXmark,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useGetSubscriptionQuery, useCancelSubscriptionMutation } from '../../Services/Api/module/SubscriptionApi';
import { useWallet } from '../../hooks/useWallet';
import { SubscriptionPlan, SubscriptionStatus, SubscriptionBillingCycle } from '../../Shared/SubscriptionEnums';
import Skeleton from '../../Shared/Components/Skeleton/Skeleton';
import './Subscription.scss';

export default function SubscriptionDetails() {
  const { t } = useTranslation('settings');
  const navigate = useNavigate();
  const { account } = useWallet();
  const { data: subscriptionResponse, isLoading } = useGetSubscriptionQuery(undefined);
  const [cancelSubscription, { isLoading: isCancelling }] = useCancelSubscriptionMutation();

  const subscription = subscriptionResponse?.data || subscriptionResponse;

  const handleCancel = async () => {
    if (!account) {
      toast.error(t('subscription.connectWallet'));
      return;
    }

    if (window.confirm(t('subscription.confirmCancel'))) {
      const activeHash = subscription?.transactionHash;

      if (!activeHash) {
        toast.error(t('subscription.noTransactionFound'));
        return;
      }

      try {
        await cancelSubscription({
          TransactionHash: activeHash,
          WalletAddress: account
        }).unwrap();
        toast.success(t('subscription.cancelSuccess'), { position: 'top-right' });
        navigate(-1);
      } catch (err: any) {
        console.error('Cancellation error:', err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="subscription-details-page loading-skeleton">
        <header className="account-settings-header">
          <div className="header-inner">
            <Skeleton variant="text" width="60px" height="24px" />
            <div className="header-copy">
              <Skeleton variant="text" width="200px" height="32px" className="mb-2" />
              <Skeleton variant="text" width="300px" height="16px" />
            </div>
          </div>
        </header>

        <div className="account-settings-content" style={{ padding: '24px' }}>
          <Skeleton variant="rounded" width="100px" height="24px" className="mb-6" />
          <div className="plan-info-header mb-8">
            <Skeleton variant="text" width="150px" height="32px" className="mb-2" />
            <Skeleton variant="text" width="100px" />
          </div>

          <div className="plan-highlight-card mb-8">
            <Skeleton variant="rectangular" height="80px" />
          </div>

          <div className="info-list mb-8">
            <Skeleton variant="rounded" height="60px" className="mb-4" />
            <Skeleton variant="rounded" height="60px" className="mb-4" />
            <Skeleton variant="rounded" height="60px" />
          </div>

          <div className="benefits-section">
            <Skeleton variant="text" width="150px" height="28px" className="mb-6" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <Skeleton variant="rounded" height="70px" />
              <Skeleton variant="rounded" height="70px" />
              <Skeleton variant="rounded" height="70px" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const planName = subscription?.planName === SubscriptionPlan.Pro ? t('subscription.plans.pro') : t('subscription.plans.free');
  const planType = subscription?.billingCycle === SubscriptionBillingCycle.Yearly ? t('subscription.billing.yearly') : t('subscription.billing.monthly');
  const statusLabel = subscription?.status === SubscriptionStatus.Active ? t('subscription.status.active') : t('subscription.status.inactive');
  const isActive = subscription?.status === SubscriptionStatus.Active;
  
  const price = subscription?.price || (subscription?.billingCycle === SubscriptionBillingCycle.Yearly ? '99.00' : '9.99');
  const nextBilling = subscription?.expiryDate ? new Date(subscription.expiryDate).toLocaleDateString() : t('subscription.notAvailable');
  const paymentMethod = subscription?.paymentMethod || t('subscription.wallet');
  const startDate = subscription?.startDate ? new Date(subscription.startDate).toLocaleDateString() : t('subscription.notAvailable');

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
          <div className={`pc-badge ${!isActive ? 'pc-badge--inactive' : ''}`}>
            <FontAwesomeIcon icon={isActive ? faCircleCheck : faCircleXmark} /> {statusLabel}
          </div>

          <div className="plan-info-header">
            <h2>{planName}</h2>
            <p>{planType}</p>
          </div>

          <div className="plan-highlight-card">
            <div className="ph-left">
              <span className="label">{t('subscription.currentPlan')}</span>
              <span className="val">${price}{subscription?.billingCycle === SubscriptionBillingCycle.Yearly ? t('subscription.yearly') : t('subscription.monthly')}</span>
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
                <span className="val">{nextBilling}</span>
              </div>
            </div>
            <div className="info-item">
              <div className="ii-icon">
                <FontAwesomeIcon icon={faCreditCard} />
              </div>
              <div className="ii-text">
                <span className="label">{t('subscription.paymentMethod')}</span>
                <span className="val">{paymentMethod}</span>
              </div>
            </div>
            <div className="info-item">
              <div className="ii-icon">
                <FontAwesomeIcon icon={faCalendarAlt} />
              </div>
              <div className="ii-text">
                <span className="label">{t('subscription.startedOn')}</span>
                <span className="val">{startDate}</span>
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
