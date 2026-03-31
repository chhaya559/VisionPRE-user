import { useNavigate, useOutletContext } from 'react-router-dom';
import { SetupContextProps } from '../ProfileSetupLayout';
import './ProfileSteps.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserTie,
  faSeedling,
  faGlobe,
  faRocket,
  faChartLine,
  faLightbulb,
  faLeaf,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { useForm, useController } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

const PROFILES = [
  { id: 'woman', icon: faUserTie },
  { id: 'young', icon: faSeedling },
  { id: 'diverse', icon: faGlobe },
  { id: 'startup', icon: faRocket },
  { id: 'growth', icon: faChartLine },
  { id: 'innovation', icon: faLightbulb },
  { id: 'impact', icon: faLeaf },
];

const schema = yup.object().shape({
  profileType: yup
    .array()
    .of(yup.string().required())
    .min(1, 'Please select at least one profile type'),
});

interface StepProfileForm {
  profileType: string[];
}

export default function StepProfile() {
  const { t } = useTranslation('profile');
  const navigate = useNavigate();
  const { formData, updateForm } = useOutletContext<SetupContextProps>();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<StepProfileForm>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      profileType: formData.profileType,
    },
    mode: 'onChange',
  });

  const { field } = useController({
    name: 'profileType',
    control,
  });

  const toggleSelection = (id: string) => {
    const current = field.value || [];
    const updated = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    field.onChange(updated);
  };

  const onSubmit = (data: StepProfileForm) => {
    updateForm(data);
    navigate('/setup/describe');
  };

  return (
    <div className="profile-step">
      <h1>{t('profile_question')}</h1>
      <p className="subtitle">{t('profile_subtitle')}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="form-group-stack">
        <div className="list-options multiple">
          {PROFILES.map((profile) => {
            const isSelected = (field.value || []).includes(profile.id);
            return (
              <button
                key={profile.id}
                type="button"
                className={`list-option ${isSelected ? 'selected' : ''}`}
                onClick={() => toggleSelection(profile.id)}
              >
                <span className="list-icon">
                  <FontAwesomeIcon icon={profile.icon} />
                </span>
                <div className="list-text">
                  <span className="list-label">
                    {t(`profile_options.${profile.id}`)}
                  </span>
                </div>
                <div className={`checkbox ${isSelected ? 'checked' : ''}`}>
                  {isSelected && <FontAwesomeIcon icon={faCheck} />}
                </div>
              </button>
            );
          })}
        </div>

        {errors.profileType && (
          <p className="error-message">{errors.profileType.message}</p>
        )}

        <button type="submit" className="btn-continue" disabled={!isValid}>
          {t('continue')}
        </button>
      </form>
    </div>
  );
}
