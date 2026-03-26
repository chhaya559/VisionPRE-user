import { useNavigate, useOutletContext } from "react-router-dom";
import { SetupContextProps } from "../ProfileSetupLayout";
import "./IntroSteps.scss";

export default function ProfileReady() {
  const navigate = useNavigate();
  const { formData } = useOutletContext<SetupContextProps>();

  const handleSubmit = async () => {
    // Placeholder API call integration
    console.log("Submitting form data to API: ", formData);
    // navigate("/app/dashboard");
    navigate("/setup/name");
  };

  return (
    <div className="intro-step text-center">
      
      <div className="rocket-icon mb-4" style={{ fontSize: '2rem' }}>
         🚀
      </div>
      
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#111827' }}>You're almost ready!</h1>
      <p className="subtitle" style={{ fontSize: '0.9375rem', color: '#6b7280', maxWidth: '300px', margin: '0 auto 1.5rem' }}>
        Here's what awaits you in the Vision PME ecosystem.
      </p>

      <div className="stats-grid mb-4">
        <div className="stat-card large">
          <h2>200 000 $</h2>
          <p>in grants every year</p>
        </div>
        
        <div className="stat-card large">
          <h2>200+ Grants</h2>
          <p>to be awarded</p>
        </div>
      </div>

      <div className="speaker-card mb-8">
        <div className="speaker-avatar">
          {/* Placeholder for Hugo Girard */}
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_Y0Yv_tF_vR8vA_fWp0yXQ9w9_v9_fWp0yA&s" alt="Hugo Girard" />
        </div>
        <div className="speaker-info">
          <div className="speaker-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="10" height="10"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
            UPCOMING SPEAKER
          </div>
          <h5>Hugo Girard</h5>
          <p>World's Strongest Man Champion</p>
        </div>
      </div>

      <button className="btn-continue" onClick={handleSubmit}>
        Continue
      </button>
    </div>
  );
}
