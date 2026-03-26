import { useNavigate } from 'react-router-dom';
import './AuthScreens.scss';

export default function ResetPassword() {
  const navigate = useNavigate();

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="illustration-circle">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.778-7.778zM12 7l.96 2.035 2.26.328-1.635 1.593.387 2.251-2.012-1.058-2.012 1.058.387-2.251-1.635-1.593 2.26-.328L12 7z"></path></svg>
        </div>
        <h1>Create New Password</h1>
        <p className="subtitle">Your new password must be different from previously used passwords.</p>

        <form className="auth-form" style={{ marginTop: '24px' }} onSubmit={(e) => { e.preventDefault(); navigate('/login'); }}>
          <div className="form-group">
            <label>New Password</label>
            <input type="password" placeholder="••••••••••••" />
          </div>
          
          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" placeholder="••••••••••••" />
          </div>

          <div className="password-criteria">
             <h4>Password must contain:</h4>
             <ul>
               <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> At least 8 characters</li>
               <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> One uppercase letter</li>
               <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> One number</li>
             </ul>
          </div>
          
          <button type="submit" className="btn-primary">Reset Password</button>

          <div className="back-btn" onClick={() => navigate(-1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><polyline points="15 18 9 12 15 6"></polyline></svg>
            Back
          </div>
        </form>
      </div>
    </div>
  );
}
