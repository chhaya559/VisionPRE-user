import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetSavedGalasQuery } from '../../Services/Api/module/GalaApi';
import type { GalaEvent } from '../../Services/Api/module/GalaApi/types';
import './Galas.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendar,
  faMapMarkerAlt,
  faUsers,
  faChevronRight,
  faChevronLeft,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { GalaStatus } from '../../Shared/Enums';

import Skeleton from '../../Shared/Components/Skeleton/Skeleton';

export default function SavedGalas() {
  const navigate = useNavigate();
  const { t } = useTranslation('private');
  const { data: apiResponse, isLoading, error } = useGetSavedGalasQuery();

  if (isLoading) {
    return (
      <div className="galas-container loading-state">
        <header className="galas-header">
          <Skeleton variant="text" width={80} height={20} />
          <Skeleton variant="text" width={200} height={32} />
          <Skeleton variant="text" width={300} height={20} />
        </header>

        <section className="galas-section">
          {[1, 2, 3].map((i) => (
            <div key={i} className="gala-card skeleton-card">
              <Skeleton variant="rect" height={200} />
              <div className="card-content">
                <Skeleton variant="text" width="80%" height={24} />
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
              </div>
            </div>
          ))}
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="galas-container">
        <header className="galas-header">
          <button
            type="button"
            className="back-btn-simple"
            onClick={() => navigate(-1)}
            style={{
              marginBottom: '1rem',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#64748b',
            }}
          >
            <FontAwesomeIcon icon={faChevronLeft} /> {t('galas.grants.back')}
          </button>
          <h1>{t('galas.discover.savedGalas') || 'Saved Galas'}</h1>
        </header>
        <div className="galas-feedback error">{t('galas.discover.error')}</div>
      </div>
    );
  }

  const galas = apiResponse?.data?.items || [];

  return (
    <div className="galas-container">
      <div className="galas-content-wrapper">
        <div className="galas-top-shell">
          <header className="galas-header">
            <button
              type="button"
              className="back-btn-simple"
              onClick={() => navigate(-1)}
              style={{
                marginBottom: '1rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#64748b',
              }}
            >
              <FontAwesomeIcon icon={faChevronLeft} /> {t('galas.grants.back')}
            </button>
            <div className="galas-header-inner">
              <span className="galas-eyebrow">
                {t('galas.discover.exploreEvents')}
              </span>
              <h1>{t('galas.discover.savedGalas') || 'Saved Galas'}</h1>
              <p>
                {t('galas.discover.savedDescription') ||
                  'Your collection of bookmarked events.'}
              </p>
            </div>
          </header>
        </div>

        {galas.length > 0 ? (
          <section className="galas-section">
            {galas.map((gala: GalaEvent) => (
              <GalaCard
                key={gala.id}
                gala={gala}
                t={t}
                onClick={() => navigate(`/dashboard/galas/${gala.id}`)}
              />
            ))}
          </section>
        ) : (
          <div className="galas-empty-state">
            <h3>{t('galas.discover.noGalas')}</h3>
            <p>
              {t('galas.discover.noSavedGalasDescription') ||
                "You haven't saved any galas yet."}
            </p>
            <button
              type="button"
              className="btn-continue"
              style={{
                marginTop: '1.5rem',
                width: 'auto',
                padding: '10px 24px',
              }}
              onClick={() => navigate('/dashboard/galas')}
            >
              {t('galas.discover.browseEvents') || 'Browse Events'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function GalaCard({
  gala,
  t,
  onClick,
}: Readonly<{
  gala: GalaEvent;
  t: (key: string, options?: Record<string, unknown>) => string;
  onClick: () => void;
}>) {
  const title = gala.name || t('galas.discover.untitledGala');
  const dateStr = gala.eventDate;
  const date = dateStr
    ? new Date(dateStr).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : t('galas.discover.tbd');
  const location = gala.city || gala.venue || t('galas.discover.tbd');
  const attendees = gala.appliedCount ?? gala.expectedAttendees ?? 0;
  const prizePool = gala.totalGalaValue ?? 0;

  const getStatusLabel = (s: GalaStatus) => {
    switch (s) {
      case GalaStatus.Draft:
        return 'Draft';
      case GalaStatus.Upcoming:
        return 'Upcoming';
      case GalaStatus.Active:
        return 'Active';
      case GalaStatus.Completed:
        return 'Past';
      default:
        return 'Active';
    }
  };
  const status = getStatusLabel(gala.status);
  const imageUrl =
    gala.coverImageUrl ||
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="gala-card" onClick={onClick}>
      <div className="card-image-wrapper">
        <img
          src={imageUrl}
          alt={title}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className={`status-badge ${String(status).toLowerCase()}`}>
          {status === 'Active' && <span className="status-dot" />}
          {t(`galas.discover.status${status}`)}
        </div>
        {gala.isRegistered && (
          <div className="registered-badge">
            <FontAwesomeIcon icon={faCheckCircle} />
            {t('galas.discover.ticketPurchased') || 'Ticket Purchased'}
          </div>
        )}
      </div>
      <div className="card-content">
        <h3>{title}</h3>
        <div className="detail-row">
          <FontAwesomeIcon icon={faCalendar} />
          <span>{date}</span>
        </div>
        <div className="detail-row">
          <FontAwesomeIcon icon={faMapMarkerAlt} />
          <span>{location}</span>
        </div>

        <div className="card-footer">
          <div className="attendees">
            <FontAwesomeIcon icon={faUsers} />
            {attendees} {t('galas.discover.applied')}
          </div>
          <div className="prize-pool">${prizePool.toLocaleString()}</div>
        </div>

        <div className="card-actions">
          <button
            type="button"
            className="btn-details secondary"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            {t('galas.discover.viewDetails')}
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
    </div>
  );
}
