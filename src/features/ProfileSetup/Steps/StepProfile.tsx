import { useNavigate, useOutletContext } from "react-router-dom";
import { SetupContextProps } from "../ProfileSetupLayout";
import "./ProfileSteps.scss";

const PROFILES = [
  { id: 'woman', label: 'Woman entrepreneur', icon: '👩‍💼' },
  { id: 'young', label: 'Young entrepreneur (35 and under)', icon: '🌱' },
  { id: 'diverse', label: 'Entrepreneur from a diverse background', icon: '🌍' },
  { id: 'startup', label: 'Startup', icon: '🚀' },
  { id: 'growth', label: 'Growth-stage business', icon: '📈' },
  { id: 'innovation', label: 'Innovation / technology', icon: '💡' },
  { id: 'impact', label: 'Social or environmental impact', icon: '🌿' }
];

export default function StepProfile() {
  const navigate = useNavigate();
  const { formData, updateForm } = useOutletContext<SetupContextProps>();

  const toggleSelection = (id: string) => {
    if (formData.notSure) updateForm({ notSure: false });
    updateForm({
      profile: formData.profile.includes(id) 
        ? formData.profile.filter(x => x !== id) 
        : [...formData.profile, id]
    });
  };

  const handleNotSure = () => {
    updateForm({ notSure: true, profile: [] });
  };

  const canContinue = formData.profile.length > 0 || formData.notSure;

  return (
    <div className="profile-step">
      <h1>Your profile?</h1>
      <p className="subtitle">Select all that apply - we'll suggest the most relevant grants for you.</p>

      <div className="list-options multiple">
        {PROFILES.map(profile => {
          const isSelected = formData.profile.includes(profile.id);
          return (
            <button
              key={profile.id}
              className={`list-option ${isSelected ? 'selected' : ''}`}
              onClick={() => toggleSelection(profile.id)}
            >
              <span className="list-icon">{profile.icon}</span>
              <div className="list-text">
                <span className="list-label">{profile.label}</span>
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

        <button
          className={`list-option ${formData.notSure ? 'selected' : ''}`}
          onClick={handleNotSure}
        >
          <span className="list-icon">➖</span>
          <div className="list-text">
            <span className="list-label">I'm not sure</span>
          </div>
          <div className={`checkbox ${formData.notSure ? 'checked' : ''}`}>
            {formData.notSure && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
        </button>
      </div>

      <button className="btn-skip" onClick={() => navigate("/setup/describe")}>
        Skip this step
      </button>

      <button 
        className="btn-continue" 
        disabled={!canContinue}
        onClick={() => navigate("/setup/describe")}
      >
        Continue
      </button>
    </div>
  );
}
