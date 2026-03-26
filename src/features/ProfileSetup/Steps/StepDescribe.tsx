import { useNavigate, useOutletContext } from "react-router-dom";
import { SetupContextProps } from "../ProfileSetupLayout";
import "./ProfileSteps.scss";

export default function StepDescribe() {
  const navigate = useNavigate();
  const { formData, updateForm } = useOutletContext<SetupContextProps>();

  const canContinue = formData.description.trim().length > 10; // basic validation

  return (
    <div className="profile-step">
      <div className="icon-badge step-icon mb-6">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      </div>

      <h1>Describe your business</h1>
      <p className="subtitle">2-3 sentences is enough. This helps match you with the right grants.</p>

      <div className="form-group-stack" style={{ flex: 1 }}>
        <textarea 
          placeholder="e.g. We develop a platform that helps SMEs access financing..."
          value={formData.description}
          onChange={e => updateForm({ description: e.target.value })}
          className="step-textarea"
        />
      </div>

      <button 
        className="btn-continue" 
        disabled={!canContinue}
        onClick={() => navigate("/setup/goal")}
      >
        Continue
      </button>
    </div>
  );
}
