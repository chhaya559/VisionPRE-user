import { useNavigate, useOutletContext } from "react-router-dom";
import { SetupContextProps } from "../ProfileSetupLayout";
import "./ProfileSteps.scss";

const GOALS = [
  { id: 'grants', label: 'Apply for grants', icon: '📝' },
  { id: 'grow', label: 'Grow my business', icon: '📈' },
  { id: 'meet', label: 'Meet other entrepreneurs', icon: '🤝' },
  { id: 'galas', label: 'Attend galas', icon: '🎉' }
];

export default function StepGoal() {
  const navigate = useNavigate();
  const { formData, updateForm } = useOutletContext<SetupContextProps>();

  const toggleSelection = (id: string) => {
    updateForm({
      goal: formData.goal.includes(id) 
        ? formData.goal.filter(x => x !== id) 
        : [...formData.goal, id]
    });
  };

  const handleComplete = () => {
    navigate("/setup/phone"); // route to phone step now
  };

  const canContinue = formData.goal.length > 0;

  return (
    <div className="profile-step">
      <h1>Your goal?</h1>
      <p className="subtitle">We'll personalize your Vision PME experience.</p>

      <div className="list-options multiple">
        {GOALS.map(goal => {
          const isSelected = formData.goal.includes(goal.id);
          return (
            <button
              key={goal.id}
              className={`list-option ${isSelected ? 'selected' : ''}`}
              onClick={() => toggleSelection(goal.id)}
            >
              <span className="list-icon" style={{ backgroundColor: 'transparent', width: 'auto' }}>{goal.icon}</span>
              <div className="list-text" style={{ fontWeight: 600 }}>
                <span className="list-label">{goal.label}</span>
              </div>
              <div className={`checkbox ${isSelected ? 'checked' : ''}`}>
                {isSelected && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <button
        className="btn-continue"
        disabled={!canContinue}
        onClick={handleComplete}
      >
        Continue
      </button>
    </div>
  );
}
