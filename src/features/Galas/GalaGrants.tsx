import { useParams, useNavigate } from 'react-router-dom';
import galasData from '../../data/galas.json';
import './GalaGrants.scss';

export default function GalaGrants() {
  const { id } = useParams();
  const navigate = useNavigate();

  const gala = galasData.find(g => g.id === id);

  if (!gala) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Gala not found</div>;
  }

  return (
    <div className="gala-grants-container">
      <header className="gala-grants-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back
        </button>
        <h1>Discover Grant</h1>
      </header>

      <div className="grants-list">
        {gala.grants.length === 0 ? (
          <p className="empty-state">No grants available for this gala yet.</p>
        ) : (
          gala.grants.map(grant => (
            <div key={grant.id} className="grant-card">
              <div className="grant-header">
                <h3>{grant.title}</h3>
                <span className={`status-badge ${grant.status.toLowerCase()}`}>{grant.status}</span>
              </div>
              <div className="grant-gala-ref">
                Gala: <span>{gala.title}</span>
              </div>
              
              <p className="grant-desc">{grant.description}</p>
              
              <div className="grant-pills">
                <span className="pill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg> {grant.amount.toLocaleString()}$</span>
                <span className="pill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg> {grant.category}</span>
                <span className="pill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> {grant.deadline}</span>
              </div>

              <div className="eligibility-section">
                <h4>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" className="text-green"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  Eligibility criteria
                </h4>
                <p>{grant.eligibility}</p>
              </div>

              <button className="btn-apply" onClick={() => navigate(`/dashboard/galas/${id}/apply/${grant.id}`)}>
                Apply to Grant
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
