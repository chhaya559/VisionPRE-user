import { useNavigate, useOutletContext } from "react-router-dom";
import { SetupContextProps } from "../ProfileSetupLayout";
import "./ProfileSteps.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from "@fortawesome/free-solid-svg-icons";

export default function StepDescribe() {
  const navigate = useNavigate();
  const { formData, updateForm } = useOutletContext<SetupContextProps>();

  const canContinue = formData.description.trim().length > 10; // basic validation

  return (
    <div className="profile-step">
      <div className="step-icon">
        <FontAwesomeIcon icon={faFileLines} />
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
