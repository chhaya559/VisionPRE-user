import { useNavigate, useOutletContext } from "react-router-dom";
import { SetupContextProps } from "../ProfileSetupLayout";
import "./ProfileSteps.scss";

export default function StepPhone() {
  const navigate = useNavigate();
  const { formData, updateForm } = useOutletContext<SetupContextProps>();

  const canContinue = formData.phone.trim() !== "";

  return (
    <div className="profile-step">
      <div className="icon-badge step-icon mb-6">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      </div>
      
      <h1>Your phone number?</h1>
      <p className="subtitle">Optional. Enter your phone number so we can contact you regarding your grant applications.</p>

      <div className="form-group-stack">
        <input 
          type="tel" 
          placeholder="Phone number" 
          value={formData.phone}
          onChange={e => updateForm({ phone: e.target.value })}
          className="step-input"
        />
      </div>

      <button className="btn-skip" onClick={() => navigate("/setup/ready")}>
        Skip this step
      </button>

      <button 
        className="btn-continue" 
        disabled={!canContinue}
        onClick={() => navigate("/setup/ready")}
      >
        Continue
      </button>
    </div>
  );
}
