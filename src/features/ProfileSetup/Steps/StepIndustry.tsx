import { useNavigate, useOutletContext } from "react-router-dom";
import { SetupContextProps } from "../ProfileSetupLayout";
import "./ProfileSteps.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faLaptopCode, 
  faBagShopping, 
  faStethoscope, 
  faHandshake, 
  faHelmetSafety, 
  faGraduationCap, 
  faEllipsis 
} from "@fortawesome/free-solid-svg-icons";

const INDUSTRIES = [
  { id: 'tech', label: 'Technology', icon: faLaptopCode },
  { id: 'retail', label: 'Retail', icon: faBagShopping },
  { id: 'health', label: 'Health', icon: faStethoscope },
  { id: 'services', label: 'Services', icon: faHandshake },
  { id: 'construction', label: 'Construction', icon: faHelmetSafety },
  { id: 'education', label: 'Education', icon: faGraduationCap },
  { id: 'other', label: 'Other', icon: faEllipsis }
];

export default function StepIndustry() {
  const navigate = useNavigate();
  const { formData, updateForm } = useOutletContext<SetupContextProps>();

  const canContinue = formData.industry !== null;

  return (
    <div className="profile-step">
      <h1>Your industry?</h1>
      <p className="subtitle">Some grants target specific industries.</p>

      <div className="grid-options">
        {INDUSTRIES.map(industry => (
          <button
            key={industry.id}
            className={`grid-option ${formData.industry === industry.id ? 'selected' : ''}`}
            onClick={() => updateForm({ industry: industry.id })}
          >
            <span className="grid-icon">
              <FontAwesomeIcon icon={industry.icon} />
            </span>
            <span className="grid-label">{industry.label}</span>
          </button>
        ))}
      </div>

      <button 
        className="btn-continue" 
        disabled={!canContinue}
        onClick={() => navigate("/setup/stage")}
      >
        Continue
      </button>
    </div>
  );
}
