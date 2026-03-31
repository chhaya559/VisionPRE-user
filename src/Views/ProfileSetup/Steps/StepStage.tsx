import { useNavigate, useOutletContext } from 'react-router-dom';
import { SetupContextProps } from '../ProfileSetupLayout';
import './ProfileSteps.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLightbulb,
  faRocket,
  faChartLine,
  faBuildingColumns,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { useForm, useController } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

const STAGES = [
  { id: 'idea', icon: faLightbulb },
  { id: 'startup', icon: faRocket },
  { id: 'growth', icon: faChartLine },
  { id: 'established', icon: faBuildingColumns },
];

const schema = yup.object().shape({
  stage: yup.string().required('Please select your current stage'),
});

interface StepStageForm {
  stage: string;
}

export default function StepStage() {
  const { t } = useTranslation('profile');
  const navigate = useNavigate();
  const { formData, updateForm } = useOutletContext<SetupContextProps>();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<StepStageForm>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      stage: formData.stage || '',
    },
    mode: 'onChange',
  });

  const { field } = useController({
    name: 'stage',
    control,
  });

  const onSubmit = (data: StepStageForm) => {
    updateForm(data);
    navigate('/setup/profile');
  };

  return (
    <div className="profile-step">
      <h1>{t('stage_question')}</h1>
      <p className="subtitle">
        {t('stage_subtitle')}{' '}
        <FontAwesomeIcon icon={faLightbulb} style={{ color: '#FCD34D' }} />
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="form-group-stack">
        <div className="list-options">
          {STAGES.map((stage) => (
            <button
              key={stage.id}
              type="button"
              className={`list-option ${
                field.value === stage.id ? 'selected' : ''
              }`}
              onClick={() => field.onChange(stage.id)}
            >
              <span className="list-icon">
                <FontAwesomeIcon icon={stage.icon} />
              </span>
              <div className="list-text">
                <span className="list-label">
                  {t(`stage_options.${stage.id}`)}
                </span>
                <span className="list-desc">
                  {t(`stage_descriptions.${stage.id}`)}
                </span>
              </div>
              {field.value === stage.id && (
                <span className="check-icon">
                  <FontAwesomeIcon icon={faCheck} />
                </span>
              )}
            </button>
          ))}
        </div>

        {errors.stage && (
          <p className="error-message">{errors.stage.message}</p>
        )}

        <button type="submit" className="btn-continue" disabled={!isValid}>
          {t('continue')}
        </button>
      </form>
    </div>
  );
}
