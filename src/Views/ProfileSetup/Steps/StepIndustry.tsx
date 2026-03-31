import { useNavigate, useOutletContext } from 'react-router-dom';
import { SetupContextProps } from '../ProfileSetupLayout';
import './ProfileSteps.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLaptopCode,
  faBagShopping,
  faStethoscope,
  faHandshake,
  faHelmetSafety,
  faGraduationCap,
  faEllipsis,
} from '@fortawesome/free-solid-svg-icons';
import { useForm, useController } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

const INDUSTRIES = [
  { id: 'tech', icon: faLaptopCode },
  { id: 'retail', icon: faBagShopping },
  { id: 'health', icon: faStethoscope },
  { id: 'services', icon: faHandshake },
  { id: 'construction', icon: faHelmetSafety },
  { id: 'education', icon: faGraduationCap },
  { id: 'other', icon: faEllipsis },
];

const schema = yup.object().shape({
  industry: yup
    .array()
    .of(yup.string().required())
    .min(1, 'Please select at least one industry'),
});

interface StepIndustryForm {
  industry: string[];
}

export default function StepIndustry() {
  const { t } = useTranslation('profile');
  const navigate = useNavigate();
  const { formData, updateForm } = useOutletContext<SetupContextProps>();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<StepIndustryForm>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      industry: formData.industry,
    },
    mode: 'onChange',
  });

  const { field } = useController({
    name: 'industry',
    control,
  });

  const toggleIndustry = (id: string) => {
    const current = field.value || [];
    const updated = current.includes(id)
      ? current.filter((i) => i !== id)
      : [...current, id];
    field.onChange(updated);
  };

  const onSubmit = (data: StepIndustryForm) => {
    updateForm(data);
    navigate('/setup/stage');
  };

  return (
    <div className="profile-step">
      <h1>{t('industry_question')}</h1>
      <p className="subtitle">{t('industry_subtitle')}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="form-group-stack">
        <div className="grid-options">
          {INDUSTRIES.map((industry) => {
            const isSelected = (field.value || []).includes(industry.id);
            return (
              <button
                key={industry.id}
                type="button"
                className={`grid-option ${isSelected ? 'selected' : ''}`}
                onClick={() => toggleIndustry(industry.id)}
              >
                <span className="grid-icon">
                  <FontAwesomeIcon icon={industry.icon} />
                </span>
                <span className="grid-label">
                  {t(`industry_options.${industry.id}`)}
                </span>
              </button>
            );
          })}
        </div>

        {errors.industry && (
          <p className="error-message">{errors.industry.message}</p>
        )}

        <button type="submit" className="btn-continue" disabled={!isValid}>
          {t('continue')}
        </button>
      </form>
    </div>
  );
}
