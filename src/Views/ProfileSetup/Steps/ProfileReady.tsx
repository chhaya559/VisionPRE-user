import { useNavigate, useOutletContext } from 'react-router-dom';
import { SetupContextProps } from '../ProfileSetupLayout';
import './IntroSteps.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faStar } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useProfileOnboardingMutation } from '../../../Services/Api/module/UserApi';
import { setAuthData } from '../../../Store/Common';

export default function ProfileReady() {
  const { t } = useTranslation('profile');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { formData } = useOutletContext<SetupContextProps>();
  const [OnboardingProfile, { isLoading }] = useProfileOnboardingMutation();

  const handleSubmit = async () => {
    const payload = {
      FirstName: formData.firstName,
      LastName: formData.lastName,
      CompanyName: formData.companyName,
      Industry: formData.industry,
      Stage: formData.stage,
      ProfileType: formData.profileType,
      BusinessDescription: formData.businessDescription,
      Goal: formData.goal,
      PhoneNumber: formData.phone || null,
    };

    try {
      console.log('Submitting form data to API: ', payload);
      const response = await OnboardingProfile(payload).unwrap();
      console.log('Onboarding response:', response);
      dispatch(setAuthData({ isProfileCompleted: true }));
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      console.log('Onboarding error:', error);
      console.log(
        'Onboarding error details:',
        JSON.stringify(error?.data, null, 2)
      );
    }
  };

  return (
    <div className="intro-step">
      <div className="rocket-icon-wrapper">
        <FontAwesomeIcon icon={faRocket} className="rocket-icon-fa" />
      </div>

      <h1>{t('ready_title')}</h1>
      <p className="subtitle">{t('ready_subtitle')}</p>

      <div className="stats-grid">
        <div className="stat-card large">
          <h2>{t('ready_grant_price')}</h2>
          <p>{t('ready_grant_price2')}</p>
        </div>

        <div className="stat-card large">
          <h2>{t('ready_grants_str')}</h2>
          <p>{t('ready_grants_str2')}</p>
        </div>
      </div>

      <div className="speaker-card">
        <div className="speaker-avatar">
          <img src={t('ready_speaker_image')} alt={t('ready_speaker_name')} />
        </div>
        <div className="speaker-info">
          <div className="speaker-badge">
            <FontAwesomeIcon icon={faStar} />
            {t('ready_speaker_title')}
          </div>
          <h5>{t('ready_speaker_name')}</h5>
          <p>{t('ready_speaker_role')}</p>
        </div>
      </div>

      <button
        className="btn-continue"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? t('ready_continue_loading') : t('continue')}
      </button>
    </div>
  );
}
