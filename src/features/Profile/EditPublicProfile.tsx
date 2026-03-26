import { useNavigate } from 'react-router-dom';
import './ProfileEdits.scss';

export default function EditPublicProfile() {
  const navigate = useNavigate();

  return (
    <div className="edit-profile-container">
      <header className="edit-profile-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="20" height="20"><polyline points="15 18 9 12 15 6"></polyline></svg>
          Edit Public Profile
        </button>
        <div style={{ height: '40px' }} /> {/* Spacer */}
        <div className="avatar-edit">
          <div className="avatar-circle">M</div>
          <div className="camera-icon">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
          </div>
        </div>
        <span className="change-photo">Change Photo</span>
      </header>

      <div className="edit-profile-form">
        {/* Personal Information */}
        <div className="section">
          <div className="section-header">
            <h3>Personal Information</h3>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" defaultValue="Marc-Antoine Blais" />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" defaultValue="marc@quackpreneur.ca" />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" defaultValue="+1 (514) 123-4567" />
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea defaultValue="I am Marc! Passionate entrepreneur focused on innovative tech solutions."></textarea>
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="section">
          <div className="section-header">
            <h3>Business Information</h3>
            <span className="step-badge">as From onboarding</span>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ margin: 0 }}>Company Name</label>
                <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 800 }}>Step 2</span>
              </div>
              <input type="text" defaultValue="Quackpreneur" />
            </div>
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ margin: 0 }}>Industry</label>
                <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 800 }}>Step 3</span>
              </div>
              <select defaultValue="Technology">
                <option>Technology</option>
                <option>Healthcare</option>
              </select>
            </div>
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ margin: 0 }}>Business Stage</label>
                <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 800 }}>Step 4</span>
              </div>
              <select defaultValue="Startup - First sales">
                <option>Startup - First sales</option>
                <option>Growth Stage</option>
              </select>
            </div>
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ margin: 0 }}>Business Description</label>
                <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 800 }}>Step 5</span>
              </div>
              <textarea defaultValue="We develop a platform that helps SMBs access financing and grow their business."></textarea>
            </div>
          </div>
        </div>

        {/* Entrepreneur Profile */}
        <div className="section">
          <div className="section-header">
            <h3>Entrepreneur Profile</h3>
            <span className="step-badge">as Step 6</span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: '#9ca3af', marginBottom: '16px' }}>Select all that apply</p>
          <div className="tags-grid">
            <span className="tag active">Startup</span>
            <span className="tag active">Innovation / Technology</span>
            <span className="tag">Woman entrepreneur</span>
            <span className="tag">Young entrepreneur</span>
            <span className="tag">Growth-stage</span>
            <span className="tag">Social impact</span>
            <span className="tag">Diverse background</span>
          </div>
        </div>

        {/* Your Goal */}
        <div className="section">
          <div className="section-header">
            <h3>Your Goal</h3>
            <span className="step-badge">as Step 7</span>
          </div>
          <div className="goals-list">
             <div className="goal-item active">
                <div className="icon-box">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                </div>
                <span>Meet other entrepreneurs</span>
             </div>
             <div className="goal-item">
                <div className="icon-box">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </div>
                <span>Apply for grants</span>
             </div>
             <div className="goal-item">
                <div className="icon-box">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                </div>
                <span>Grow my business</span>
             </div>
             <div className="goal-item">
                <div className="icon-box">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </div>
                <span>Attend galas</span>
             </div>
          </div>
        </div>

        <button className="btn-save" onClick={() => navigate(-1)}>Save Changes</button>
      </div>
    </div>
  );
}
