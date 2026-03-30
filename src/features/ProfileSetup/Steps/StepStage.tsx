import { useNavigate, useOutletContext } from "react-router-dom";
import { SetupContextProps } from "../ProfileSetupLayout";
import "./ProfileSteps.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faLightbulb, 
  faRocket, 
  faChartLine, 
  faBuildingColumns,
  faCheck
} from "@fortawesome/free-solid-svg-icons";

const STAGES = [
  { id: 'idea', label: 'Idea', desc: 'I have a concept', icon: faLightbulb },
  { id: 'startup', label: 'Startup', desc: 'First sales', icon: faRocket },
  { id: 'growth', label: 'Growth', desc: 'Expanding', icon: faChartLine },
  { id: 'established', label: 'Established', desc: 'Well established', icon: faBuildingColumns }
];

export default function StepStage() {
  const navigate = useNavigate();
  const { formData, updateForm } = useOutletContext<SetupContextProps>();

  const canContinue = formData.stage !== null;

  return (
    <div className="profile-step">
      <h1>Where are you at?</h1>
      <p className="subtitle">Grants are available at every stage. <FontAwesomeIcon icon={faLightbulb} style={{ color: '#FCD34D' }} /></p>

      <div className="list-options">
        {STAGES.map(stage => (
          <button
            key={stage.id}
            className={`list-option ${formData.stage === stage.id ? 'selected' : ''}`}
            onClick={() => updateForm({ stage: stage.id })}
          >
            <span className="list-icon">
              <FontAwesomeIcon icon={stage.icon} />
            </span>
            <div className="list-text">
              <span className="list-label">{stage.label}</span>
              <span className="list-desc">{stage.desc}</span>
            </div>
            {formData.stage === stage.id && (
              <span className="check-icon">
                <FontAwesomeIcon icon={faCheck} />
              </span>
            )}
          </button>
        ))}
      </div>

      <button 
        className="btn-continue" 
        disabled={!canContinue}
        onClick={() => navigate("/setup/profile")}
      >
        Continue
      </button>
    </div>
  );
}
