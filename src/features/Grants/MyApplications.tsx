import './MyApplications.scss';

export default function MyApplications() {
  return (
    <div className="my-apps-container">
      <header className="my-apps-header">
        <h1>My applications</h1>
        <p>Track your grant application status</p>
      </header>

      <div className="my-apps-content">
        <div className="next-gala-card">
          <div className="gala-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
            Next gala
          </div>
          <h2>Gala Startup Sherbrooke</h2>
          <p>September 9, 2026</p>
          <button className="btn-view-grants">
            View Grants 
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>

        <section className="status-section">
          <h3 className="section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
            Your status
          </h3>
          <div className="status-grid">
            <div className="status-card pending">
              <div className="icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <div className="val">3</div>
              <div className="label">Pending</div>
            </div>
            <div className="status-card approved">
              <div className="icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <div className="val">0</div>
              <div className="label">Approved</div>
            </div>
            <div className="status-card rejected">
              <div className="icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg>
              </div>
              <div className="val">1</div>
              <div className="label">Rejected</div>
            </div>
          </div>
        </section>

        <section className="upcoming-section">
          <h3 className="section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
            Upcoming galas
          </h3>
          
          <div className="gala-group">
            <div className="gala-header">
              <div className="text">
                <h3>Gala Vision Montréal 2026</h3>
                <span className="date">on April 14, 2026</span>
              </div>
              <div className="badge">3</div>
            </div>

            <div className="app-items">
              <ApplicationItem 
                title="Innovation Technology..." 
                interview="Interview: 2/25/2026 at 14h00 - 14h30"
                submitted="Submitted on 2/24/2026"
              />
              <ApplicationItem 
                title="Social Entrepreneurship..." 
                interview="Interview: 2/25/2026 at 14h00 - 14h30"
                submitted="Submitted on 2/24/2026"
              />
              <ApplicationItem 
                title="Innovation Technology..." 
                interview="Interview: 2/25/2026 at 14h00 - 14h30"
                submitted="Submitted on 2/24/2026"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ApplicationItem({ title, interview, submitted }: any) {
  return (
    <div className="app-item">
      <div className="app-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="24" height="24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
      </div>
      <div className="app-info">
        <h4>{title}</h4>
        <div className="interview">{interview}</div>
        <div className="submitted">{submitted}</div>
      </div>
      <div className="app-status">Pending</div>
    </div>
  );
}
