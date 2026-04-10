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
  faLayerGroup,
  faArrowTrendUp,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  getGrantApplicationStatusLabel,
  getGrantApplicationStatusValue,
  GrantApplicationStatus,
  isGrantApprovedStatus,
  isGrantPendingStatus,
} from '../../Shared/GrantApplicationStatus';
import Skeleton from '../../Shared/Components/Skeleton/Skeleton';

interface GrantApplicationDto {
  id?: string;
  Id?: string;
  galaId?: string;
  GalaId?: string;
  galaName?: string;
  GalaName?: string;
  galaTitle?: string;
  GalaTitle?: string;
  grantName?: string;
  GrantName?: string;
  status: string | number;
  submittedAt?: string;
  createdAt?: string;
  interviewDate?: string;
}

interface GalaDto {
  id?: string;
  Id?: string;
  name?: string;
  Name?: string;
  eventDate?: string;
}

export default function GrantsList() {
  const navigate = useNavigate();
  const { t } = useTranslation('private');
  const { data: appsResponse, isLoading: appsLoading } =
    useGetMyApplicationsQuery({});
  const { data: galasResponse, isLoading: galasLoading } = useGetGalasQuery({});
  const applications =
    (appsResponse as { data?: unknown })?.data || appsResponse || [];
  const galas =
    (galasResponse as { data?: { items?: unknown[] } })?.data?.items || [];

  const isLoading = appsLoading || galasLoading;

  const grouped = (
    Array.isArray(applications) ? (applications as GrantApplicationDto[]) : []
  ).reduce(
    (acc: Record<string, GrantApplicationDto[]>, app: GrantApplicationDto) => {
      const galaId = (app.galaId ||
        app.GalaId ||
        app.galaName ||
        app.GalaName ||
        'unknown') as string;
      if (!acc[galaId]) acc[galaId] = [];
      acc[galaId].push(app);
      return acc;
    },
    {}
  );

  type GalaGroup = {
    galaId: string;
    galaTitle: string;
    applications: GrantApplicationDto[];
  };

  const galasWithApplications: GalaGroup[] = (
    Object.entries(grouped) as [string, GrantApplicationDto[]][]
  )
    .filter(([, apps]) => apps.length > 0)
    .map(([galaId, apps]) => {
      const firstApp = apps[0];
      return {
        galaId,
        galaTitle: (firstApp?.galaTitle ||
          firstApp?.GalaTitle ||
          firstApp?.galaName ||
          firstApp?.GalaName ||
          'Unknown Gala') as string,
        applications: apps,
      };
    });

  // Stats
  const pendingCount = Array.isArray(applications)
    ? (applications as GrantApplicationDto[]).filter((a: GrantApplicationDto) =>
        isGrantPendingStatus(
          getGrantApplicationStatusValue(a as { status: string | number })
        )
      ).length
    : 0;
  const approvedCount = Array.isArray(applications)
    ? (applications as GrantApplicationDto[]).filter((a: GrantApplicationDto) =>
        isGrantApprovedStatus(
          getGrantApplicationStatusValue(a as { status: string | number })
        )
      ).length
    : 0;
  const rejectedCount = Array.isArray(applications)
    ? (applications as GrantApplicationDto[]).filter(
        (a: GrantApplicationDto) =>
          getGrantApplicationStatusValue(a as { status: string | number }) ===
          GrantApplicationStatus.Rejected
      ).length
    : 0;

  const getStatusBadge = (status: string | number | undefined) => {
    const normalizedStatus = Number(status);

    if (isGrantApprovedStatus(normalizedStatus))
      return (
        <span className="status-badge approved">
          {t('grants.list.approved')}
        </span>
      );
    if (normalizedStatus === GrantApplicationStatus.Rejected)
      return (
        <span className="status-badge rejected">
          {t('grants.list.rejected')}
        </span>
      );
    return (
      <span className="status-badge pending">{t('grants.list.pending')}</span>
    );
  };

  if (isLoading) {
    return (
      <div className="grants-hub-view loading-state">
        <header className="view-header">
          <div className="header-content">
            <Skeleton variant="text" width={200} height={32} />
            <Skeleton variant="text" width={300} height={20} />
          </div>
        </header>

        <section className="status-section">
          <Skeleton variant="text" width={150} height={24} />
          <div className="status-cards-grid">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rect" width="100%" height={100} />
            ))}
          </div>
        </section>

        <section className="upcoming-galas-section">
          <Skeleton variant="text" width={180} height={24} />
          <div className="galas-group-list">
            {[1, 2].map((i) => (
              <Skeleton key={i} variant="rect" width="100%" height={150} />
            ))}
          </div>
        </section>
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
          type="button"
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
          <FontAwesomeIcon icon={faArrowTrendUp} className="title-icon" />
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
          <FontAwesomeIcon icon={faLayerGroup} className="title-icon" />
          {t('grants.list.upcomingGalas')}
        </h2>

        <div className="galas-group-list">
          {galasWithApplications.length === 0 ? (
            <div className="empty-state">
              <p>{t('grants.list.noApplications')}</p>
            </div>
          ) : (
            galasWithApplications.map((galaGroup) => {
              const galaRaw = (galas as GalaDto[]).find(
                (g) => g.id === galaGroup.galaId || g.Id === galaGroup.galaId
              ) ||
                (galas as GalaDto[]).find(
                  (g) =>
                    g.name === galaGroup.galaTitle ||
                    g.Name === galaGroup.galaTitle
                ) || {
                  name: galaGroup.galaTitle,
                  eventDate:
                    (galaGroup.applications[0] as GrantApplicationDto)
                      ?.submittedAt ||
                    (galaGroup.applications[0] as GrantApplicationDto)
                      ?.createdAt,
                };
              const gala = galaRaw as GalaDto;

              return (
                <div key={galaGroup.galaId} className="gala-group-card">
                  <header className="gala-group-header">
                    <div className="gala-meta">
                      <h3>
                        {String(gala.name || gala.Name || galaGroup.galaTitle)}
                      </h3>
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
                    <div className="app-count-badge">
                      {galaGroup.applications.length}
                    </div>
                  </header>

                  <div className="nested-apps-list">
                    {galaGroup.applications.map((app) => {
                      const galaIdForRedirect =
                        (gala as Record<string, unknown>).id ||
                        galaGroup.galaId;
                      return (
                        <div
                          key={String(app.id || app.Id || galaGroup.galaId)}
                          className="nested-app-item"
                          onClick={() =>
                            navigate(
                              `/dashboard/galas/${galaIdForRedirect}/grants`
                            )
                          }
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="app-icon-box">
                            <FontAwesomeIcon icon={faClock} />
                          </div>
                          <div className="app-details">
                            <h4>
                              {String(app.grantName || app.GrantName || '')}
                            </h4>
                            <p className="interview-info">
                              {t('grants.list.interview')}{' '}
                              {app.interviewDate
                                ? new Date(
                                    app.interviewDate as string
                                  ).toLocaleDateString()
                                : getGrantApplicationStatusLabel(
                                    getGrantApplicationStatusValue(
                                      app as { status: string | number }
                                    )
                                  )}{' '}
                              {t('grants.list.at')}
                            </p>
                            <p className="submission-date">
                              {t('grants.list.submittedOn')}{' '}
                              {new Date(
                                (app.submittedAt || app.createdAt) as string
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="app-actions">
                            {getStatusBadge(app.status as string | number)}
                            <FontAwesomeIcon
                              icon={faChevronRight}
                              className="chevron"
                            />
                          </div>
                        </div>
                      );
                    })}
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
