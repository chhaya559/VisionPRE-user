import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  useGetGalaByIdQuery,
  usePurchaseTicketMutation,
} from '../../Services/Api/module/GalaApi';
import { GrantStatus } from '../../Shared/Enums';
import Modal from '../../Shared/Components/Modal';
import { toast } from 'react-toastify';
import { useSubscription } from '../../hooks/useSubscription';
import { usePurchaseTicketBlockchain } from '../../hooks/usePurchaseTicketBlockchain';
import SubscriptionGuardModal from '../../Shared/Components/Modal/SubscriptionGuardModal';
import BlockchainProcessingModal from '../../Shared/Components/Modal/BlockchainProcessingModal';
import './GalaGrants.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faDollarSign,
  faTag,
  faCalendar,
  faCheckCircle,
  faPaperPlane,
  faCreditCard,
} from '@fortawesome/free-solid-svg-icons';

export default function GalaGrants() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('private');
  const {
    data: apiResponse,
    isLoading,
    error,
    refetch,
  } = useGetGalaByIdQuery(id || '');
  const [purchaseTicket, { isLoading: isPurchasing }] =
    usePurchaseTicketMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGrantId, setSelectedGrantId] = useState<string | null>(null);
  const { isActive } = useSubscription();
  const { 
    purchaseTicketBlockchain, 
    isProcessing: isBlockchainProcessing, 
    processStatus 
  } = usePurchaseTicketBlockchain();
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="gala-grants-container gala-grants-state loading">
        <div className="gala-grants-message">{t('galas.grants.loading')}</div>
      </div>
    );
  }

  if (error || !apiResponse) {
    return (
      <div className="gala-grants-container gala-grants-state error">
        <h2 className="gala-grants-error-title">
          {t('galas.grants.notFound')}
        </h2>
        <button
          type="button"
          className="btn-continue gala-grants-back-btn"
          onClick={() => navigate('/dashboard/galas')}
        >
          {t('galas.grants.backToDiscover')}
        </button>
      </div>
    );
  }

  // Map specific fields from the provided API response shape
  const galaData = (apiResponse as any)?.data || apiResponse || {};
  const galaTitle = galaData.name;
  const isRegistered = galaData.isTicketPurchased || galaData.isRegistered || false;
  const ticketPrice = galaData.ticketPrice || galaData.ticket_price || 0;
  const grants = Array.isArray(galaData.grants) ? galaData.grants : [];

  const handleApplyClick = (gId: string) => {
    if (!isActive) {
      setIsModalOpen(false); // Close ticket modal if it was open (safety)
      setIsSubModalOpen(true);
      return;
    }
    if (!isRegistered) {
      setSelectedGrantId(gId);
      setIsModalOpen(true);
    } else {
      navigate(`/dashboard/galas/${id}/apply/${gId}`);
    }
  };

  const handlePurchase = async () => {
    if (!isActive) {
      setIsModalOpen(false); // Close the current modal to show the guard
      setIsSubModalOpen(true);
      return;
    }
    try {
      if (!id || !selectedGrantId || !galaData) {
        console.warn('[GalaGrants] Missing data:', { id, selectedGrantId, galaData });
        return;
      }

      console.log('[GalaGrants] Step 1: Blockchain Purchase');
      const organiserWallet = galaData.organiserWalletAddress;
      if (!organiserWallet) {
        toast.error('Gala organiser wallet address not found.');
        return;
      }

      const blockchainResult = await purchaseTicketBlockchain(
        id || '',
        organiserWallet,
        ticketPrice
      );

      if (!blockchainResult) {
        console.log('[GalaGrants] Blockchain purchase cancelled or failed.');
        return;
      }

      console.log('[GalaGrants] Step 2: Backend Synchronization', blockchainResult);
      const purchasePayload = { 
        galaId: (galaData.id || id || '').trim(),
        transactionHash: (blockchainResult.transactionHash || '').trim(),
        walletAddress: blockchainResult.walletAddress
      };
      console.log('[DEBUG] Exact Backend Payload:', JSON.stringify(purchasePayload, null, 2));

      await purchaseTicket(purchasePayload).unwrap();

      console.log('[GalaGrants] Purchase fully successful. Proceeding to apply.');
      toast.success(
        t('galas.details.purchaseSuccess') || 'Ticket purchased successfully!'
      );
      refetch();
      setIsModalOpen(false);
      if (selectedGrantId) {
        navigate(`/dashboard/galas/${id}/apply/${selectedGrantId}`);
      }
    } catch (err: any) {
      console.error('[GalaGrants] Error during purchase flow:', err);
      toast.error(err?.data?.message || 'Failed to purchase ticket.');
    }
  };

  return (
    <div className="gala-grants-container">
      <div className="gala-grants-top-shell">
        <header className="gala-grants-header">
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate(-1)}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
            {t('galas.grants.back')}
          </button>
          <div className="header-copy">
            <span className="header-eyebrow">
              {t('galas.grants.discoverGrants')}
            </span>
            <h1>{t('galas.grants.title')}</h1>
            <p>
              {galaTitle
                ? `${t('galas.grants.exploreGrants')} ${galaTitle}.`
                : t('galas.grants.exploreGrantsDescription')}
            </p>
          </div>
        </header>
      </div>

      <div className="grants-list">
        {grants.length === 0 ? (
          <p className="empty-state">{t('galas.grants.noGrants')}</p>
        ) : (
          grants.map((grant: any) => {
            const gId = grant.id;
            const gTitle = grant.name;

            const getStatusLabel = (s: GrantStatus) => {
              switch (s) {
                case GrantStatus.Draft: return 'Draft';
                case GrantStatus.Upcoming: return 'Upcoming';
                case GrantStatus.Active: return 'Active';
                case GrantStatus.Completed: return 'Completed';
                case GrantStatus.Closed: return 'Closed';
                default: return 'Active';
              }
            };
            const gStatus = getStatusLabel(grant.status);

            const gDesc = grant.description;
            const gAmount = grant.prizeAmount;
            const gCategory = grant.category;
            const gDeadline = grant.applicationDeadline
              ? new Date(grant.applicationDeadline).toLocaleDateString()
              : '';

            const requirements = [];
            if (grant.requireBusinessPlanDocument)
              requirements.push(t('galas.grants.businessPlan'));
            if (grant.requireCompanyName)
              requirements.push(t('galas.grants.companyName'));
            if (grant.requireIndustrySelection)
              requirements.push(t('galas.grants.industrySelection'));
            if (grant.requireInterview)
              requirements.push(t('galas.grants.interview'));
            if (grant.requireMotivationStatement)
              requirements.push(t('galas.grants.motivationStatement'));
            const gEligibility =
              requirements.length > 0
                ? requirements.join(', ')
                : t('galas.grants.noneSpecified');

            return (
              <div key={gId} className="grant-card">
                <div className="grant-header">
                  <h3>{gTitle}</h3>
                  <span
                    className={`status-badge ${String(gStatus).toLowerCase()}`}
                  >
                    {t(`galas.grants.status${gStatus}`)}
                  </span>
                </div>
                <div className="grant-gala-ref">
                  {t('galas.grants.gala')} <span>{galaTitle}</span>
                </div>

                <p className="grant-desc">{gDesc}</p>

                <div className="grant-pills">
                  <span className="pill">
                    <FontAwesomeIcon
                      icon={faDollarSign}
                      className="pill-icon"
                    />{' '}
                    {gAmount.toLocaleString()}$
                  </span>
                  <span className="pill">
                    <FontAwesomeIcon icon={faTag} className="pill-icon" />{' '}
                    {gCategory}
                  </span>
                  <span className="pill">
                    <FontAwesomeIcon icon={faCalendar} className="pill-icon" />{' '}
                    {gDeadline}
                  </span>
                </div>

                <div className="eligibility-section">
                  <h4>
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green"
                    />
                    {t('galas.grants.eligibilityCriteria')}
                  </h4>
                  <p>{gEligibility}</p>
                </div>

                <button
                  type="button"
                  className="btn-apply"
                  onClick={() => handleApplyClick(gId)}
                >
                  {grant.status >= GrantStatus.Completed
                    ? t('galas.grants.viewApplication') || 'View Application'
                    : t('galas.grants.applyToGrant')}
                  <FontAwesomeIcon icon={faPaperPlane} className="apply-icon" />
                </button>
              </div>
            );
          })
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t('galas.details.ticketRequired') || 'Ticket Required'}
        showFooter={false}
      >
        <div style={{ padding: '0 1rem 1rem 1rem', textAlign: 'center' }}>
          <FontAwesomeIcon
            icon={faCreditCard}
            size="3x"
            style={{ color: '#10B981', marginBottom: '1.5rem' }}
          />
          <p
            style={{
              fontSize: '1.1rem',
              marginBottom: '1.5rem',
              color: '#4B5563',
            }}
          >
            {t('galas.details.mustBuyTicket') ||
              'You must purchase a ticket to this gala before you can apply for a grant.'}
          </p>
          <button
            type="button"
            className="btn-purchase-ticket"
            disabled={isPurchasing || isBlockchainProcessing || isRegistered}
            onClick={handlePurchase}
            style={{
              background: (isPurchasing || isBlockchainProcessing || isRegistered) ? '#94A3B8' : '#10B981',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: (isPurchasing || isBlockchainProcessing || isRegistered) ? 'not-allowed' : 'pointer',
              width: '100%',
              fontSize: '1rem',
              boxShadow: (isPurchasing || isBlockchainProcessing || isRegistered) ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.2)'
            }}
          >
            {isPurchasing || isBlockchainProcessing
              ? t('galas.details.processing') || 'Processing...'
              : isRegistered
                ? t('galas.details.ticketPurchased') || 'Ticket Purchased'
                : !isActive
                  ? t('galas.details.subscribeToBuy') || 'Subscribe to Buy'
                  : t('galas.details.buyTicketNow', { price: ticketPrice }) ||
                  `Buy Ticket ($${ticketPrice})`}
          </button>
        </div>
      </Modal>

      <SubscriptionGuardModal
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
      />

      <BlockchainProcessingModal
        isOpen={isBlockchainProcessing}
        status={processStatus}
      />
    </div>
  );
}
