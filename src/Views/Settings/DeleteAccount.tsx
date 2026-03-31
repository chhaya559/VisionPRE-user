import { useNavigate } from 'react-router-dom';
import './Settings.scss';

export default function DeleteAccount() {
  const navigate = useNavigate();

  const handleDelete = () => {
    // API logic for account deletion would go here
    console.log('Account deletion requested');
    // navigate('/login', { replace: true });
  };

  return (
    <div className="edit-profile-container">
      <header className="edit-profile-header secondary">
        <button
          className="back-btn"
          onClick={() => navigate(-1)}
          style={{ position: 'static', marginBottom: '16px', padding: 0 }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            width="20"
            height="20"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
        <div className="header-info">
          <h1>Delete Account</h1>
          <p>We're sorry to see you go</p>
        </div>
      </header>

      <div className="edit-profile-form">
        <div
          className="warning-box"
          style={{ maxWidth: '600px', margin: '0 auto' }}
        >
          <div className="warning-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              width="40"
              height="40"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>

          <h2>Delete Account?</h2>
          <p>
            Are you sure you want to delete your account? This action cannot be
            undone and you will lose access to all your data.
          </p>

          <div className="loss-card">
            <h4>You will lose:</h4>
            <ul>
              <li>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  width="18"
                  height="18"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                All your grant applications
              </li>
              <li>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  width="18"
                  height="18"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                Your profile and business information
              </li>
              <li>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  width="18"
                  height="18"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                Access to all events and updates
              </li>
            </ul>
          </div>

          <button className="btn-delete" onClick={handleDelete}>
            Yes, Delete My Account
          </button>
          <button className="btn-cancel" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
