import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import galasData from '../../data/galas.json';
import './Galas.scss';

export default function DiscoverGalas() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Active', 'Upcoming', 'Planned', 'Past'];

  // Categorize
  const activeGalas = galasData.filter(g => g.status === 'Active');
  const upcomingGalas = galasData.filter(g => g.status === 'Upcoming');
  const pastGalas = galasData.filter(g => g.status === 'Past');

  return (
    <div className="galas-container">
      <header className="galas-header">
        <h1>Discover Galas</h1>
        <p>Exclusive networking events for entrepreneurs</p>
      </header>

      <div className="galas-filters">
        {filters.map(f => (
          <button 
            key={f} 
            className={`filter-pill ${activeFilter === f ? 'active' : ''}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {(activeFilter === 'All' || activeFilter === 'Active') && activeGalas.length > 0 && (
        <section className="galas-section">
          <h2 className="section-title">
            <span role="img" aria-label="fire">🔥</span> Active galas <span className="count">({activeGalas.length})</span>
          </h2>
          {activeGalas.map(gala => (
            <GalaCard key={gala.id} gala={gala} onClick={() => navigate(`/dashboard/galas/${gala.id}`)} />
          ))}
        </section>
      )}

      {(activeFilter === 'All' || activeFilter === 'Upcoming') && upcomingGalas.length > 0 && (
        <section className="galas-section">
          <h2 className="section-title">
            <span role="img" aria-label="clock">🕒</span> Upcoming <span className="count">({upcomingGalas.length})</span>
          </h2>
          {upcomingGalas.map(gala => (
            <GalaCard key={gala.id} gala={gala} onClick={() => navigate(`/dashboard/galas/${gala.id}`)} />
          ))}
        </section>
      )}

      {(activeFilter === 'All' || activeFilter === 'Past') && pastGalas.length > 0 && (
        <section className="galas-section">
          <h2 className="section-title">
            <span role="img" aria-label="box">📦</span> Past <span className="count">({pastGalas.length})</span>
          </h2>
          {pastGalas.map(gala => (
            <GalaCard key={gala.id} gala={gala} onClick={() => navigate(`/dashboard/galas/${gala.id}`)} />
          ))}
        </section>
      )}

    </div>
  );
}

function GalaCard({ gala, onClick }: { gala: any, onClick: () => void }) {
  return (
    <div className="gala-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="card-image-wrapper">
        <img src={gala.imageUrl} alt={gala.title} />
        <div className={`status-badge ${gala.status.toLowerCase()}`}>
          {gala.status}
        </div>
        <button className="bookmark-btn" onClick={(e) => { e.stopPropagation(); console.log('bookmark'); }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      </div>
      <div className="card-content">
        <h3>{gala.title}</h3>
        <div className="detail-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          <span>{gala.date}</span>
        </div>
        <div className="detail-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <span>{gala.location}</span>
        </div>
        
        <div className="card-footer">
          <div className="attendees">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            {gala.attendees} applied
          </div>
          <div className="prize-pool">${gala.prizePool.toLocaleString()}</div>
        </div>

        <button className="btn-details" onClick={(e) => { e.stopPropagation(); onClick(); }}>
          View Details 
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><polyline points="5 12 19 12"></polyline><polyline points="12 5 19 12 12 19"></polyline></svg>
        </button>
      </div>
    </div>
  );
}
