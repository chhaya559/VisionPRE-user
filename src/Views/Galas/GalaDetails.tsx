import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  useGetGalaByIdQuery,
  usePurchaseTicketMutation,
  useToggleSaveGalaMutation,
} from '../../Services/Api/module/GalaApi';
import { GalaStatus } from '../../Shared/Enums';
import './GalaDetails.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faBookmark,
  faCalendar,
  faMapMarkerAlt,
  faUsers,
  faTrophy,
  faStar,
  faArrowRight,
  faCreditCard,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useSubscription } from '../../hooks/useSubscription';
import { usePurchaseTicketBlockchain } from '../../hooks/usePurchaseTicketBlockchain';
import SubscriptionGuardModal from '../../Shared/Components/Modal/SubscriptionGuardModal';
import BlockchainProcessingModal from '../../Shared/Components/Modal/BlockchainProcessingModal';

export default function GalaDetails() {
  const { id: urlId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('private');
  const {
    data: apiResponse,
    isLoading,
    error,
    refetch,
  } = useGetGalaByIdQuery(urlId || '');
  const [purchaseTicket, { isLoading: isPurchasing }] =
    usePurchaseTicketMutation();
  const [toggleSave] = useToggleSaveGalaMutation();

  const { isActive } = useSubscription();
  const { 
    purchaseTicketBlockchain, 
    isProcessing: isBlockchainProcessing, 
    processStatus 
  } = usePurchaseTicketBlockchain();
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="gala-details-container loading-state">
        <div className="gala-details-shell">
          <header
            className="hero-section"
            style={{
              height: '200px',
              backgroundColor: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <p>Loading gala details...</p>
          </header>
        </div>
      </div>
    );
  }

  if (error || !apiResponse) {
    return (
      <div
        className="gala-details-container"
        style={{ padding: '2rem', textAlign: 'center' }}
      >
        <h2 style={{ color: '#EF4444' }}>{t('galas.details.notFound')}</h2>
        <button
          type="button"
          className="btn-continue"
          style={{ marginTop: '1rem', width: 'auto', padding: '10px 20px' }}
          onClick={() => navigate('/dashboard/galas')}
        >
          {t('galas.details.backToDiscover')}
        </button>
      </div>
    );
  }

  const galaData = (apiResponse as any)?.data || apiResponse || {};
  const id = urlId || '';

  const title = galaData.name;
  const isRegistered = galaData.isTicketPurchased || galaData.isRegistered || false;
  const ticketPrice = galaData.ticketPrice || galaData.ticket_price || 0;

  const getStatusLabel = (s: GalaStatus) => {
    switch (s) {
      case GalaStatus.Draft: return 'Draft';
      case GalaStatus.Upcoming: return 'Upcoming';
      case GalaStatus.Active: return 'Active';
      case GalaStatus.Completed: return 'Past';
      default: return 'Active';
    }
  };
  const status = getStatusLabel(galaData.status);

  const imageUrl = galaData.coverImageUrl || galaData.imageUrl;
  const date = galaData.eventDate
    ? new Date(galaData.eventDate).toLocaleDateString()
    : 'TBD';
  const time = galaData.eventTime || 'TBD';
  const location =
    galaData.venue && galaData.city
      ? `${galaData.venue}, ${galaData.city}`
      : galaData.city || galaData.location || 'TBD';
  const attendees = galaData.appliedCount ?? galaData.expectedAttendees ?? 0;
  const prizePool = galaData.totalGalaValue ?? galaData.totalPrizePool ?? 0;
  const description =
    galaData.about || galaData.description || 'No description available.';

  const rawProgram = galaData.eveningItems || galaData.program;
  const program = Array.isArray(rawProgram) ? rawProgram : [];

  const rawGrants = galaData.grants;
  const grants = Array.isArray(rawGrants) ? rawGrants : [];

  const formatCompact = (num: number) => {
    return num >= 1000 ? `$${(num / 1000).toFixed(0)}K` : `$${num}`;
  };

  const handlePurchase = async () => {
    if (!isActive) {
      setIsSubModalOpen(true);
      return;
    }
    try {
      // 1. Blockchain Transaction
      console.log('[GalaDetails] Initiating handlePurchase...');
      if (!id || !galaData) {
        console.warn('[GalaDetails] Missing id or gala data');
        return;
      }

      console.log('[GalaDetails] Step 1: Blockchain Purchase');
      const organiserWallet = galaData.organiserWalletAddress;
      if (!organiserWallet) {
        toast.error('Gala organiser wallet address not found.');
        return;
      }

      const blockchainResult = await purchaseTicketBlockchain(
        id,
        organiserWallet,
        ticketPrice
      );

      if (!blockchainResult) {
        console.log('[GalaDetails] Blockchain purchase cancelled or failed.');
        return;
      }

      console.log('[GalaDetails] Step 2: Backend Synchronization', blockchainResult);
      const purchasePayload = { 
        galaId: (galaData.id || id || '').trim(),
        transactionHash: (blockchainResult.transactionHash || '').trim(),
        walletAddress: blockchainResult.walletAddress
      };
      console.log('[DEBUG] Exact Backend Payload:', JSON.stringify(purchasePayload, null, 2));

      await purchaseTicket(purchasePayload).unwrap();

      console.log('[GalaDetails] Purchase fully successful.');
      toast.success(t('galas.details.purchaseSuccess') || 'Ticket purchased successfully!');
      refetch();
    } catch (err: any) {
      console.error('[GalaDetails] Error during purchase flow:', err);
      toast.error(err?.data?.message || 'Failed to complete purchase.');
    }
  };

  const handleApplyClick = () => {
    navigate(`/dashboard/galas/${id}/grants`);
  };

  const handleToggleSave = async () => {
    try {
      const result = await toggleSave((galaData.id || id || '').trim()).unwrap();
      toast.success(result?.message || (galaData.isSaved ? 'Removed from saved' : 'Added to saved'));
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="gala-details-container">
      <div className="gala-details-shell">
        {/* ── LEFT: Hero image, fills full height of right col ── */}
        <div
          className="hero-section"
          style={{
            backgroundImage: `url(${
              imageUrl ||
              'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            })`,
          }}
        >
          <div className="hero-overlay" />

          <div className="hero-nav">
            <button
              type="button"
              className="icon-btn-round"
              onClick={() => navigate(-1)}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <div className="right-actions">

              <button 
                type="button" 
                className={`icon-btn-round bookmark-btn ${galaData.isSaved ? 'active' : ''}`}
                onClick={handleToggleSave}
              >
                <FontAwesomeIcon icon={faBookmark} />
              </button>
            </div>
          </div>

          <div className="hero-content">
            <div className={`status-badge floating ${status.toLowerCase()}`}>
              {t(`galas.discover.status${status}`).toUpperCase()}
            </div>
            <h1>{title}</h1>
            {/* Description preview card at bottom of hero */}
            <div className="hero-about-preview">
              <p>{description}</p>
            </div>
          </div>
        </div>

        {/* ── RIGHT: all details stacked ── */}
        <div className="details-content">
          {/* Main content: about + program + stats */}
          <div className="details-main">
            <div className="about-section">
              <h2>{t('galas.details.aboutEvent')}</h2>
              <p>{description}</p>
            </div>

            {program.length > 0 && (
              <div className="program-section">
                <h2>{t('galas.details.eveningProgram')}</h2>
                {program.map((p: any, i: number) => {
                  const pTime = p.time || p.Time;
                  const pTitle = p.title || p.Title;
                  const pDesc = p.description || p.Description;
                  return (
                    <div key={i} className="program-item">
                      <div className="program-time">{pTime}</div>
                      <div className="program-content">
                        <h4>{pTitle}</h4>
                        <p>{pDesc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="stats-cards">
              <div className="stat-card participants">
                <FontAwesomeIcon icon={faUsers} />
                <strong>{attendees}</strong>
                <span>{t('galas.details.participants')}</span>
              </div>
              <div className="stat-card grants-count">
                <FontAwesomeIcon icon={faStar} />
                <strong>{grants.length}</strong>
                <span>{t('galas.details.grants')}</span>
              </div>
              <div className="stat-card prize">
                <FontAwesomeIcon icon={faBookmark} />
                <strong>{formatCompact(prizePool)}</strong>
                <span>{t('galas.details.prizePool')}</span>
              </div>
            </div>
          </div>

          {/* Sidebar: info cards + apply button */}
          <div className="details-sidebar">
            <div className="info-list">
              <div className="info-item">
                <div className="info-icon green-bg">
                  <FontAwesomeIcon icon={faCalendar} />
                </div>
                <div className="info-text">
                  <span className="label">{t('galas.details.dateTime')}</span>
                  <span className="val">
                    {date} • {time}
                  </span>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon green-bg">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                </div>
                <div className="info-text">
                  <span className="label">{t('galas.details.location')}</span>
                  <span className="val">{location}</span>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon green-bg">
                  <FontAwesomeIcon icon={faCreditCard} />
                </div>
                <div className="info-text">
                  <span className="label">
                    {t('galas.details.ticketPrice') || 'Ticket Price'}
                  </span>
                  <span className="val">${ticketPrice}</span>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon green-bg">
                  <FontAwesomeIcon icon={faTrophy} />
                </div>
                <div className="info-text">
                  <span className="label">{t('galas.details.prizePool')}</span>
                  <span className="val">
                    ${prizePool.toLocaleString()} {t('galas.details.inGrants')}
                  </span>
                </div>
              </div>
            </div>

            {isRegistered ? (
              <div className="registered-status-banner">
                <FontAwesomeIcon icon={faCheckCircle} />
                <span>{t('galas.details.ticketPurchased') || 'Ticket Purchased'}</span>
              </div>
            ) : (
              <button
                type="button"
                className={`btn-purchase-ticket ${
                  (isPurchasing || isBlockchainProcessing) ? 'loading' : ''
                }`}
                disabled={isPurchasing || isBlockchainProcessing || galaData.status === GalaStatus.Completed}
                onClick={handlePurchase}
              >
                {isPurchasing || isBlockchainProcessing
                  ? t('galas.details.processing') || 'Processing...'
                  : !isActive 
                    ? t('galas.details.subscribeToBuy') || 'Subscribe to Buy'
                    : t('galas.details.buyTicketAmount', { price: ticketPrice })}
              </button>
            )}

            <button
              type="button"
              className="btn-apply-grant inline"
              onClick={handleApplyClick}
            >
              {galaData.status === GalaStatus.Completed
                ? t('galas.details.viewGrants') || 'View Grants'
                : t('galas.details.applyToGrant')}
              <FontAwesomeIcon
                icon={faArrowRight}
                style={{ marginLeft: '8px' }}
              />
            </button>
          </div>
        </div>
        {/* end .details-content */}
      </div>
      {/* end .gala-details-shell */}

      <div className="bottom-sticky-bar">
        {isRegistered ? (
          <div className="registered-status-banner mobile">
            <FontAwesomeIcon icon={faCheckCircle} />
            <span>{t('galas.details.ticketPurchased') || 'Ticket Purchased'}</span>
          </div>
        ) : (
          <button
            type="button"
            className={`btn-purchase-ticket ${
              (isPurchasing || isBlockchainProcessing) ? 'loading' : ''
            }`}
            disabled={isPurchasing || isBlockchainProcessing || galaData.status === GalaStatus.Completed}
            onClick={handlePurchase}
            style={{ marginRight: '12px', flex: 1 }}
          >
            {isPurchasing || isBlockchainProcessing
              ? '...'
              : !isActive 
                ? t('galas.details.subscribeToBuy') || 'Subscribe'
                : t('galas.details.buyTicketAmountShort', {
                  price: ticketPrice,
                }) || `Buy Ticket ($${ticketPrice})`}
          </button>
        )}
        <button
          type="button"
          className="btn-apply-grant"
          onClick={handleApplyClick}
          style={{ flex: 2 }}
        >
          {galaData.status === GalaStatus.Completed
            ? t('galas.details.viewGrants') || 'View Grants'
            : t('galas.details.applyToGrant')}
          <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: '8px' }} />
        </button>
      </div>

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
