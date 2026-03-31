import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import './Dashboard.scss';
import { useGetProfileQuery } from '../../Services/Api/module/UserApi';
import {
  useGetGalasQuery,
  useGetMyApplicationsQuery,
} from '../../Services/Api/module/GalaApi';

// Reusable SVG Icons
function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function HomeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function TrophyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 21h8m-4-4v4m0-18v3m5 0h-10m12 0a2 2 0 0 1 2 2v2a7 7 0 0 1-14 0v-2a2 2 0 0 1 2-2h10z" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboardRoot = location.pathname === '/dashboard';

  const { data: profileResponse } = useGetProfileQuery({});
  const { data: galasResponse } = useGetGalasQuery({});
  const { data: appsResponse } = useGetMyApplicationsQuery({});

  const profile = (profileResponse as any)?.data || {};
  const galas = (galasResponse as any)?.data?.items || [];
  const applications = (appsResponse as any)?.data || appsResponse || [];

  // Find Next Gala (soonest upcoming)
  const upcomingGalas = galas
    .filter(
      (g: any) => (g.status || g.Status) === 2 || (g.status || g.Status) === 1
    ) // Using 2 for Upcoming based on previous logic
    .sort(
      (a: any, b: any) =>
        new Date(a.eventDate || 0).getTime() -
        new Date(b.eventDate || 0).getTime()
    );

  const nextGala = upcomingGalas[0];

  // Calculate Stats
  const pendingApps = Array.isArray(applications)
    ? applications.filter(
      (a: any) =>
        (a.status || a.Status) === 'Pending' || (a.status || a.Status) === 1
    ).length
    : 0;
  const approvedApps = Array.isArray(applications)
    ? applications.filter(
      (a: any) =>
        (a.status || a.Status) === 'Approved' || (a.status || a.Status) === 2
    ).length
    : 0;
  const totalApps = Array.isArray(applications) ? applications.length : 0;

  const displayName = profile.firstName || 'User';
  const avatarUrl =
    profile.avatarUrl ||
    `https://ui-avatars.com/api/?name=${displayName}&background=1e293b&color=fff`;

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation for Desktop (Replaces Mobile Bottom Nav) */}
      {/* Sidebar Navigation for Desktop */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon-container">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#45cd86" />
              <path
                d="M2 17L12 22L22 17"
                stroke="#45cd86"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="#45cd86"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="logo-text">Vision PME</span>
        </div>

        <nav className="sidebar-nav">
          <Link
            to="/dashboard"
            className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''
              }`}
          >
            <HomeIcon /> <span>Dashboard</span>
          </Link>
          <Link
            to="/dashboard/galas"
            className={`nav-item ${location.pathname.includes('/dashboard/galas') ? 'active' : ''
              }`}
          >
            <CalendarIcon /> <span>Galas</span>
          </Link>
          <Link
            to="/dashboard/grants"
            className={`nav-item ${location.pathname.includes('/dashboard/grants') ? 'active' : ''
              }`}
          >
            <TrophyIcon /> <span>Grants & Applications</span>
          </Link>
          <Link
            to="/dashboard/profile"
            className={`nav-item ${location.pathname.includes('/dashboard/profile') ? 'active' : ''
              }`}
          >
            <UserIcon /> <span>Account Settings</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="user-mini-profile">
            <img src={avatarUrl} alt="Avatar" />
            <div className="user-details">
              <p className="name">{displayName}</p>
              <p className="email">{profile.email || 'User'}</p>
            </div>
            <Link
              to="/dashboard/profile/settings"
              className="settings-link"
              title="Settings"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-content">
        {/* Top Header */}
        <header className="dashboard-header-modern">
          <div className="header-right-actions">
            <button className="notification-bell">
              <BellIcon />
              <span className="dot" />
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
            <div className="dashboard-main-column">
              {/* Hero Card -> Gala */}
              {nextGala ? (
                <div className="hero-card gala-card-premium">
                  <div className="gala-badge">✨ NEXT GALA</div>
                  <h1 className="gala-title">{nextGala.name}</h1>
                  <div className="gala-details">
                    <span>
                      <CalendarIcon />{' '}
                      {new Date(nextGala.eventDate).toLocaleDateString('en-GB')}
                    </span>
                    <span>
                      <MapPinIcon /> {nextGala.city || nextGala.venue || 'TBD'}
                    </span>
                  </div>
                  <Link
                    to={`/dashboard/galas/${nextGala.id || nextGala.Id}`}
                    className="btn-light"
                  >
                    View Details &rarr;
                  </Link>
                </div>
              ) : (
                <div className="hero-card gala-card-premium empty">
                  <h1 className="gala-title">Stay Tuned!</h1>
                  <p>Discover new opportunities soon.</p>
                  <Link to="/dashboard/galas" className="btn-light">
                    Discover Galas &rarr;
                  </Link>
                </div>
              )}

              {/* Status Section */}
              <section className="status-section-modern">
                <div className="status-item apps">
                  <div className="label">Applications</div>
                  <div className="value">{totalApps}</div>
                </div>
                <div className="status-item pending">
                  <div className="label">Pending</div>
                  <div className="value">{pendingApps}</div>
                </div>
                <div className="status-item approved">
                  <div className="label">Approved</div>
                  <div className="value">{approvedApps}</div>
                </div>
              </section>

              {/* Recent Activity */}
              <section className="recent-activity-modern">
                <div className="section-header">
                  <h3>Recent Activity</h3>
                  <Link to="/dashboard/grants">See All</Link>
                </div>
                <div className="activity-list-modern">
                  {applications.length > 0 ? (
                    applications.slice(0, 3).map((app: any) => {
                      const statusStr = String(
                        app.status || 'Pending'
                      ).toLowerCase();
                      return (
                        <div
                          key={app.id || app.Id}
                          className="activity-item-premium"
                        >
                          <div className="icon-box">
                            <CheckCircleIcon />
                          </div>
                          <div className="content">
                            <p>
                              Applied to{' '}
                              <strong>{app.grantName || 'Grant'}</strong>
                            </p>
                            <span>
                              {app.createdAt
                                ? new Date(app.createdAt).toLocaleDateString()
                                : 'Recently'}
                            </span>
                          </div>
                          <div className={`status-tag ${statusStr}`}>
                            {app.status || 'Pending'}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="empty">No recent activity found.</p>
                  )}
                </div>
              </section>
            </div>
          ) : (
            <Outlet />
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
          <HomeIcon /> <span>Home</span>
        </Link>
        <Link
          to="/dashboard/galas"
          className={`nav-item ${location.pathname.includes('/dashboard/galas') ? 'active' : ''
            }`}
        >
          <CalendarIcon /> <span>Galas</span>
        </Link>
        <Link
          to="/dashboard/grants"
          className={`nav-item ${location.pathname.includes('/dashboard/grants') ? 'active' : ''
            }`}
        >
          <TrophyIcon /> <span>Grants</span>
        </Link>
        <Link
          to="/dashboard/profile"
          className={`nav-item ${location.pathname.includes('/dashboard/profile') ? 'active' : ''
            }`}
        >
          <UserIcon /> <span>Profile</span>
        </Link>
      </nav>
    </div>
  );
}
