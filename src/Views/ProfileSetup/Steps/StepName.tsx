import { useNavigate, useOutletContext } from 'react-router-dom';
import { SetupContextProps } from '../ProfileSetupLayout';
import './ProfileSteps.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

const schema = yup.object().shape({
  firstName: yup
    .string()
    .required('First name is required')
    .max(50, 'Max 50 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .max(50, 'Max 50 characters'),
});

interface StepNameForm {
  firstName: string;
  lastName: string;
}

export default function StepName() {
  const navigate = useNavigate();
  const { formData, updateForm } = useOutletContext<SetupContextProps>();
  const { t } = useTranslation('profile');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<StepNameForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: formData.firstName,
      lastName: formData.lastName,
    },
    mode: 'onChange',
  });

  const onSubmit = (data: StepNameForm) => {
    updateForm(data);
    navigate('/setup/company');
  };

  return (
    <div className="profile-step">
      <div className="step-icon">
        <FontAwesomeIcon icon={faUser} />
      </div>
      <h1>{t('your_name')}</h1>
      <p className="subtitle">{t('step1_str')}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="form-group-stack">
        <div className="input-with-error">
          <input
            type="text"
            placeholder={t('first_name')}
            {...register('firstName')}
            className={`step-input ${errors.firstName ? 'invalid' : ''}`}
          />
          {errors.firstName && (
            <p className="error-message">{errors.firstName.message}</p>
          )}
        </div>

        <div className="input-with-error">
          <input
            type="text"
            placeholder={t('last_name')}
            {...register('lastName')}
            className={`step-input ${errors.lastName ? 'invalid' : ''}`}
          />
          {errors.lastName && (
            <p className="error-message">{errors.lastName.message}</p>
          )}
        </div>

        <button type="submit" className="btn-continue" disabled={!isValid}>
          {t('continue')}
        </button>
      </form>
    </div>
  );
}
