import { useNavigate, useOutletContext } from 'react-router-dom';
import { SetupContextProps } from '../ProfileSetupLayout';
import './ProfileSteps.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilePen,
  faChartLine,
  faHandshake,
  faChampagneGlasses,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { useForm, useController } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

const GOALS = [
  { id: 'grants', icon: faFilePen },
  { id: 'grow', icon: faChartLine },
  { id: 'meet', icon: faHandshake },
  { id: 'galas', icon: faChampagneGlasses },
];

const schema = yup.object().shape({
  goal: yup.string().required('Please select your primary goal'),
});

interface StepGoalForm {
  goal: string;
}

export default function StepGoal() {
  const { t } = useTranslation('profile');
  const navigate = useNavigate();
  const { formData, updateForm } = useOutletContext<SetupContextProps>();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<StepGoalForm>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      goal: formData.goal,
    },
    mode: 'onChange',
  });

  const { field } = useController({
    name: 'goal',
    control,
  });

  const onSubmit = (data: StepGoalForm) => {
    updateForm(data);
    navigate('/setup/phone');
  };

  return (
    <div className="profile-step">
      <h1>{t('goal_question')}</h1>
      <p className="subtitle">{t('goal_subtitle')}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="form-group-stack">
        <div className="list-options">
          {GOALS.map((goal) => {
            const isSelected = field.value === goal.id;
            return (
              <button
                key={goal.id}
                type="button"
                className={`list-option ${isSelected ? 'selected' : ''}`}
                onClick={() => field.onChange(goal.id)}
              >
                <span
                  className="list-icon"
                  style={{ backgroundColor: 'transparent', width: 'auto' }}
                >
                  <FontAwesomeIcon icon={goal.icon} />
                </span>
                <div className="list-text" style={{ fontWeight: 600 }}>
                  <span className="list-label">
                    {t(`goal_options.${goal.id}`)}
                  </span>
                </div>
                {isSelected && (
                  <span className="check-icon">
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {errors.goal && <p className="error-message">{errors.goal.message}</p>}

        <button type="submit" className="btn-continue" disabled={!isValid}>
          {t('continue')}
        </button>
      </form>
    </div>
  );
}
