import { useNavigate, useOutletContext } from "react-router-dom";
import { SetupContextProps } from "../ProfileSetupLayout";
import "./ProfileSteps.scss";

const STAGES = [
  { id: 'idea', label: 'Idea', desc: 'I have a concept', icon: '💡' },
  { id: 'startup', label: 'Startup', desc: 'First sales', icon: '🚀' },
  { id: 'growth', label: 'Growth', desc: 'Expanding', icon: '📈' },
  { id: 'established', label: 'Established', desc: 'Well established', icon: '🏛️' }
];

export default function StepStage() {
  const navigate = useNavigate();
  const { formData, updateForm } = useOutletContext<SetupContextProps>();

  const canContinue = formData.stage !== null;

  return (
    <div className="profile-step">
      <h1>Where are you at?</h1>
      <p className="subtitle">Grants are available at every stage. 💡</p>

      <div className="list-options">
        {STAGES.map(stage => (
          <button
            key={stage.id}
            className={`list-option ${formData.stage === stage.id ? 'selected' : ''}`}
            onClick={() => updateForm({ stage: stage.id })}
          >
            <span className="list-icon">{stage.icon}</span>
            <div className="list-text">
              <span className="list-label">{stage.label}</span>
              <span className="list-desc">{stage.desc}</span>
            </div>
            {formData.stage === stage.id && (
              <span className="check-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
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
