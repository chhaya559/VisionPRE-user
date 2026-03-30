import { useNavigate, useOutletContext } from "react-router-dom";
import { SetupContextProps } from "../ProfileSetupLayout";
import "./ProfileSteps.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUserTie, 
  faSeedling, 
  faGlobe, 
  faRocket, 
  faChartLine, 
  faLightbulb, 
  faLeaf,
  faCircleQuestion,
  faCheck
} from "@fortawesome/free-solid-svg-icons";

const PROFILES = [
  { id: 'woman', label: 'Woman entrepreneur', icon: faUserTie },
  { id: 'young', label: 'Young entrepreneur (35 and under)', icon: faSeedling },
  { id: 'diverse', label: 'Entrepreneur from a diverse background', icon: faGlobe },
  { id: 'startup', label: 'Startup', icon: faRocket },
  { id: 'growth', label: 'Growth-stage business', icon: faChartLine },
  { id: 'innovation', label: 'Innovation / technology', icon: faLightbulb },
  { id: 'impact', label: 'Social or environmental impact', icon: faLeaf }
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
              <span className="list-icon">
                <FontAwesomeIcon icon={profile.icon} />
              </span>
              <div className="list-text">
                <span className="list-label">{profile.label}</span>
              </div>
              <div className={`checkbox ${isSelected ? 'checked' : ''}`}>
                {isSelected && (
                  <FontAwesomeIcon icon={faCheck} />
                )}
              </div>
            </button>
          );
        })}

        <button
          className={`list-option ${formData.notSure ? 'selected' : ''}`}
          onClick={handleNotSure}
        >
          <span className="list-icon">
            <FontAwesomeIcon icon={faCircleQuestion} />
          </span>
          <div className="list-text">
            <span className="list-label">I'm not sure</span>
          </div>
          <div className={`checkbox ${formData.notSure ? 'checked' : ''}`}>
            {formData.notSure && (
              <FontAwesomeIcon icon={faCheck} />
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
