import {
  useGetMyApplicationsQuery,
  useGetGalasQuery,
} from '../../Services/Api/module/GalaApi';
import './GrantsList.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock,
  faCheckCircle,
  faTimesCircle,
  faChevronRight,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function GrantsList() {
  const navigate = useNavigate();
  const { t } = useTranslation('private');
  const { data: appsResponse, isLoading: appsLoading } =
    useGetMyApplicationsQuery({});
  const { data: galasResponse, isLoading: galasLoading } = useGetGalasQuery({});
  const applications = (appsResponse as any)?.data || appsResponse || [];
  const galas = (galasResponse as any)?.data?.items || [];

  const isLoading = appsLoading || galasLoading;

  // Group applications by Gala
  const groupedApps = Array.isArray(applications)
    ? applications.reduce((acc: any, app: any) => {
      const galaId = app.galaId || app.GalaId || 'unknown';
      if (!acc[galaId]) acc[galaId] = [];
      acc[galaId].push(app);
      return acc;
    }, {})
    : {};

  // Stats
  const pendingCount = Array.isArray(applications)
    ? applications.filter(
      (a: any) =>
        a.status === 1 || String(a.status).toLowerCase() === 'pending'
    ).length
    : 0;
  const approvedCount = Array.isArray(applications)
    ? applications.filter(
      (a: any) =>
        a.status === 2 || String(a.status).toLowerCase() === 'approved'
    ).length
    : 0;
  const rejectedCount = Array.isArray(applications)
    ? applications.filter(
      (a: any) =>
        a.status === 3 || String(a.status).toLowerCase() === 'rejected'
    ).length
    : 0;

  const getStatusBadge = (status: any) => {
    const s = String(status).toLowerCase();
    if (s === 'approved' || status === 2)
      return <span className="status-badge approved">{t('grants.list.approved')}</span>;
    if (s === 'rejected' || status === 3)
      return <span className="status-badge rejected">{t('grants.list.rejected')}</span>;
    return <span className="status-badge pending">{t('grants.list.pending')}</span>;
  };

  if (isLoading) {
    return (
      <div className="grants-hub-view loading">
        <div className="spinner">{t('grants.list.loading')}</div>
      </div>
    );
  }

  return (
    <div className="grants-hub-view">
      <header className="view-header">
        <div className="header-content">
          <h1>{t('grants.list.myApplications')}</h1>
          <p>{t('grants.list.trackDescription')}</p>
        </div>
        <button
          className="btn-discover"
          onClick={() => navigate('/dashboard/galas')}
        >
          <FontAwesomeIcon icon={faPlus} />
          {t('grants.list.discoverGrants')}
        </button>
      </header>

      {/* Your Status Section */}
      <section className="status-section">
        <h2 className="section-title">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="title-icon"
          >
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
          {t('grants.list.yourStatus')}
        </h2>
        <div className="status-cards-grid">
          <div className="status-card pending">
            <div className="icon-wrapper">
              <FontAwesomeIcon icon={faClock} />
            </div>
            <div className="card-info">
              <span className="count">{pendingCount}</span>
              <span className="label">{t('grants.list.pending')}</span>
            </div>
          </div>
          <div className="status-card approved">
            <div className="icon-wrapper">
              <FontAwesomeIcon icon={faCheckCircle} />
            </div>
            <div className="card-info">
              <span className="count">{approvedCount}</span>
              <span className="label">{t('grants.list.approved')}</span>
            </div>
          </div>
          <div className="status-card rejected">
            <div className="icon-wrapper">
              <FontAwesomeIcon icon={faTimesCircle} />
            </div>
            <div className="card-info">
              <span className="count">{rejectedCount}</span>
              <span className="label">{t('grants.list.rejected')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Galas Section */}
      <section className="upcoming-galas-section">
        <h2 className="section-title">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="title-icon"
          >
            <path d="M12 2L2 7L12 12L22 7L12 2Z" />
            <path d="M2 17L12 22L22 17" />
            <path d="M2 12L12 17L22 12" />
          </svg>
          {t('grants.list.upcomingGalas')}
        </h2>

        <div className="galas-group-list">
          {Object.keys(groupedApps).length === 0 ? (
            <div className="empty-state">
              <p>{t('grants.list.noApplications')}</p>
            </div>
          ) : (
            Object.keys(groupedApps).map((gId) => {
              const galaApps = groupedApps[gId];
              const gala = galas.find(
                (g: any) => g.id === gId || g.Id === gId
              ) || {
                name: galaApps[0].galaName || 'Gala Vision 2026',
                eventDate: galaApps[0].createdAt,
              };

              return (
                <div key={gId} className="gala-group-card">
                  <header className="gala-group-header">
                    <div className="gala-meta">
                      <h3>{gala.name || gala.Name}</h3>
                      <span className="event-date">
                        {t('grants.list.on')}{' '}
                        {gala.eventDate
                          ? new Date(gala.eventDate).toLocaleDateString(
                            'en-US',
                            { month: 'long', day: 'numeric', year: 'numeric' }
                          )
                          : t('grants.list.tbd')}
                      </span>
                    </div>
                    <div className="app-count-badge">{galaApps.length}</div>
                  </header>

                  <div className="nested-apps-list">
                    {galaApps.map((app: any) => (
                      <div key={app.id || app.Id} className="nested-app-item">
                        <div className="app-icon-box">
                          <FontAwesomeIcon icon={faClock} />
                        </div>
                        <div className="app-details">
                          <h4>{app.grantName || app.GrantName}</h4>
                          <p className="interview-info">
                            {t('grants.list.interview')}{' '}
                            {app.interviewDate
                              ? new Date(app.interviewDate).toLocaleDateString()
                              : 'Pending'}{' '}
                            {t('grants.list.at')}
                          </p>
                          <p className="submission-date">
                            {t('grants.list.submittedOn')}{' '}
                            {new Date(app.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="app-actions">
                          {getStatusBadge(app.status)}
                          <FontAwesomeIcon
                            icon={faChevronRight}
                            className="chevron"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
