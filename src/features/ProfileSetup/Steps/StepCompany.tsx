import { useNavigate, useOutletContext } from "react-router-dom";
import { SetupContextProps } from "../ProfileSetupLayout";
import "./ProfileSteps.scss";

export default function StepCompany() {
  const navigate = useNavigate();
  const { formData, updateForm } = useOutletContext<SetupContextProps>();

  const canContinue = formData.company.trim() !== "";

  return (
    <div className="profile-step">
      <div className="icon-badge step-icon mb-6">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
          <path d="M9 22v-4h6v4" />
          <path d="M8 6h.01" />
          <path d="M16 6h.01" />
          <path d="M12 6h.01" />
          <path d="M12 10h.01" />
          <path d="M12 14h.01" />
          <path d="M16 10h.01" />
          <path d="M16 14h.01" />
          <path d="M8 10h.01" />
          <path d="M8 14h.01" />
        </svg>
      </div>
      
      <h1>Your company?</h1>
      <p className="subtitle">This name will be used in your grant applications.</p>

      <div className="form-group-stack">
        <input 
          type="text" 
          placeholder="Company name" 
          value={formData.company}
          onChange={e => updateForm({ company: e.target.value })}
          className="step-input"
        />
      </div>

      <button className="btn-skip" onClick={() => navigate("/setup/industry")}>
        I don't have a company yet
      </button>

      <button 
        className="btn-continue" 
        disabled={!canContinue}
        onClick={() => navigate("/setup/industry")}
      >
        Continue
      </button>
    </div>
  );
}
