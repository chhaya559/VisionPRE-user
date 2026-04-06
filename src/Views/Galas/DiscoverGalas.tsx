import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetGalasQuery } from '../../Services/Api/module/GalaApi';
import './Galas.scss';
import Skeleton from '../../Shared/Components/Skeleton/Skeleton';
import GalaCardSkeleton from '../../Shared/Components/Skeleton/GalaCardSkeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendar,
  faMapMarkerAlt,
  faUsers,
  faBookmark,
  faChevronRight,
  faFire,
  faClock,
  faArchive,
} from '@fortawesome/free-solid-svg-icons';

export default function DiscoverGalas() {
  const navigate = useNavigate();
  const { t } = useTranslation('private');
  const [activeFilter, setActiveFilter] = useState('All');
  const { data: apiResponse, isLoading, error } = useGetGalasQuery({});

  const filters = [
    { key: 'All', label: t('galas.discover.all') },
    { key: 'Active', label: t('galas.discover.filterActive') },
    { key: 'Upcoming', label: t('galas.discover.filterUpcoming') },
    { key: 'Planned', label: t('galas.discover.filterPlanned') },
    { key: 'Past', label: t('galas.discover.filterPast') },
  ];

  if (isLoading) {
    return (
      <div className="galas-container loading-skeleton">
        <header className="galas-header">
          <Skeleton variant="text" width="120px" height="16px" className="mb-2" />
          <Skeleton variant="text" width="300px" height="48px" className="mb-4" />
          <Skeleton variant="text" width="500px" height="24px" />
        </header>
        
        <div className="galas-filters-bar mb-8">
          <div className="galas-filters" style={{ display: 'flex', gap: '12px' }}>
            <Skeleton variant="rounded" width="80px" height="36px" />
            <Skeleton variant="rounded" width="100px" height="36px" />
            <Skeleton variant="rounded" width="120px" height="36px" />
            <Skeleton variant="rounded" width="90px" height="36px" />
          </div>
        </div>

        <section className="galas-section" style={{ marginTop: '40px' }}>
          <Skeleton variant="text" width="200px" height="32px" className="mb-6" />
          <div className="galas-grid-skeleton" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            <GalaCardSkeleton />
            <GalaCardSkeleton />
            <GalaCardSkeleton />
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="galas-container">
        <header className="galas-header">
          <h1>{t('galas.discover.title')}</h1>
          <p>{t('galas.discover.subtitle')}</p>
        </header>
        <div className="galas-feedback error">
          {t('galas.discover.error')}
        </div>
      </div>
    );
  }

  // Categorize with safe access to the items list
  const galas = apiResponse?.data?.items || [];

  const getStatusLabel = (s: any) => {
    if (typeof s === 'string') return s;
    if (s === 1) return 'Active';
    if (s === 2) return 'Upcoming';
    if (s === 3) return 'Past';
    return 'Active';
  };

  const activeGalas = galas.filter(
    (g: any) => getStatusLabel(g?.status) === 'Active'
  );
  const upcomingGalas = galas.filter(
    (g: any) => getStatusLabel(g?.status) === 'Upcoming'
  );
  const pastGalas = galas.filter(
    (g: any) => getStatusLabel(g?.status) === 'Past'
  );

  const showActive = activeFilter === 'All' || activeFilter === 'Active';
  const showUpcoming =
    activeFilter === 'All' ||
    activeFilter === 'Upcoming' ||
    activeFilter === 'Planned';
  const showPast = activeFilter === 'All' || activeFilter === 'Past';
  const hasVisibleGalas =
    (showActive && activeGalas.length > 0) ||
    (showUpcoming && upcomingGalas.length > 0) ||
    (showPast && pastGalas.length > 0);

  return (
    <div className="galas-container">
      <div className="galas-content-wrapper">
        <div className="galas-top-shell">
          <header className="galas-header">
            <div className="galas-header-inner">
              <span className="galas-eyebrow">{t('galas.discover.exploreEvents')}</span>
              <h1>{t('galas.discover.title')}</h1>
              <p>
                {t('galas.discover.browseDescription')}
              </p>
            </div>
          </header>

          <div className="galas-filters-bar">
            <div className="galas-filters">
              {filters.map((f) => (
                <button
                  key={f.key}
                  className={`filter-pill ${activeFilter === f.key ? 'active' : ''
                    }`}
                  onClick={() => setActiveFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {showActive && activeGalas.length > 0 && (
          <section className="galas-section">
            <h2 className="section-title">
              <FontAwesomeIcon icon={faFire} className="section-icon active" />{' '}
              {t('galas.discover.activeGalas')} <span className="count">({activeGalas.length})</span>
            </h2>
            {activeGalas.map((gala: any) => (
              <GalaCard
                key={gala.id || gala.Id}
                gala={gala}
                t={t}
                onClick={() =>
                  navigate(`/dashboard/galas/${gala.id || gala.Id}`)
                }
              />
            ))}
          </section>
        )}

        {showUpcoming && upcomingGalas.length > 0 && (
          <section className="galas-section">
            <h2 className="section-title">
              <FontAwesomeIcon icon={faClock} className="section-icon upcoming" />{' '}
              {activeFilter === 'Planned' ? t('galas.discover.plannedGalas') : t('galas.discover.upcomingGalas')}{' '}
              <span className="count">({upcomingGalas.length})</span>
            </h2>
            {upcomingGalas.map((gala: any) => (
              <GalaCard
                key={gala.id || gala.Id}
                gala={gala}
                t={t}
                onClick={() =>
                  navigate(`/dashboard/galas/${gala.id || gala.Id}`)
                }
              />
            ))}
          </section>
        )}

        {showPast && pastGalas.length > 0 && (
          <section className="galas-section">
            <h2 className="section-title">
              <FontAwesomeIcon icon={faArchive} className="section-icon past" />{' '}
              {t('galas.discover.pastGalas')} <span className="count">({pastGalas.length})</span>
            </h2>
            {pastGalas.map((gala: any) => (
              <GalaCard
                key={gala.id || gala.Id}
                gala={gala}
                t={t}
                onClick={() =>
                  navigate(`/dashboard/galas/${gala.id || gala.Id}`)
                }
              />
            ))}
          </section>
        )}

        {!hasVisibleGalas && (
          <div className="galas-empty-state">
            <h3>{t('galas.discover.noGalas')}</h3>
            <p>
              {t('galas.discover.noGalasDescription')}
            </p>
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
}: Readonly<{ gala: any; t: any; onClick: () => void }>) {
  const title = gala.name || 'Untitled Gala';
  const dateStr = gala.eventDate || gala.Date || gala.event_date;
  const date = dateStr
    ? new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    : 'TBD';
  const location = gala.city || gala.venue || gala.Location || 'TBD';
  const attendees = gala.appliedCount ?? gala.Attendees ?? 0;
  const prizePool = gala.totalPrizePool ?? gala.PrizePool ?? 0;

  const getStatusLabel = (s: any) => {
    if (typeof s === 'string') return s;
    if (s === 1) return 'Active';
    if (s === 2) return 'Upcoming';
    if (s === 3) return 'Past';
    return 'Active';
  };
  const status = getStatusLabel(gala.status || gala.Status);
  const imageUrl =
    gala.coverImageUrl ||
    gala.imageUrl ||
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
        <button
          className="bookmark-btn"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <FontAwesomeIcon icon={faBookmark} />
        </button>
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

        <button
          className="btn-details"
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
  );
}
