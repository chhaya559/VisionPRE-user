import { useNavigate, useOutletContext } from "react-router-dom";
import { SetupContextProps } from "../ProfileSetupLayout";
import "./ProfileSteps.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function StepName() {
  const navigate = useNavigate();
  const { formData, updateForm } = useOutletContext<SetupContextProps>();

  const canContinue = formData.firstName.trim() !== "" && formData.lastName.trim() !== "";

  return (
    <div className="profile-step">
      <div className="step-icon">
        <FontAwesomeIcon icon={faUser} />
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
