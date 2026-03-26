import { useNavigate } from 'react-router-dom';
import './AuthScreens.scss';

export default function EmailVerification() {
  const navigate = useNavigate();

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="illustration-circle">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline><path d="M16 19l2 2 4-4"></path></svg>
        </div>
        <h1>Check Your Email</h1>
        <p className="subtitle">We've sent a verification link to:</p>
        <span className="target-email">marc@example.com</span>
        <p className="instruction-text">Click the link in your email to verify your account.</p>

        <button className="btn-primary" onClick={() => navigate('/dashboard')}>
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
           Open Email App
        </button>

        <div className="footer-links">
           <div className="footer-item">Didn't receive the email? <span className="link">Resend</span></div>
           <div className="footer-item">Wrong email? <span className="link" onClick={() => navigate('/create-account')}>Change it</span></div>
        </div>
      </div>
    </div>
  );
}
