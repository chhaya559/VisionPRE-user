import { useNavigate } from 'react-router-dom';
import './AuthScreens.scss';

export default function ForgotPassword() {
  const navigate = useNavigate();

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="illustration-circle">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        </div>
        <h1>Forgot Password?</h1>
        <p className="instruction-text">Don't worry! Enter your email address and we'll send you a link to reset your password.</p>

        <form className="auth-form" onSubmit={(e) => { e.preventDefault(); navigate('/verify-email'); /* Logic to follow */ }}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="marc@example.com" defaultValue="marc@example.com" />
          </div>
          
          <button type="submit" className="btn-primary">Send Reset Link</button>

          <div className="back-btn" onClick={() => navigate(-1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><polyline points="15 18 9 12 15 6"></polyline></svg>
            Back to Sign In
          </div>
        </form>
      </div>
    </div>
  );
}
