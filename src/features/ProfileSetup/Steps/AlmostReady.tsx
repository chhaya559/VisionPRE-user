import { useNavigate } from "react-router-dom";
import "./IntroSteps.scss";

export default function AlmostReady() {
  const navigate = useNavigate();

  return (
    <div className="intro-step text-center">
      <div className="rocket-icon mb-4" style={{ fontSize: '2rem' }}>
         🚀
      </div>

      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#111827' }}>You're almost ready!</h1>
      <p className="subtitle" style={{ fontSize: '0.9375rem', color: '#6b7280', maxWidth: '300px', margin: '0 auto 1.5rem' }}>
        Here's what awaits you in the Vision PME ecosystem:
      </p>

      <div className="stats-grid mb-4">
        <div className="stat-card large">
          <h2>200 000 $</h2>
          <p>in grants every year!</p>
        </div>
        
        <div className="stat-card large">
          <h2>200+ Grants</h2>
          <p>to be awarded</p>
        </div>
      </div>

      <button className="btn-continue" onClick={() => navigate("/setup/name")}>
        Continue
      </button>
    </div>
  );
}
