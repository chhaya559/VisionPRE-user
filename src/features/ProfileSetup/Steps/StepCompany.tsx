import { useNavigate, useOutletContext } from "react-router-dom";
import { SetupContextProps } from "../ProfileSetupLayout";
import "./ProfileSteps.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding } from "@fortawesome/free-solid-svg-icons";

export default function StepCompany() {
  const navigate = useNavigate();
  const { formData, updateForm } = useOutletContext<SetupContextProps>();

  const canContinue = formData.company.trim() !== "";

  return (
    <div className="profile-step">
      <div className="step-icon">
        <FontAwesomeIcon icon={faBuilding} />
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
