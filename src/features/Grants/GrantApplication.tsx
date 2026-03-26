import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import galasData from '../../data/galas.json';
import './GrantApplication.scss';

export default function GrantApplication() {
  const { id, grantId } = useParams();
  const navigate = useNavigate();

  const gala = galasData.find(g => g.id === id);
  const grant = gala?.grants.find(g => g.id === grantId);

  const [selectedDay, setSelectedDay] = useState(12);
  const [selectedTime, setSelectedTime] = useState('10:30 AM');

  if (!gala || !grant) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Grant not found</div>;
  }

  const days = Array.from({ length: 28 }, (_, i) => i + 1);
  const timeSlots = ['9:00 AM', '10:30 AM', '12:00 PM', '2:00 PM', '4:00 PM', '8:00 PM'];

  return (
    <div className="grant-app-container">
      <header className="grant-app-header">
        <div className="back-link" onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><polyline points="15 18 9 12 15 6"></polyline></svg>
          Back
        </div>
        <h1>Apply for Grant</h1>
      </header>

      <div className="grant-summary-box">
        <h2>{grant.title}</h2>
        <span className="prize-info">${grant.amount.toLocaleString()} Prize • 5 Winners</span>
        <p>The prize is divided between all winners</p>
      </div>

      <form className="grant-form" onSubmit={(e) => { e.preventDefault(); console.log('submitted'); navigate('/dashboard/grants'); }}>
        <div className="form-group">
          <label>Company Name</label>
          <input type="text" placeholder="Quackpreneur" defaultValue="Quackpreneur" />
        </div>

        <div className="form-group">
          <label>Industry</label>
          <select defaultValue="Select industry">
            <option disabled>Select industry</option>
            <option>Technology</option>
            <option>Healthcare</option>
            <option>E-commerce</option>
            <option>Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Motivation</label>
          <span className="motivation-hint">Explain why you deserve this grant</span>
          <textarea placeholder="I believe our innovative approach to..." defaultValue="I believe our innovative approach to..."></textarea>
        </div>

        <div className="scheduler-section">
          <div className="scheduler-header">
            <div className="icon-bg">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </div>
            <div className="header-text">
              <h3>Schedule Interview</h3>
              <p>Schedule your interview with an agent</p>
            </div>
          </div>

          <div className="calendar-mock">
            <div className="cal-header">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><polyline points="15 18 9 12 15 6"></polyline></svg>
               February 2026
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
            <div className="cal-grid">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(d => <span key={d} className="day-name">{d}</span>)}
              <span className="day empty"></span><span className="day empty"></span><span className="day empty"></span><span className="day empty"></span><span className="day empty"></span>
              {days.map(d => (
                <span 
                  key={d} 
                  className={`day ${selectedDay === d ? 'selected' : ''}`}
                  onClick={() => setSelectedDay(d)}
                >
                  {d}
                </span>
              ))}
            </div>
          </div>

          <p style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '12px' }}>Choose a time slot *</p>
          <div className="time-slots">
            {timeSlots.map(slot => (
              <div 
                key={slot} 
                className={`time-slot ${selectedTime === slot ? 'active' : ''}`}
                onClick={() => setSelectedTime(slot)}
              >
                {slot}
              </div>
            ))}
          </div>
        </div>

        <div className="checkbox-group">
          <div className="checkbox-item">
            <input type="checkbox" id="confirm" defaultChecked />
            <label htmlFor="confirm">I confirm that all information provided is accurate and complete</label>
          </div>
          <div className="checkbox-item">
            <input type="checkbox" id="terms" />
            <label htmlFor="terms">I agree to the <a href="#">terms and conditions</a> and <a href="#">privacy policy</a></label>
          </div>
        </div>

        <div className="actions">
          <button type="submit" className="btn-submit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            Submit Application
          </button>
          <button type="button" className="btn-draft">Save as Draft</button>
        </div>

        <div className="notice-box">
          <div className="notice-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          </div>
          <div className="notice-content">
            <h4>Application Review Time</h4>
            <p>Applications are typically reviewed within 2-3 weeks. You'll receive an email notification once your application status changes.</p>
          </div>
        </div>
      </form>
    </div>
  );
}
