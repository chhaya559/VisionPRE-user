import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
import { SubscriptionPlan, SubscriptionBillingCycle } from '../../Shared/SubscriptionEnums';
import { toast } from 'react-toastify';
import Skeleton from '../../Shared/Components/Skeleton/Skeleton';
import './SubscriptionPlans.scss';

const FEATURE_ICONS = [faCheck, faBolt, faUsers, faBell, faEyeSlash];

export default function SubscriptionPlans() {
  const navigate = useNavigate();
  const { t } = useTranslation('settings');
  const { account, chainId, connectWallet, getContract, getTokenContract } = useWalletContext();
  const { data: plansResponse, isLoading, error } = useGetPlansQuery(undefined);
  const [subscribeMutation, { isLoading: isSubscribing }] = useSubscribeMutation();
  const plans = plansResponse?.data?.items || plansResponse?.data || [];

  const handleSubscribe = async (planId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Current Chain ID:', chainId);

    if (chainId && chainId !== '0x89' && chainId !== '0x13882' && chainId !== '0x1') {
      toast.warning(t('subscription.wrongNetwork'));
    }

    if (!account) {
      if (window.confirm(t('subscription.connectWalletPrompt'))) {
        await connectWallet();
      }
      return;
    }

    const { ethereum } = window as any;
    if (!ethereum) {
      toast.error(t('subscription.noWallet'));
      return;
    }

    try {
      // 1. Get Contract
      const contract = await getContract();
      if (!contract) {
        toast.error(t('subscription.contractError'));
        return;
      }

      // 2. Execute Blockchain Transaction
      const selectedPlan = plans.find((p: any) => p.id === planId || p.Id === planId);
      const priceValue = selectedPlan?.price || (planId === SubscriptionPlan.Pro ? '19.99' : '0');
      const isYearly = selectedPlan?.billingCycle === SubscriptionBillingCycle.Yearly || selectedPlan?.name?.toLowerCase().includes('year');

      // Network-specific USDC Addresses
      const USDC_MAP: Record<string, string> = {
        '0x1': '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // Ethereum Mainnet
        '0x89': '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', // Polygon Mainnet (Native)
        '0x13881': '0x073B9E81ec8386B9d702Ae10C000DDA7A73A0b3a', // Mumbai Testnet
        '0x13882': '0x073B9E81ec8386B9d702Ae10C000DDA7A73A0b3a', // Amoy Testnet
        '0xaa36a7': '0x073B9E81ec8386B9d702Ae10C000DDA7A73A0b3a', // Sepolia Testnet
      };

      const USDC_ADDRESS = USDC_MAP[chainId || ''] || '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359';
      console.log('Using USDC Address:', USDC_ADDRESS, 'for Chain ID:', chainId);
      
      const tokenContract = await getTokenContract(USDC_ADDRESS);

      if (!tokenContract) {
        toast.error(t('subscription.errors.contractError'));
        return;
      }

      const amountInUnits = ethers.parseUnits(priceValue.toString(), 6);
      const contractAddress = await contract.getAddress();

      // Step 1: Check Allowance
      toast.info(t('subscription.checkingAllowance'));
      const allowance = await tokenContract.allowance(account, contractAddress);

      if (allowance < amountInUnits) {
        toast.info(t('subscription.approving'));
        const approveTx = await tokenContract.approve(contractAddress, amountInUnits);
        await approveTx.wait();
        toast.success(t('subscription.approved'));
      }

      // Step 2: Subscribe
      toast.info(t('subscription.confirmInWallet'));
      const tx = await contract.subscribe(planId);

      toast.info(t('subscription.processingTx'));
      const receipt = await tx.wait();
      const realHash = receipt.hash || tx.hash;

      // 3. Sync with Backend
      const response = await subscribeMutation({
        Plan: Number(planId),
        BillingCycle: isYearly ? SubscriptionBillingCycle.Yearly : SubscriptionBillingCycle.Monthly,
        AutoPayEnabled: true,
        TransactionHash: realHash,
        WalletAddress: account || '',
        ExpiresAt: new Date(Date.now() + (isYearly ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
      }).unwrap();

      if (response.success) {
        localStorage.setItem('active_subscription_hash', realHash);
        toast.success(response.message || t('subscription.success'));
        navigate('/dashboard/profile/settings');
      }
    } catch (err: any) {
      console.error('Subscription error:', err);
      const errorMsg = err?.reason || err?.message || t('subscription.errorOccurred');
      toast.error(errorMsg);
    }
  };

  if (isLoading) {
    return (
      <div className="sp-page loading-skeleton">
        {/* ── Hero Skeleton ── */}
        <header className="sp-hero">
          <div className="sp-hero__bg-shape" />
          <div className="sp-hero__crown">
            <Skeleton variant="circular" width="48px" height="48px" />
          </div>
          <Skeleton variant="text" width="300px" height="48px" className="mb-4" />
          <Skeleton variant="text" width="400px" height="24px" />
        </header>

        <div className="sp-content" style={{ padding: '40px 20px' }}>
          {/* Features Skeleton */}
          <section className="sp-features">
            <Skeleton variant="text" width="150px" height="24px" className="mb-6" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="75%" />
              <Skeleton variant="text" width="70%" />
            </div>
          </section>

          {/* Plans Skeleton */}
          <section className="sp-plans" style={{ marginTop: '40px' }}>
            <Skeleton variant="text" width="150px" height="24px" className="mb-6" />
            <div className="sp-plans__grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              <div className="sp-plan-card" style={{ padding: '32px' }}>
                <Skeleton variant="text" width="60px" height="24px" className="mb-4" />
                <Skeleton variant="text" width="120px" height="48px" className="mb-6" />
                <div style={{ gap: '12px', display: 'flex', flexDirection: 'column' }}>
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="text" width="100%" />
                </div>
                <Skeleton variant="rounded" width="100%" height="48px" style={{ marginTop: '32px' }} />
              </div>
              <div className="sp-plan-card" style={{ padding: '32px' }}>
                <Skeleton variant="text" width="60px" height="24px" className="mb-4" />
                <Skeleton variant="text" width="120px" height="48px" className="mb-6" />
                <div style={{ gap: '12px', display: 'flex', flexDirection: 'column' }}>
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="text" width="100%" />
                </div>
                <Skeleton variant="rounded" width="100%" height="48px" style={{ marginTop: '32px' }} />
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sp-page">
        <div className="sp-feedback sp-feedback--error">
          <p>{t('subscriptionPlans.error')}</p>
        </div>
      </div>
    );
  }

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
        <h1 className="sp-hero__title">{t('subscriptionPlans.title')}</h1>
        <p className="sp-hero__sub">{t('subscriptionPlans.subtitle')}</p>

        <div className="sp-trial-chip">
          <span className="sp-trial-chip__dot" />
          {t('subscriptionPlans.trialTitle')}
        </div>
      </header>

      {/* ── Content ── */}
      <div className="sp-content">

        {/* Features */}
        <section className="sp-features">
          <p className="sp-section-label">{t('subscriptionPlans.whatsIncluded')}</p>
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
          <p className="sp-section-label">{t('subscriptionPlans.choosePlan')}</p>
          <div className="sp-plans__grid">
            {plans.map((plan: any) => {
              const id = plan.id ?? plan.Id;
              const isYearly =
                plan.billingCycle === SubscriptionBillingCycle.Yearly || plan.name?.toLowerCase().includes('year');
              const price = plan.price ?? 0;
              const monthlyEquiv = isYearly ? (price / 12).toFixed(2) : null;

              return (
                <div
                  key={id}
                  className={`sp-plan-card ${isYearly ? 'sp-plan-card--featured' : ''}`}
                >
                  {isYearly && (
                    <div className="sp-plan-card__badge">
                      {t('subscriptionPlans.mostPopular')}
                    </div>
                  )}

                  <div className="sp-plan-card__head">
                    <div className="sp-plan-card__cycle">
                      {isYearly
                        ? t('subscriptionPlans.annual')
                        : t('subscriptionPlans.monthly')}
                    </div>
                    <div className="sp-plan-card__price-row">
                      <span className="sp-plan-card__currency">$</span>
                      <span className="sp-plan-card__amount">{price}</span>
                      <span className="sp-plan-card__period">
                        {isYearly
                          ? t('subscriptionPlans.perYearSuffix')
                          : t('subscriptionPlans.perMonthSuffix')}
                      </span>
                      {isYearly && (
                        <span className="sp-plan-card__save">
                          {t('subscriptionPlans.save30')}
                        </span>
                      )}
                    </div>
                    {monthlyEquiv && (
                      <p className="sp-plan-card__hint">
                        ${monthlyEquiv}
                        {t('subscriptionPlans.perMonthSuffix')} &mdash; billed annually
                      </p>
                    )}
                  </div>

                  <ul className="sp-plan-card__perks">
                    <li>
                      <FontAwesomeIcon icon={faShield} />
                      {t('subscriptionPlans.trialFooter')}
                    </li>
                    <li>
                      <FontAwesomeIcon icon={faCheck} />
                      {isYearly
                        ? t('subscriptionPlans.billedAnnually')
                        : t('subscriptionPlans.monthlyPlan')}
                    </li>
                    <li>
                      <FontAwesomeIcon icon={faCheck} />
                      {t('subscriptionPlans.cancelAnytime')}
                    </li>
                  </ul>

                  <button
                    className="sp-plan-card__btn"
                    disabled={isSubscribing}
                    onClick={(e) => handleSubscribe(id, e)}
                  >
                    {isSubscribing
                      ? t('accountSettings.updating')
                      : t('subscriptionPlans.subscribe')}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer note */}
        <p className="sp-footer-note">
          <FontAwesomeIcon icon={faShield} />
          {t('subscriptionPlans.securePayment')}
        </p>
      </div>
    </div>
  );
}