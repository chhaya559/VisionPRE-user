import { useNavigate, useOutletContext } from "react-router-dom";
import { SetupContextProps } from "../ProfileSetupLayout";
import "./ProfileSteps.scss";

export default function StepName() {
  const navigate = useNavigate();
  const { formData, updateForm } = useOutletContext<SetupContextProps>();

  const canContinue = formData.firstName.trim() !== "" && formData.lastName.trim() !== "";

  return (
    <div className="profile-step">
      <div className="icon-badge step-icon mb-6">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>
      
      <h1>Your name?</h1>
      <p className="subtitle">This is how you'll appear in the community.</p>

      <div className="form-group-stack">
        <input 
          type="text" 
          placeholder="Your first name" 
          value={formData.firstName}
          onChange={e => updateForm({ firstName: e.target.value })}
          className="step-input"
        />
        <input 
          type="text" 
          placeholder="Your last name" 
          value={formData.lastName}
          onChange={e => updateForm({ lastName: e.target.value })}
          className="step-input"
        />
      </div>

      <button 
        className="btn-continue" 
        disabled={!canContinue}
        onClick={() => navigate("/setup/company")}
      >
        Continue
      </button>
    </div>
  );
}
