import { ethers } from 'ethers';
import { useState } from 'react';
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
import { toast } from 'react-toastify';
import {
  useGetPlansQuery,
  useSubscribeMutation,
  useGetSubscriptionQuery,
} from '../../Services/Api/module/SubscriptionApi';
import { useWalletContext } from '../../Context/WalletContext';
import { Plan } from '../../Shared/Types';

import WalletConnectModal from '../../Shared/Components/WalletConnectModal/WalletConnectModal';
import { mapWeb3Error } from '../../Shared/Web3Utils';
import Skeleton from '../../Shared/Components/Skeleton/Skeleton';
import './SubscriptionPlans.scss';

const FEATURE_ICONS = [faCheck, faBolt, faUsers, faBell, faEyeSlash];

export default function SubscriptionPlans() {
  const navigate = useNavigate();
  const { t } = useTranslation('settings');
  const {
    account,
    chainId,
    connectWallet,
    switchChain,
    getContract,
    getTokenContract,
  } = useWalletContext();
  const { data: plansResponse, isLoading, error } = useGetPlansQuery(undefined);
  const { refetch: refetchSubscription } = useGetSubscriptionQuery(undefined);
  const [subscribeMutation] = useSubscribeMutation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStatus, setProcessStatus] = useState('');
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const plans = plansResponse?.data?.items || plansResponse?.data || [];

  const handleSubscribe = async (planId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (
      chainId &&
      chainId !== '0xaa36a7' &&
      chainId !== '0x1' &&
      chainId !== '0x13881' &&
      chainId !== '0x13882'
    ) {
      toast.warning(t('subscription.wrongNetwork'));
      try {
        await switchChain('0x13882'); // Try Amoy by default if on wrong network
      } catch (err: unknown) {
        // eslint-disable-next-line no-console
      }
      return; // BLOCK execution
    }

    if (!account) {
      setIsWalletModalOpen(true);
      return;
    }

    const { ethereum } = window as { ethereum?: unknown };
    if (!ethereum) {
      toast.error(t('subscription.noWallet'));
      return;
    }

    try {
      // 1. Get Contract
      setIsProcessing(true);
      setProcessStatus(t('subscription.processing.initializing'));
      const contract = await getContract();
      if (!contract) {
        toast.error(t('subscription.contractError'));
        setIsProcessing(false);
        return;
      }

      // 2. Map UUID to Numeric ID for Smart Contract
      const selectedPlan = plans.find((p: Plan) => p.id === planId);

      // Determine the numeric ID the contract expects (1 for Free, 2 for Pro)
      const numericPlanId = selectedPlan?.planCode || 2; // Default to Pro if not specified

      const priceValue =
        selectedPlan?.price || (numericPlanId === 2 ? '19.99' : '0');

      // Network-specific USDC Addresses
      const USDC_MAP: Record<string, string> = {
        '0xaa36a7': '0x274c6821487A5C2A64969037a8ae5256822BdD4D', // Updated to sUSD for Sepolia
        '0x1': '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // Ethereum Mainnet
        '0x89': '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', // Polygon Mainnet (Native)
        '0x13881': '0x274c6821487A5C2A64969037a8ae5256822BdD4D', // Updated to sUSD for Mumbai
        '0x13882': '0x274c6821487A5C2A64969037a8ae5256822BdD4D', // Updated to sUSD for Amoy
      };

      const USDC_ADDRESS =
        USDC_MAP[chainId || ''] || '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359';
      setProcessStatus(t('subscription.processing.checkingToken'));
      const tokenContract = await getTokenContract(USDC_ADDRESS);

      if (!tokenContract) {
        toast.error(t('subscription.errors.contractError'));
        setIsProcessing(false);
        return;
      }

      const decimals = await tokenContract.decimals();
      const amountInUnits = ethers.parseUnits(priceValue.toString(), decimals);
      const contractAddress = await contract.getAddress();

      // Step 0: Information Logging (No blocking)
      const balance = await tokenContract.balanceOf(account);

      if (balance < amountInUnits) {
        const errorMsg = `Insufficient balance. Required: ${ethers.formatUnits(
          amountInUnits,
          decimals
        )} sUSD, Available: ${ethers.formatUnits(balance, decimals)} sUSD`;
        console.error(errorMsg);
        toast.error(errorMsg);
        setIsProcessing(false);
        return;
      }

      // Step 1: Check Allowance
      const allowance = await tokenContract.allowance(account, contractAddress);

      if (allowance < amountInUnits) {
        setProcessStatus(t('subscription.processing.approving'));
        const approveTx = await tokenContract.approve(
          contractAddress,
          ethers.MaxUint256
        );
        await approveTx.wait();

        // Add a small delay to ensure MetaMask is ready for the next popup
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Step 2: Subscribe
      setProcessStatus(t('subscription.processing.confirming'));
      const tx = await contract.subscribe(planId);

      setProcessStatus(t('subscription.processing.processing'));
      const receipt = await tx.wait();
      const realHash = receipt.hash || tx.hash;

      // 3. Sync with Backend
      setProcessStatus(t('subscription.processing.syncing'));
      const response = await subscribeMutation({
        planId,
        autoPayEnabled: true,
        transactionHash: realHash,
        walletAddress: account || '',
      }).unwrap();

      if (response.success) {
        localStorage.setItem('active_subscription_hash', realHash);
        await refetchSubscription();
        toast.success(response.message || t('subscription.success'));
        setIsProcessing(false);
        navigate('/dashboard/profile/settings');
      } else {
        toast.error(
          response.message || 'Backend sync failed. Please contact support.'
        );
        setIsProcessing(false);
      }
    } catch (err: unknown) {
      setIsProcessing(false);
      // eslint-disable-next-line no-console

      const errorMsg = mapWeb3Error(err as { code?: number; message?: string });
      toast.error(errorMsg);
    }
  };

  if (isLoading) {
    return (
      <div className="sp-page loading-state">
        <header className="sp-hero">
          <div className="sp-hero__bg-shape" />
          <Skeleton
            variant="text"
            width={200}
            height={32}
            className="sp-hero__title"
          />
          <Skeleton variant="text" width={300} height={20} />
        </header>

        <div className="sp-content">
          <section className="sp-features">
            <Skeleton variant="text" width={150} height={20} />
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="text" width="100%" height={30} />
            ))}
          </section>

          <section className="sp-plans">
            <Skeleton variant="text" width={150} height={20} />
            <div className="sp-plans__grid">
              {[1, 2].map((i) => (
                <Skeleton
                  key={i}
                  variant="rect"
                  width="100%"
                  height={300}
                  borderRadius={24}
                />
              ))}
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

  const featureKeys = [
    'feature1',
    'feature2',
    'feature3',
    'feature4',
    'feature5',
  ];
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
        <button
          className="sp-hero__close"
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Close"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <div className="sp-hero__crown">
          <FontAwesomeIcon icon={faCrown} />
        </div>
        <h1 className="sp-hero__title">{t('subscriptionPlans.title')}</h1>
        <p className="sp-hero__sub">{t('subscriptionPlans.subtitle')}</p>
      </header>

      {/* ── Content ── */}
      <div className="sp-content">
        {/* Features */}
        <section className="sp-features">
          <p className="sp-section-label">
            {t('subscriptionPlans.whatsIncluded')}
          </p>
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
          <p className="sp-section-label">
            {t('subscriptionPlans.choosePlan')}
          </p>
          <div className="sp-plans__grid">
            {plans.map((plan: Plan) => {
              const { id } = plan;
              const isYearly = plan.billingCycle === 2;
              const { isPopular } = plan;
              const price = plan.price ?? 0;
              const planName =
                plan.displayName || (isYearly ? 'Pro Yearly' : 'Pro Monthly');
              const features = plan.features || [];

              return (
                <div
                  key={id}
                  className={`sp-plan-card ${
                    isYearly ? 'sp-plan-card--featured' : ''
                  }`}
                >
                  {isPopular && (
                    <div className="sp-plan-card__badge">
                      {t('subscriptionPlans.mostPopular')}
                    </div>
                  )}

                  <div className="sp-plan-card__head">
                    <div className="sp-plan-card__cycle">{planName}</div>
                    <div className="sp-plan-card__price-row">
                      <span className="sp-plan-card__currency">$</span>
                      <span className="sp-plan-card__amount">{price}</span>
                      <span className="sp-plan-card__period">
                        {isYearly
                          ? t('subscriptionPlans.perYearSuffix')
                          : t('subscriptionPlans.perMonthSuffix')}
                      </span>
                    </div>
                  </div>

                  <ul className="sp-plan-card__perks">
                    {features.map((feature: string, idx: number) => (
                      <li key={idx}>
                        <FontAwesomeIcon icon={faCheck} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    className="sp-plan-card__btn"
                    type="button"
                    disabled={isProcessing}
                    onClick={(e) => handleSubscribe(id, e)}
                  >
                    {isProcessing
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

      {/* ── Processing Modal ── */}
      {isProcessing && (
        <div className="sp-overlay">
          <div className="sp-overlay__content">
            <div className="sp-overlay__loader">
              <div className="sp-overlay__spinner" />
              <div className="sp-overlay__crown-inner">
                <FontAwesomeIcon icon={faCrown} />
              </div>
            </div>
            <h2 className="sp-overlay__title">
              {t('subscription.processing.title')}
            </h2>
            <p className="sp-overlay__text">{processStatus}</p>
            <div className="sp-overlay__security">
              <FontAwesomeIcon icon={faShield} />
              <span>{t('subscription.processing.secureNote')}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Wallet Connect Modal ── */}
      <WalletConnectModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onConnect={async () => {
          setIsWalletModalOpen(false);
          await connectWallet();
        }}
      />
    </div>
  );
}
