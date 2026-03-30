import { useNavigate, useOutletContext } from "react-router-dom";
import { SetupContextProps } from "../ProfileSetupLayout";
import "./IntroSteps.scss";
import { useProfileOnboardingMutation } from "../../../Services/Api/module/UserApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket, faStar } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { setAuthData } from "../../../Store/Common";

export default function ProfileReady() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { formData } = useOutletContext<SetupContextProps>();
  const [OnboardingProfile, { isLoading }] = useProfileOnboardingMutation();
  
  const handleSubmit = async () => {
    try {
      console.log("Submitting form data to API: ", formData);
      const response = await OnboardingProfile(formData).unwrap();
      console.log("Onboarding response:", response);
      dispatch(setAuthData({ isProfileCompleted: true }));
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.log("Onboarding error:", error)
    }
  };

  return (
    <div className="intro-step">
      <div className="rocket-icon-wrapper">
        <FontAwesomeIcon icon={faRocket} className="rocket-icon-fa" />
      </div>

      <h1>You're almost ready!</h1>
      <p className="subtitle">
        Here's what awaits you in the Vision PME ecosystem.
      </p>

      <div className="stats-grid">
        <div className="stat-card large">
          <h2>200,000 $</h2>
          <p>in grants every year</p>
        </div>

        <div className="stat-card large">
          <h2>200+ Grants</h2>
          <p>to be awarded</p>
        </div>
      </div>

      <div className="speaker-card">
        <div className="speaker-avatar">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_Y0Yv_tF_vR8vA_fWp0yXQ9w9_v9_fWp0yA&s" alt="Hugo Girard" />
        </div>
        <div className="speaker-info">
          <div className="speaker-badge">
            <FontAwesomeIcon icon={faStar} />
            UPCOMING SPEAKER
          </div>
          <h5>Hugo Girard</h5>
          <p>World's Strongest Man Champion</p>
        </div>
      </div>

      <button className="btn-continue" onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "Setting up..." : "Continue"}
      </button>
    </div>
  );
}
