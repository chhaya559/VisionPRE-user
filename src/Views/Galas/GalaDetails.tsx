import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetGalaByIdQuery } from '../../Services/Api/module/GalaApi';
import './GalaDetails.scss';
import Skeleton from '../../Shared/Components/Skeleton/Skeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faShareAlt,
  faBookmark,
  faCalendar,
  faMapMarkerAlt,
  faUsers,
  faTrophy,
  faStar,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';

export default function GalaDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('private');
  const { data: apiResponse, isLoading, error } = useGetGalaByIdQuery(id || '');

  if (isLoading) {
    return (
      <div className="gala-details-container loading-skeleton">
        <div className="gala-details-shell">
          <div className="hero-section" style={{ height: '400px', backgroundColor: '#f3f4f6' }}>
            <div className="hero-nav" style={{ padding: '20px' }}>
              <Skeleton variant="circular" width="40px" height="40px" />
              <div className="right-actions" style={{ display: 'flex', gap: '12px' }}>
                <Skeleton variant="circular" width="40px" height="40px" />
                <Skeleton variant="circular" width="40px" height="40px" />
              </div>
            </div>
            <div className="hero-content" style={{ padding: '0 40px 40px' }}>
              <Skeleton variant="rounded" width="100px" height="24px" className="mb-4" />
              <Skeleton variant="text" width="60%" height="48px" className="mb-4" />
              <Skeleton variant="rounded" width="100%" height="60px" />
            </div>
          </div>

          <div className="details-content" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px', padding: '40px' }}>
            <div className="details-main">
              <Skeleton variant="text" width="200px" height="32px" className="mb-6" />
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="80%" className="mb-8" />

              <div className="stats-cards" style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
                <Skeleton variant="rounded" height="120px" style={{ flex: 1 }} />
                <Skeleton variant="rounded" height="120px" style={{ flex: 1 }} />
                <Skeleton variant="rounded" height="120px" style={{ flex: 1 }} />
              </div>
            </div>

            <div className="details-sidebar">
              <div className="info-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <Skeleton variant="rounded" height="70px" />
                <Skeleton variant="rounded" height="70px" />
                <Skeleton variant="rounded" height="70px" />
                <Skeleton variant="rounded" height="70px" />
              </div>
              <Skeleton variant="rounded" width="100%" height="56px" style={{ marginTop: '32px' }} />
            </div>
          </div>
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
  const title = galaData.name;

  const getStatusLabel = (s: any) => {
    if (typeof s === 'string') return s;
    if (s === 1) return 'Active';
    if (s === 2) return 'Upcoming';
    if (s === 3) return 'Past';
    return 'Active';
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
  const prizePool = galaData.totalPrizePool ?? 0;
  const description =
    galaData.about || galaData.description || 'No description available.';

  const rawProgram = galaData.eveningItems || galaData.program;
  const program = Array.isArray(rawProgram) ? rawProgram : [];

  const rawGrants = galaData.grants;
  const grants = Array.isArray(rawGrants) ? rawGrants : [];

  const formatCompact = (num: number) => {
    return num >= 1000 ? `$${(num / 1000).toFixed(0)}K` : `$${num}`;
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
            <button className="icon-btn-round" onClick={() => navigate(-1)}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <div className="right-actions">
              <button className="icon-btn-round">
                <FontAwesomeIcon icon={faShareAlt} />
              </button>
              <button className="icon-btn-round">
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
                  <span className="val">{date} • {time}</span>
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
                  <FontAwesomeIcon icon={faUsers} />
                </div>
                <div className="info-text">
                  <span className="label">{t('galas.details.attendees')}</span>
                  <span className="val">{attendees} {t('galas.details.entrepreneurs')}</span>
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

            <button
              className={`btn-apply-grant inline ${galaData.status > 2 ? 'disabled' : ''}`}
              disabled={galaData.status > 2}
              onClick={() => navigate(`/dashboard/galas/${id}/grants`)}
            >
              {galaData.status > 2 ? t('galas.details.pastEvent') : t('galas.details.applyToGrant')}
              <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: '8px' }} />
            </button>
          </div>

        </div>
        {/* end .details-content */}

      </div>
      {/* end .gala-details-shell */}

      <div className="bottom-sticky-bar">
        <button
          className={`btn-apply-grant ${galaData.status > 2 ? 'disabled' : ''}`}
          disabled={galaData.status > 2}
          onClick={() => navigate(`/dashboard/galas/${id}/grants`)}
        >
          {galaData.status > 2 ? t('galas.details.pastEvent') : t('galas.details.applyToGrant')}
          <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: '8px' }} />
        </button>
      </div>
    </div>
  );
}