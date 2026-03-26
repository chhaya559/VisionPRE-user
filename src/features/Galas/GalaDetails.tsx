import { useParams, useNavigate } from 'react-router-dom';
import galasData from '../../data/galas.json';
import './GalaDetails.scss';

export default function GalaDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const gala = galasData.find(g => g.id === id);

  if (!gala) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Gala not found</div>;
  }

  // Format the prize pool shortcut ($15,000 -> $15K)
  const formatCompact = (num: number) => {
    return num >= 1000 ? `$${(num / 1000).toFixed(0)}K` : `$${num}`;
  };

  return (
    <div className="gala-details-container">
      
      {/* Hero Image Section */}
      <div className="hero-section" style={{ backgroundImage: `url(${gala.imageUrl})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-nav">
          <button className="icon-btn-round" onClick={() => navigate(-1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </button>
          <div className="right-actions">
            <button className="icon-btn-round">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
            </button>
            <button className="icon-btn-round">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
            </button>
          </div>
        </div>
        <div className="hero-content">
          <div className={`status-badge floating ${gala.status.toLowerCase()}`}>
            {gala.status.toUpperCase()}
          </div>
          <h1>{gala.title}</h1>
        </div>
      </div>

      {/* Main Content Details */}
      <div className="details-content">
        
        <div className="info-list">
          <div className="info-item">
            <div className="info-icon green-bg">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </div>
            <div className="info-text">
              <span className="label">Date & Time</span>
              <span className="val">{gala.date} • {gala.time}</span>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon green-bg">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
            <div className="info-text">
              <span className="label">Location</span>
              <span className="val">{gala.location}</span>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon green-bg">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <div className="info-text">
              <span className="label">Attendees</span>
              <span className="val">{gala.attendees} entrepreneurs</span>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon green-bg">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 21h8m-4-4v4m0-18v3m5 0h-10m12 0a2 2 0 0 1 2 2v2a7 7 0 0 1-14 0v-2a2 2 0 0 1 2-2h10z"/></svg>
            </div>
            <div className="info-text">
              <span className="label">Prize Pool</span>
              <span className="val">${gala.prizePool.toLocaleString()} in Grants</span>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h2>About Event</h2>
          <p>{gala.description}</p>
        </div>

        <div className="stats-cards">
          <div className="stat-card participants">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
            <strong>{gala.attendees}</strong>
            <span>Participants</span>
          </div>
          <div className="stat-card grants-count">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 21h8m-4-4v4m0-18v3m5 0h-10m12 0a2 2 0 0 1 2 2v2a7 7 0 0 1-14 0v-2a2 2 0 0 1 2-2h10z"/></svg>
            <strong>{gala.grants.length}</strong>
            <span>Grants</span>
          </div>
          <div className="stat-card prize">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <strong>{formatCompact(gala.prizePool)}</strong>
            <span>Prize Pool</span>
          </div>
        </div>

        {gala.program && gala.program.length > 0 && (
          <div className="program-section">
            <h2>Evening program</h2>
            {gala.program.map((p: any, i: number) => (
              <div key={i} className="program-item">
                <div className="program-time">{p.time}</div>
                <div className="program-content">
                  <h4>{p.title}</h4>
                  <p>{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      <div className="bottom-sticky-bar">
        <button className="btn-apply-grant" onClick={() => navigate(`/dashboard/galas/${gala.id}/grants`)}>
          Apply to a Grant 
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><polyline points="5 12 19 12"></polyline><polyline points="12 5 19 12 12 19"></polyline></svg>
        </button>
      </div>
    </div>
  );
}
