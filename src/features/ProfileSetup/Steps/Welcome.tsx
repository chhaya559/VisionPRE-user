import { useNavigate } from "react-router-dom";
import "./IntroSteps.scss";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="intro-step text-center">
      <div className="icon-badge success-badge mb-6">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h1>Welcome</h1>
      <p className="subtitle">Your entrepreneur profile is starting to take shape.</p>

      <div className="info-box mb-8">
        <div className="info-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        </div>
        <p>Now let's discover your business.</p>
      </div>

      <button className="btn-continue" onClick={() => navigate("/setup/ready")}>
        Continue
      </button>
    </div>
  );
}
