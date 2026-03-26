import { useNavigate } from 'react-router-dom';
import './MyProfile.scss';

export default function MyProfile() {
  const navigate = useNavigate();
  return (
    <div className="my-profile-container">
      <header className="my-profile-header">
        <h1>My profile</h1>
        <p>Manage your personal and professional information</p>
      </header>

      <div className="my-profile-content">
        {/* Public Profile Card */}
        <div className="profile-card">
          <div className="card-header">
            <h3>Public profile</h3>
            <button className="btn-edit" onClick={() => navigate('/dashboard/profile/edit-public')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              Edit
            </button>
          </div>
          
          <div className="public-meta">
            <div className="avatar-big">M</div>
            <div className="meta-text">
              <h2>Marc-Antoine Blais</h2>
              <p>marc@quackpreneur.ca</p>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-item">
              <div className="icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <div className="text">
                <h5>Quackpreneur</h5>
              </div>
            </div>
            <p className="bio">I am Marc!</p>
          </div>
        </div>

        {/* Business Profile Card */}
        <div className="profile-card business">
          <div className="card-header">
            <div className="icon-heading">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 7h-9"></path><path d="M14 17H5"></path><circle cx="17" cy="17" r="3"></circle><circle cx="7" cy="7" r="3"></circle></svg>
               Business profile
            </div>
            <button className="btn-edit" onClick={() => navigate('/dashboard/profile/edit-business')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              Edit
            </button>
          </div>
          <div className="empty-state">
            No company information. Click "Edit" to complete your profile.
          </div>
        </div>

        {/* Settings Card */}
        <div className="profile-card settings">
          <div className="card-header">
            <div className="icon-heading">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
               Settings
            </div>
            <button className="btn-edit" onClick={() => navigate('/dashboard/profile/settings')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              Edit
            </button>
          </div>
          
          <div className="setting-item">
            <div className="icon-s">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </div>
            <div className="text-s">
               <h5>Notifications</h5>
               <ul>
                 <li>Email: Enabled</li>
                 <li>New galas: Disabled</li>
               </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
