import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Dashboard.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faCalendarDays,
  faCheckCircle,
  faCog,
  faHome,
  faLayerGroup,
  faLocationDot,
  faTrophy,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { useGetProfileQuery } from '../../Services/Api/module/UserApi';
import {
  useGetGalasQuery,
  useGetMyApplicationsQuery,
} from '../../Services/Api/module/GalaApi';
import { useGetNotificationsQuery } from '../../Services/Api/module/NotificationApi';
import { useWalletContext } from '../../Context/WalletContext';
import {
  getGrantApplicationStatusLabel,
  getGrantApplicationStatusValue,
  isGrantApprovedStatus,
  isGrantPendingStatus,
} from '../../Shared/GrantApplicationStatus';

export type DashboardOutletContext = {
  profile: any;
  profileLoading: boolean;
  profileError: unknown;
};

function DashboardHomeContent({
  nextGala,
  totalApps,
  pendingApps,
  approvedApps,
  applications,
  t,
}: Readonly<{
  nextGala: any;
  totalApps: number;
  pendingApps: number;
  approvedApps: number;
  applications: any[];
  t: any;
}>) {
  const getLocalizedStatus = (app: any) => {
    const statusLabel = getGrantApplicationStatusLabel(
      getGrantApplicationStatusValue(app)
    );

    const statusMap: Record<string, string> = {
      Draft: t('dashboard.status.draft'),
      Pending: t('dashboard.status.pending'),
      'In Review': t('dashboard.status.inReview'),
      Approved: t('dashboard.status.approved'),
      Rejected: t('dashboard.status.rejected'),
      Winner: t('dashboard.status.winner'),
      'Approved For Interview': t('dashboard.status.approvedForInterview'),
    };

    return {
      label: statusMap[statusLabel] || statusLabel,
      className: statusLabel.toLowerCase().replace(/\s+/g, '-'),
    };
  };

  return (
    <div className="dashboard-main-column">
      {nextGala ? (
        <div className="hero-card gala-card-premium">
          <div className="gala-badge">✨ {t('dashboard.nextGala')}</div>
          <h1 className="gala-title">{nextGala.name}</h1>
          <div className="gala-details">
            <span>
              <FontAwesomeIcon icon={faCalendarDays} />{' '}
              {new Date(nextGala.eventDate).toLocaleDateString('en-GB')}
            </span>
            <span>
              <FontAwesomeIcon icon={faLocationDot} /> {nextGala.city || nextGala.venue || 'TBD'}
            </span>
          </div>
          <Link to={`/dashboard/galas/${nextGala.id}`} className="btn-light">
            {t('dashboard.viewDetails')} &rarr;
          </Link>
        </div>
      ) : (
        <div className="hero-card gala-card-premium empty">
          <h1 className="gala-title">{t('dashboard.stayTuned')}</h1>
          <p>{t('dashboard.discoverSoon')}</p>
          <Link to="/dashboard/galas" className="btn-light">
            {t('dashboard.discoverGalas')} &rarr;
          </Link>
        </div>
      )}

      <section className="status-section-modern">
        <div className="status-item apps">
          <div className="label">{t('dashboard.applications')}</div>
          <div className="value">{totalApps}</div>
        </div>
        <div className="status-item pending">
          <div className="label">{t('dashboard.pending')}</div>
          <div className="value">{pendingApps}</div>
        </div>
        <div className="status-item approved">
          <div className="label">{t('dashboard.approved')}</div>
          <div className="value">{approvedApps}</div>
        </div>
      </section>

      <section className="recent-activity-modern">
        <div className="section-header">
          <h3>{t('dashboard.recentActivity')}</h3>
          <Link to="/dashboard/grants">{t('dashboard.seeAll')}</Link>
        </div>
        <div className="activity-list-modern">
          {applications.length > 0 ? (
            applications.slice(0, 3).map((app: any) => {
              const status = getLocalizedStatus(app);
              return (
                <div key={app.id} className="activity-item-premium">
                  <div className="icon-box">
                    <FontAwesomeIcon icon={faCheckCircle} />
                  </div>
                  <div className="content">
                    <p>
                      {t('dashboard.appliedTo')} <strong>{app.grantName || t('dashboard.grant')}</strong>
                    </p>
                    <span>
                      {app.submittedAt
                        ? new Date(app.submittedAt).toLocaleDateString()
                        : t('dashboard.recently')}
                    </span>
                  </div>
                  <div className={`status-tag ${status.className}`}>
                    {status.label}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="empty">{t('dashboard.noRecentActivity')}</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation('private');
  const { account, connectWallet, disconnectWallet, isConnecting } = useWalletContext();
  const isDashboardRoot = location.pathname === '/dashboard';

  const {
    data: profileResponse,
    isLoading: profileLoading,
    error: profileError,
  } = useGetProfileQuery(undefined);
  const { data: galasResponse } = useGetGalasQuery({});
  const { data: appsResponse } = useGetMyApplicationsQuery({});
  const { data: notificationsResponse } = useGetNotificationsQuery({});
  const profile = profileResponse?.data;
  const galas = galasResponse?.data.items ?? [];
  const applications = appsResponse?.data ?? [];
  const notifications = notificationsResponse?.data ?? [];
  const unreadNotifications = notifications.filter((item: any) => !item.isRead).length;

  // Find Next Gala (soonest upcoming)
  const upcomingGalas = galas
    .filter((g: any) => g.status === 1 || g.status === 2)
    .sort(
      (a: any, b: any) =>
        new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
    );

  const nextGala = upcomingGalas[0];

  // Calculate Stats
  const pendingApps = Array.isArray(applications)
    ? applications.filter(
      (a: any) => isGrantPendingStatus(getGrantApplicationStatusValue(a))
    ).length
    : 0;
  const approvedApps = Array.isArray(applications)
    ? applications.filter(
      (a: any) => isGrantApprovedStatus(getGrantApplicationStatusValue(a))
    ).length
    : 0;
  const totalApps = Array.isArray(applications) ? applications.length : 0;

  const displayName = profile?.firstName || 'User';
  const avatarUrl =
    profile?.avatarUrl ||
    `https://ui-avatars.com/api/?name=${displayName}&background=1e293b&color=fff`;

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation for Desktop (Replaces Mobile Bottom Nav) */}
      {/* Sidebar Navigation for Desktop */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon-container">
            <FontAwesomeIcon icon={faLayerGroup} />
          </div>
          <span className="logo-text">Vision PME</span>
        </div>

        <nav className="sidebar-nav">
          <Link
            to="/dashboard"
            className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''
              }`}
          >
            <FontAwesomeIcon icon={faHome} /> <span>{t('dashboard.sidebar.dashboard')}</span>
          </Link>
          <Link
            to="/dashboard/galas"
            className={`nav-item ${location.pathname.includes('/dashboard/galas') ? 'active' : ''
              }`}
          >
            <FontAwesomeIcon icon={faCalendarDays} /> <span>{t('dashboard.sidebar.galas')}</span>
          </Link>
          <Link
            to="/dashboard/grants"
            className={`nav-item ${location.pathname.includes('/dashboard/grants') ? 'active' : ''
              }`}
          >
            <FontAwesomeIcon icon={faTrophy} /> <span>{t('dashboard.sidebar.grants')}</span>
          </Link>
          <Link
            to="/dashboard/profile"
            className={`nav-item ${location.pathname.includes('/dashboard/profile') ? 'active' : ''
              }`}
          >
            <FontAwesomeIcon icon={faUser} /> <span>{t('dashboard.sidebar.profile')}</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          {/* Wallet Connection */}
          <div className="wallet-section">
            {account ? (
              <div className="wallet-pill connected" title={account}>
                <div className="dot" />
                <span>{`${account.slice(0, 6)}...${account.slice(-4)}`}</span>
                <button className="disconnect-btn" onClick={disconnectWallet}>✕</button>
              </div>
            ) : (
              <button 
                className="btn-connect-wallet" 
                onClick={connectWallet}
                disabled={isConnecting}
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>

          <div className="user-mini-profile">
            <img src={avatarUrl} alt="Avatar" />
            <div className="user-details">
              <p className="name">{displayName}</p>
              <p className="email">{profile?.email || 'User'}</p>
            </div>
            <Link
              to="/dashboard/profile/settings"
              className="settings-link"
              title="Settings"
            >
              <FontAwesomeIcon icon={faCog} />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-content">
        {/* Top Header */}
        <header className="dashboard-header-modern">
          <div className="header-right-actions">
            <button
              className="notification-bell"
              onClick={() => navigate('/dashboard/notifications')}
              title="Open notifications"
            >
              <FontAwesomeIcon icon={faBell} />
              {unreadNotifications > 0 && <span className="dot" />}
            </button>
            <div
              className="profile-pill"
              onClick={() => navigate('/dashboard/profile')}
            >
              <img src={avatarUrl} alt="Avatar" />
              <span>{displayName}</span>
            </div>
          </div>
        </header>

        {/* Dashboard Scrollable View */}
        <div className="dashboard-scrollable">
          {isDashboardRoot ? (
            <DashboardHomeContent
              nextGala={nextGala}
              totalApps={totalApps}
              pendingApps={pendingApps}
              approvedApps={approvedApps}
              applications={applications}
              t={t}
            />
          ) : (
            <Outlet
              context={{
                profile,
                profileLoading,
                profileError,
              }}
            />
          )}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="mobile-bottom-nav">
        <Link
          to="/dashboard"
          className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''
            }`}
        >
          <FontAwesomeIcon icon={faHome} /> <span>{t('dashboard.mobile.home')}</span>
        </Link>
        <Link
          to="/dashboard/galas"
          className={`nav-item ${location.pathname.includes('/dashboard/galas') ? 'active' : ''
            }`}
        >
          <FontAwesomeIcon icon={faCalendarDays} /> <span>{t('dashboard.mobile.galas')}</span>
        </Link>
        <Link
          to="/dashboard/grants"
          className={`nav-item ${location.pathname.includes('/dashboard/grants') ? 'active' : ''
            }`}
        >
          <FontAwesomeIcon icon={faTrophy} /> <span>{t('dashboard.mobile.grants')}</span>
        </Link>
        <Link
          to="/dashboard/profile"
          className={`nav-item ${location.pathname.includes('/dashboard/profile') ? 'active' : ''
            }`}
        >
          <FontAwesomeIcon icon={faUser} /> <span>{t('dashboard.mobile.profile')}</span>
        </Link>
      </nav>
    </div>
  );
}
