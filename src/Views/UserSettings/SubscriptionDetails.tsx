import { useState } from 'react';
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
import {
  useGetSubscriptionQuery,
  useCancelSubscriptionMutation,
} from '../../Services/Api/module/SubscriptionApi';

import { useWalletContext } from '../../Context/WalletContext';
import { mapWeb3Error } from '../../Shared/Web3Utils';
import Modal from '../../Shared/Components/Modal';
import Skeleton from '../../Shared/Components/Skeleton/Skeleton';
import './Subscription.scss';

export default function SubscriptionDetails() {
  const { t } = useTranslation('settings');
  const navigate = useNavigate();
  const { account, getContract } = useWalletContext();
  const { data: subscriptionResponse, isLoading } =
    useGetSubscriptionQuery(undefined);
  const [cancelSubscription, { isLoading: isCancelling }] =
    useCancelSubscriptionMutation();

  const subscription = subscriptionResponse?.data || subscriptionResponse;

  const [showModal, setShowModal] = useState(false);

  const performCancellation = async () => {
    setShowModal(false);
    try {
      // 1. Get Contract from WalletContext
      const contract = await getContract();
      if (!contract) {
        toast.error(t('subscription.contractError'));
        return;
      }

      // 2. Call Blockchain
      toast.info(t('subscription.confirmCancelInWallet'));
      const tx = await contract.cancelSubscription();
      toast.info(t('subscription.processingTx'));
      const receipt = await tx.wait();
      const txHash = receipt.hash || tx.hash;

      // 3. Sync with Backend
      await cancelSubscription({
        transactionHash: txHash,
        walletAddress: account || '',
      }).unwrap();

      toast.success(t('subscription.cancelSuccess'));
      navigate(-1);
    } catch (err: unknown) {
      // eslint-disable-next-line no-console
      console.error('Cancellation error:', err);
      const errorMsg = mapWeb3Error(err as { code?: number; message?: string });
      toast.error(errorMsg);
    }
  };

  const handleCancel = () => {
    if (!account) {
      toast.error(t('subscription.connectWallet'));
      return;
    }
    setShowModal(true);
  };

  if (isLoading) {
    return (
      <div className="subscription-details-page loading-state">
        <header className="account-settings-header">
          <div className="header-inner">
            <div className="header-copy">
              <Skeleton variant="text" width={200} height={32} />
              <Skeleton variant="text" width={300} height={20} />
            </div>
          </div>
        </header>

        <div className="account-settings-content">
          <div className="account-settings-main">
            <Skeleton
              variant="rect"
              width={100}
              height={24}
              borderRadius={12}
            />
            <Skeleton variant="text" width="50%" height={40} />
            <Skeleton
              variant="rect"
              width="100%"
              height={80}
              borderRadius={16}
            />
            <div className="info-list">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="rect" width="100%" height={60} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const planName =
    subscription?.subscriptionPlan || t('subscription.plans.free');
  const isYearly = subscription?.billingCycle === 2;
  const planType = isYearly
    ? t('subscription.billing.yearly')
    : t('subscription.billing.monthly');
  const statusLabel =
    subscription?.subscriptionStatus || t('subscription.status.inactive');
  const isActive = subscription?.subscriptionStatus === 'Active';

  const price = subscription?.price?.toFixed(2) || '0.00';
  const nextBilling = subscription?.expiryDate
    ? new Date(subscription.expiryDate).toLocaleDateString()
    : t('subscription.notAvailable');
  const paymentMethod = subscription?.paymentMethod || t('subscription.wallet');
  const startDate = subscription?.startDate
    ? new Date(subscription.startDate).toLocaleDateString()
    : t('subscription.notAvailable');

  return (
    <div className="subscription-details-page">
      <header className="account-settings-header">
        <div className="header-inner">
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate(-1)}
          >
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
            <FontAwesomeIcon icon={isActive ? faCircleCheck : faCircleXmark} />{' '}
            {statusLabel}
          </div>

          <div className="plan-info-header">
            <h2>{planName}</h2>
            <p>{planType}</p>
          </div>

          <div className="plan-highlight-card">
            <div className="ph-left">
              <span className="label">{t('subscription.currentPlan')}</span>
              <span className="val">
                ${price}
                {isYearly
                  ? t('subscription.yearly')
                  : t('subscription.monthly')}
              </span>
            </div>
            <div className="ph-right">{t('subscription.savings')}</div>
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
            {subscription?.startDate && (
              <div className="info-item">
                <div className="ii-icon">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                </div>
                <div className="ii-text">
                  <span className="label">{t('subscription.startedOn')}</span>
                  <span className="val">{startDate}</span>
                </div>
              </div>
            )}
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

          {subscription?.isCancelled ? (
            <div className="cancel-notice cancelled-state">
              <FontAwesomeIcon icon={faTriangleExclamation} />
              <div className="cn-text">
                <h5>{t('subscription.subscriptionCanceled')}</h5>
                <p>
                  {t('subscription.cancelledNotice', { date: nextBilling })}
                </p>
                <p className="repurchase-note">
                  {t('subscription.repurchaseNotice')}
                </p>
              </div>
            </div>
          ) : (
            <div className="cancel-notice">
              <FontAwesomeIcon icon={faTriangleExclamation} />
              <div className="cn-text">
                <h5>{t('subscription.thinkingCancel')}</h5>
                <p>{t('subscription.loseAccess')}</p>
              </div>
            </div>
          )}

          <button
            type="button"
            className={`btn-cancel-membership ${
              subscription?.isCancelled ? 'btn-disabled-faded' : ''
            }`}
            onClick={handleCancel}
            disabled={isCancelling || subscription?.isCancelled}
          >
            {isCancelling
              ? t('subscription.cancelling')
              : subscription?.isCancelled
              ? t('subscription.subscriptionCanceled')
              : t('subscription.cancelMembership')}
          </button>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={t('subscription.thinkingCancel')}
        showFooter={false}
      >
        <div className="confirmation-modal">
          <div className="cm-icon">
            <FontAwesomeIcon icon={faTriangleExclamation} />
          </div>
          <p className="cm-text">{t('subscription.confirmCancel')}</p>
          <div className="cm-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setShowModal(false)}
            >
              {t('deleteAccount.cancel')}
            </button>
            <button
              type="button"
              className="btn-confirm"
              onClick={performCancellation}
              disabled={isCancelling}
            >
              {isCancelling
                ? t('subscription.cancelling')
                : t('subscription.cancelMembership')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
