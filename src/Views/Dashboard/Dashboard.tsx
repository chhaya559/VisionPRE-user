import { Link, Outlet, useLocation } from 'react-router-dom';
import './Dashboard.scss';

// Reusable SVG Icons
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
);
const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
);
const TrophyIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8m-4-4v4m0-18v3m5 0h-10m12 0a2 2 0 0 1 2 2v2a7 7 0 0 1-14 0v-2a2 2 0 0 1 2-2h10z"/></svg>
);
const DocumentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);
const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);
const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);
const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);
const SparklesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18"></path><path d="M3 12h18"></path><path d="m5 5 14 14"></path><path d="m19 5-14 14"></path></svg>
);

export default function Dashboard() {
  const location = useLocation();
  const isDashboardRoot = location.pathname === '/dashboard';

  return (
    <div className="dashboard-layout">
        
      {/* Sidebar Navigation for Desktop (Replaces Mobile Bottom Nav) */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
            <span className="logo-icon">🌿</span>
            <span className="logo-text">Vision PME</span>
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}><HomeIcon /> <span>Home</span></Link>
          <Link to="/dashboard/galas" className={`nav-item ${location.pathname.includes('/dashboard/galas') ? 'active' : ''}`}><CalendarIcon /> <span>Galas</span></Link>
          <Link to="/dashboard/grants" className={`nav-item ${location.pathname === '/dashboard/grants' ? 'active' : ''}`}><TrophyIcon /> <span>Grants</span></Link>
          <Link to="/dashboard/profile" className={`nav-item ${location.pathname === '/dashboard/profile' ? 'active' : ''}`}><UserIcon /> <span>Profile</span></Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-content">
          
        {/* Top Header - Only show on dashboard root or as needed */}
        {isDashboardRoot && (
          <header className="dashboard-header">
            <div className="header-left">
              <div className="user-avatar">
                <img src="https://ui-avatars.com/api/?name=Marc+Antoine&background=1e293b&color=fff" alt="User" />
              </div>
              <div className="user-info">
                <span className="welcome-text">Welcome back,</span>
                <h2 className="user-name">Marc-Antoine</h2>
              </div>
            </div>
            <div className="header-actions">
              <button className="icon-btn search-btn" title="Search">
                  <SearchIcon />
              </button>
              <button className="icon-btn notification-btn" title="Notifications">
                  <BellIcon />
                  <span className="badge"></span>
              </button>
            </div>
          </header>
        )}

        {/* Dashboard Scrollable View */}
        <div className="dashboard-scrollable">
            {isDashboardRoot ? (
              <div className="dashboard-main-column">
                      
                  {/* Hero Card -> Gala */}
                  <div className="hero-card gala-card">
                      <div className="gala-badge">✨ NEXT GALA</div>
                      <div className="gala-icon-bg"><UserIcon /></div>
                      
                      <h1 className="gala-title">Gala Vision Montreal<br/>2026</h1>
                      
                      <div className="gala-details">
                          <span><CalendarIcon /> April 14, 2026</span>
                          <span><MapPinIcon /> Palais des congrès, Montréal</span>
                      </div>

                      <div className="countdown-timer">
                          <div className="time-box"><strong>49</strong><span>DAYS</span></div>
                          <div className="time-box"><strong>5</strong><span>HOURS</span></div>
                          <div className="time-box"><strong>14</strong><span>MIN</span></div>
                          <div className="time-box"><strong>34</strong><span>SEC</span></div>
                      </div>

                      <Link to="/dashboard/galas/gala-vision-mtl-2026" className="btn-light">View gala Details &rarr;</Link>
                  </div>

                  {/* Status Section */}
                  <section className="status-section">
                      <h3 className="section-title"><span>📈</span> Your status</h3>
                      <div className="status-grid">
                          <div className="status-card blue">
                              <div className="status-icon"><DocumentIcon /></div>
                              <div className="status-val">3</div>
                              <div className="status-label">Applications</div>
                          </div>
                          <div className="status-card orange">
                              <div className="status-icon"><ClockIcon /></div>
                              <div className="status-val">3</div>
                              <div className="status-label">Pending</div>
                          </div>
                          <div className="status-card green">
                              <div className="status-icon"><CheckCircleIcon /></div>
                              <div className="status-val">0</div>
                              <div className="status-label">Approved</div>
                          </div>
                      </div>
                  </section>

                  {/* Bottom Feeds: Announcements & Activity side-by-side */}
                  <div className="bottom-feeds-grid">
                      {/* Announcements */}
                      <section className="feed-section announcements">
                          <h3 className="section-title"><span>📣</span> Latest Announcements</h3>
                          <div className="feed-list">
                              <div className="feed-item small-card">
                                  <div className="feed-icon blue-bg"><SparklesIcon /></div>
                                  <div className="feed-content">
                                      <h4>2026 is now open for applications!</h4>
                                      <span>February 23</span>
                                  </div>
                              </div>
                              <div className="feed-item small-card">
                                  <div className="feed-icon green-bg"><CalendarIcon /></div>
                                  <div className="feed-content">
                                      <h4>Le Gala Innovation Québec is announced for June 2026.</h4>
                                      <span>February 23</span>
                                  </div>
                              </div>
                          </div>
                      </section>

                      {/* Recent Activity */}
                      <section className="feed-section activity">
                          <h3 className="section-title"><span>🚀</span> Recent Activity</h3>
                          <div className="feed-list">
                              <div className="feed-item card-style">
                                  <div className="feed-icon green-bg"><StarIcon /></div>
                                  <div className="feed-content">
                                      <div className="feed-header">
                                          <h4>Grant Application Approved!</h4>
                                          <span className="feed-time">2 mins ago</span>
                                      </div>
                                      <p>Your Innovation Technology Grant application has been approved. Congratulations!</p>
                                  </div>
                              </div>
                              <div className="feed-item card-style">
                                  <div className="feed-icon orange-bg"><CalendarIcon /></div>
                                  <div className="feed-content">
                                      <div className="feed-header">
                                          <h4>Interview Rescheduled</h4>
                                          <span className="feed-time">15 mins ago</span>
                                      </div>
                                      <p>Your interview has been rescheduled to March 15, 2026</p>
                                  </div>
                              </div>
                          </div>
                      </section>
                  </div>

              </div>
            ) : (
                <Outlet />
            )}
        </div>
      </main>

      {/* Mobile Bottom Nav (Visible only on mobile) */}
      <nav className="mobile-bottom-nav">
        <Link to="/dashboard" className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
            <div className="nav-icon"><HomeIcon /></div>
            <span>Home</span>
        </Link>
        <Link to="/dashboard/galas" className={`nav-item ${location.pathname.includes('/dashboard/galas') ? 'active' : ''}`}>
            <div className="nav-icon"><CalendarIcon /></div>
            <span>Galas</span>
        </Link>
        <Link to="/dashboard/grants" className={`nav-item ${location.pathname === '/dashboard/grants' ? 'active' : ''}`}>
            <div className="nav-icon"><TrophyIcon /></div>
            <span>Grants</span>
        </Link>
        <Link to="/dashboard/profile" className={`nav-item ${location.pathname === '/dashboard/profile' ? 'active' : ''}`}>
            <div className="nav-icon"><UserIcon /></div>
            <span>Profile</span>
        </Link>
      </nav>

    </div>
  );
}
