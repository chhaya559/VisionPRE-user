import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ethers } from 'ethers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faCrown,
  faCheck,
  faShield,
  faBolt,
  faUsers,
  faBell,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import { useGetPlansQuery, useSubscribeMutation } from '../../Services/Api/module/SubscriptionApi';
import { useWalletContext } from '../../Context/WalletContext';
import { toast } from 'react-toastify';
import './SubscriptionPlans.scss';

const FEATURE_ICONS = [faCheck, faBolt, faUsers, faBell, faEyeSlash];

export default function SubscriptionPlans() {
  const navigate = useNavigate();
  const { t } = useTranslation('settings');
  const { account, connectWallet } = useWalletContext();
  const { data: plansResponse, isLoading, error } = useGetPlansQuery(undefined);
  const [subscribeMutation, { isLoading: isSubscribing }] = useSubscribeMutation();

  const handleSubscribe = async (planId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!account) {
      if (window.confirm(t('subscription.connectWalletPrompt', 'Please connect your wallet to continue. Connect now?'))) {
        await connectWallet();
      }
      return;
    }

    const { ethereum } = window as any;
    if (!ethereum) {
      toast.error(t('subscription.noWallet', 'MetaMask is not installed.'));
      return;
    }

    try {
      // 1. Get Contract & Signer
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();

      // Define partial ABI for the subscribe function
      // Assuming: function subscribe(uint256 planId) external payable
      const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
      const subscribeAbi = ["function subscribe(uint256 planId) external payable"];
      const contract = new ethers.Contract(contractAddress, subscribeAbi, signer);

      // 2. Execute Blockchain Transaction
      toast.info(t('subscription.confirmInWallet', 'Please confirm the transaction in your wallet...'));

      // Get the plan price from the plans list to send as value if needed
      const selectedPlan = plans.find((p: any) => (p.id ?? p.Id) === planId);
      const price = selectedPlan?.price || 0;

      // For now, calling with 0 value unless specified otherwise.
      // If the contract expects payment, use: { value: ethers.parseEther(String(price)) }
      console.log('Selected plan price:', price);
      const tx = await contract.subscribe(planId);

      toast.info(t('subscription.processingTx', 'Transaction processing...'));
      const receipt = await tx.wait();
      const realHash = receipt.hash;

      // 3. Sync with Backend
      const response = await subscribeMutation({
        Plan: String(planId),
        BillingCycle: 1,
        AutoPayEnabled: true,
        TransactionHash: realHash,
        WalletAddress: account,
        ExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      }).unwrap();

      if (response.success) {
        localStorage.setItem('active_subscription_hash', realHash);
        toast.success(response.message || t('subscription.success', 'Subscribed successfully!'));
        navigate('/dashboard/profile/settings');
      }
    } catch (err: any) {
      console.error('Subscription error:', err);
      const errorMsg = err?.reason || err?.message || t('subscription.errorOccurred', 'An error occurred during subscription.');
      toast.error(errorMsg);
    }
  };

  if (isLoading) {
    return (
      <div className="sp-page">
        <div className="sp-feedback">
          <div className="sp-spinner" />
          <p>{t('subscriptionPlans.loading', 'Loading plans...')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sp-page">
        <div className="sp-feedback sp-feedback--error">
          <p>{t('subscriptionPlans.error', 'Failed to load plans. Please try again.')}</p>
        </div>
      </div>
    );
  }

  const plans = plansResponse?.data?.items || plansResponse?.data || [];
  const featureKeys = ['feature1', 'feature2', 'feature3', 'feature4', 'feature5'];
  const featureDefaults = [
    'Unlimited grant applications',
    'Priority event registration',
    'Exclusive networking opportunities',
    'Early access to announcements',
    'Ad-free experience',
  ];

  return (
    <div className="sp-page">
      {/* ── Hero ── */}
      <header className="sp-hero">
        <div className="sp-hero__bg-shape" />
        <button className="sp-hero__close" onClick={() => navigate(-1)} aria-label="Close">
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <div className="sp-hero__crown">
          <FontAwesomeIcon icon={faCrown} />
        </div>
        <h1 className="sp-hero__title">{t('subscriptionPlans.title', 'Vision PME Passeport')}</h1>
        <p className="sp-hero__sub">{t('subscriptionPlans.subtitle', 'Unlock all features and opportunities')}</p>

        <div className="sp-trial-chip">
          <span className="sp-trial-chip__dot" />
          {t('subscriptionPlans.trialTitle', '7-day free trial — no commitment')}
        </div>
      </header>

      {/* ── Content ── */}
      <div className="sp-content">

        {/* Features */}
        <section className="sp-features">
          <p className="sp-section-label">{t('subscriptionPlans.whatsIncluded', "What's included")}</p>
          <ul className="sp-features__list">
            {featureKeys.map((key, i) => (
              <li key={key} className="sp-features__item">
                <span className="sp-features__icon">
                  <FontAwesomeIcon icon={FEATURE_ICONS[i]} />
                </span>
                <span>{t(`subscriptionPlans.${key}`, featureDefaults[i])}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Plans */}
        <section className="sp-plans">
          <p className="sp-section-label">{t('subscriptionPlans.choosePlan', 'Choose your plan')}</p>
          <div className="sp-plans__grid">
            {plans.map((plan: any) => {
              const id = plan.id ?? plan.Id;
              const isYearly =
                plan.billingCycle === 1 || plan.name?.toLowerCase().includes('year');
              const price = plan.price ?? 0;
              const monthlyEquiv = isYearly ? (price / 12).toFixed(2) : null;

              return (
                <div
                  key={id}
                  className={`sp-plan-card ${isYearly ? 'sp-plan-card--featured' : ''}`}
                >
                  {isYearly && (
                    <div className="sp-plan-card__badge">
                      {t('subscriptionPlans.mostPopular', 'Most popular')}
                    </div>
                  )}

                  <div className="sp-plan-card__head">
                    <div className="sp-plan-card__cycle">
                      {isYearly
                        ? t('subscriptionPlans.annual', 'Annual')
                        : t('subscriptionPlans.monthly', 'Monthly')}
                    </div>
                    <div className="sp-plan-card__price-row">
                      <span className="sp-plan-card__currency">$</span>
                      <span className="sp-plan-card__amount">{price}</span>
                      <span className="sp-plan-card__period">
                        {isYearly
                          ? t('subscriptionPlans.perYearSuffix', '/yr')
                          : t('subscriptionPlans.perMonthSuffix', '/mo')}
                      </span>
                      {isYearly && (
                        <span className="sp-plan-card__save">
                          {t('subscriptionPlans.save30', 'Save 30%')}
                        </span>
                      )}
                    </div>
                    {monthlyEquiv && (
                      <p className="sp-plan-card__hint">
                        ${monthlyEquiv}
                        {t('subscriptionPlans.perMonthSuffix', '/mo')} &mdash; billed annually
                      </p>
                    )}
                  </div>

                  <ul className="sp-plan-card__perks">
                    <li>
                      <FontAwesomeIcon icon={faShield} />
                      {t('subscriptionPlans.trialFooter', '7-day free trial')}
                    </li>
                    <li>
                      <FontAwesomeIcon icon={faCheck} />
                      {isYearly
                        ? t('subscriptionPlans.billedAnnually', 'Billed annually')
                        : t('subscriptionPlans.monthlyPlan', 'Billed monthly')}
                    </li>
                    <li>
                      <FontAwesomeIcon icon={faCheck} />
                      {t('subscriptionPlans.cancelAnytime', 'Cancel anytime')}
                    </li>
                  </ul>

                  <button
                    className="sp-plan-card__btn"
                    disabled={isSubscribing}
                    onClick={(e) => handleSubscribe(id, e)}
                  >
                    {isSubscribing
                      ? t('accountSettings.updating', 'Processing...')
                      : t('subscriptionPlans.subscribe', 'Subscribe')}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer note */}
        <p className="sp-footer-note">
          <FontAwesomeIcon icon={faShield} />
          {t('subscriptionPlans.securePayment', 'Payments secured via MetaMask · Wallet linked to your account')}
        </p>
      </div>
    </div>
  );
}