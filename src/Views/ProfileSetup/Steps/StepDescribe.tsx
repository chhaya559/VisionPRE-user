import { useNavigate, useOutletContext } from 'react-router-dom';
import { SetupContextProps } from '../ProfileSetupLayout';
import './ProfileSteps.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines } from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

interface StepDescribeForm {
  businessDescription: string;
}

export default function StepDescribe() {
  const { t } = useTranslation('profile');

  const schema = yup.object().shape({
    businessDescription: yup
      .string()
      .required(t('describe_required', 'Please describe your business'))
      .min(10, t('describe_min', 'Description must be at least 10 characters')),
  });

  const navigate = useNavigate();
  const { formData, updateForm } = useOutletContext<SetupContextProps>();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<StepDescribeForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      businessDescription: formData.businessDescription,
    },
    mode: 'onChange',
  });

  const onSubmit = (data: StepDescribeForm) => {
    updateForm(data);
    navigate('/setup/goal');
  };

  return (
    <div className="profile-step">
      <div className="step-icon">
        <FontAwesomeIcon icon={faFileLines} />
      </div>

      <h1>{t('describe_business')}</h1>
      <p className="subtitle">{t('describe_subtitle')}</p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form-group-stack"
        style={{ flex: 1 }}
      >
        <div
          className="input-with-error"
          style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
        >
          <textarea
            placeholder={t('describe_placeholder')}
            {...register('businessDescription')}
            className={`step-textarea ${
              errors.businessDescription ? 'invalid' : ''
            }`}
          />
          {errors.businessDescription && (
            <p className="error-message">
              {errors.businessDescription.message}
            </p>
          )}
        </div>

        <button type="submit" className="btn-continue" disabled={!isValid}>
          {t('continue')}
        </button>
      </form>
    </div>
  );
}
