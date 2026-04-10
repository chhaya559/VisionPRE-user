import { useNavigate, useOutletContext } from 'react-router-dom';
import { SetupContextProps } from '../ProfileSetupLayout';
import './IntroSteps.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faStar } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setAuthData } from '../../../Store/Common';
import { useProfileOnboardingMutation } from '../../../Services/Api/module/UserApi';

export default function ProfileReady() {
  const { t } = useTranslation('profile');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { formData } = useOutletContext<SetupContextProps>();
  const [OnboardingProfile, { isLoading }] = useProfileOnboardingMutation();

  const handleSubmit = async () => {
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      companyName: formData.companyName,
      industry: formData.industry,
      stage: formData.stage,
      profileType: formData.profileType,
      businessDescription: formData.businessDescription,
      goal: formData.goal,
      phoneNumber: formData.phone || null,
    };

    try {
      console.log('Submitting onboarding payload:', payload);
      const response = await OnboardingProfile(payload).unwrap();
      console.log('Onboarding response:', response);
      dispatch(setAuthData({ isProfileCompleted: true }));
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      console.log('Onboarding error:', error);
      toast.error(
        error?.data?.message || 'Failed to save profile. Please try again.'
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
        type="button"
        className="btn-continue"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? t('ready_continue_loading') : t('continue')}
      </button>
    </div>
  );
}
