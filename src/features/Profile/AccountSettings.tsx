import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileEdits.scss';

export default function AccountSettings() {
  const navigate = useNavigate();
  const [toggles, setToggles] = useState({
    email: true,
    push: true,
    newGalas: false,
    updates: true,
  });

  const toggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="edit-profile-container">
      <header className="edit-profile-header secondary">
        <button className="back-btn" onClick={() => navigate(-1)} style={{ position: 'static', marginBottom: '16px', padding: 0 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="20" height="20"><polyline points="15 18 9 12 15 6"></polyline></svg>
          Settings
        </button>
        <div className="header-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <div>
              <h1>Settings</h1>
              <p>Manage your app preferences</p>
           </div>
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24" style={{ opacity: 0.8 }}><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        </div>
      </header>

      <div className="edit-profile-form">
        {/* Premium Card */}
        <div className="premium-card">
          <div className="pc-header">
            <div className="pc-main">
              <div className="pc-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 9 6-9"></path><path d="M12 3l9 6-9 9-9-9 9-6z"></path></svg>
              </div>
              <div className="pc-text">
                <h4>Premium Member</h4>
                <p>Annual Plan</p>
              </div>
            </div>
            <div className="pc-badge">ACTIVE</div>
          </div>
          <div className="pc-meta">
            <div className="meta-item">
              <span className="label">Next billing</span>
              <span className="val">Feb 28, 2025</span>
            </div>
            <div className="meta-item right">
               <span className="label">Amount</span>
               <span className="val">$99.00/year</span>
            </div>
          </div>
          <button className="btn-manage">Manage Subscription &rarr;</button>
        </div>

        {/* Notifications */}
        <div className="section">
           <div className="section-header">
             <h3 style={{ border: 'none', padding: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" color="#10b981"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
               Notifications
             </h3>
           </div>
           <div className="settings-list">
             <div className="setting-toggle">
               <div className="st-info">
                 <h4>Email Notifications</h4>
                 <p>Receive updates via email</p>
               </div>
               <div className={`toggle-switch ${toggles.email ? 'on' : ''}`} onClick={() => toggle('email')}></div>
             </div>
             <div className="setting-toggle">
               <div className="st-info">
                 <h4>Push Notifications</h4>
                 <p>Get alerts on your device</p>
               </div>
               <div className={`toggle-switch ${toggles.push ? 'on' : ''}`} onClick={() => toggle('push')}></div>
             </div>
             <div className="setting-toggle">
               <div className="st-info">
                 <h4>New Galas</h4>
                 <p>Notify me about new events</p>
               </div>
               <div className={`toggle-switch ${toggles.newGalas ? 'on' : ''}`} onClick={() => toggle('newGalas')}></div>
             </div>
             <div className="setting-toggle">
               <div className="st-info">
                 <h4>Application Updates</h4>
                 <p>Status changes on applications</p>
               </div>
               <div className={`toggle-switch ${toggles.updates ? 'on' : ''}`} onClick={() => toggle('updates')}></div>
             </div>
           </div>
        </div>

        {/* Account */}
        <div className="section">
           <div className="section-header">
             <h3 style={{ border: 'none', padding: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" color="#10b981"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
               Account
             </h3>
           </div>
           <div className="settings-list">
              <div className="account-action" onClick={() => navigate('/reset-password')}>
                <div className="aa-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <div className="aa-text"><h5>Change Password</h5></div>
                <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </div>

              <div className="account-action">
                <div className="aa-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                </div>
                <div className="aa-text"><h5>Language</h5></div>
                <span className="badge-en">EN</span>
                <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </div>

              <div className="account-action">
                <div className="aa-icon">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                </div>
                <div className="aa-text"><h5>Privacy</h5></div>
                <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </div>

              <div className="account-action">
                <div className="aa-icon">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
                <div className="aa-text"><h5>Terms & Conditions</h5></div>
                <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </div>

              <div className="account-action danger">
                <div className="aa-icon">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </div>
                <div className="aa-text"><h5>Delete Account</h5></div>
                <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </div>
           </div>
        </div>

        <button className="logout-btn" onClick={() => navigate('/login')}>
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
           Logout
        </button>
      </div>
    </div>
  );
}
