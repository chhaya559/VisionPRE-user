import { useNavigate, useOutletContext } from "react-router-dom";
import { SetupContextProps } from "../ProfileSetupLayout";
import "./ProfileSteps.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";

export default function StepPhone() {
  const navigate = useNavigate();
  const { formData, updateForm } = useOutletContext<SetupContextProps>();

  const canContinue = formData.phone.trim() !== "";

  return (
    <div className="profile-step">
      <div className="step-icon">
        <FontAwesomeIcon icon={faPhone} />
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

      <button className="btn-skip" onClick={() => navigate("/setup/finish")}>
        Skip this step
      </button>

      <button 
        className="btn-continue" 
        disabled={!canContinue}
        onClick={() => navigate("/setup/finish")}
      >
        Continue
      </button>
    </div>
  );
}
