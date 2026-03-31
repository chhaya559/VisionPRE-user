import { useNavigate, useOutletContext } from 'react-router-dom';
import { SetupContextProps } from '../ProfileSetupLayout';
import './ProfileSteps.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

interface StepPhoneForm {
  phone?: string | null;
}

const schema = yup.object({
  phone: yup
    .string()
    .transform((curr, orig) => (orig === '' ? '' : curr))
    .test(
      'is-phone-valid',
      'Enter a valid phone number (e.g. +1234567890)',
      (value) => {
        if (!value || value === '') return true;
        return /^\+?[1-9]\d{1,14}$/.test(value);
      }
    )
    .nullable()
    .optional(),
});

export default function StepPhone() {
  const { t } = useTranslation('profile');

  const navigate = useNavigate();
  const { formData, updateForm } = useOutletContext<SetupContextProps>();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<StepPhoneForm>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      phone: formData.phone,
    },
    mode: 'onChange',
  });

  const onSubmit = (data: StepPhoneForm) => {
    updateForm({ phone: data.phone ?? '' });
    navigate('/setup/finish');
  };

  return (
    <div className="profile-step">
      <div className="step-icon">
        <FontAwesomeIcon icon={faPhone} />
      </div>

      <h1>{t('phone_question')}</h1>
      <p className="subtitle">{t('phone_subtitle')}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="form-group-stack">
        <div className="input-with-error">
          <input
            type="tel"
            placeholder={t('phone_placeholder')}
            {...register('phone')}
            className={`step-input ${errors.phone ? 'invalid' : ''}`}
          />
          {errors.phone && (
            <p className="error-message">{errors.phone.message}</p>
          )}
        </div>

        <button
          type="button"
          className="btn-skip"
          onClick={() => navigate('/setup/finish')}
        >
          {t('skip_step')}
        </button>

        <button type="submit" className="btn-continue" disabled={!isValid}>
          {t('continue')}
        </button>
      </form>
    </div>
  );
}