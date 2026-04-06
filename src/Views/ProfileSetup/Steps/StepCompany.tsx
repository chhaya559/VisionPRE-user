import { useNavigate, useOutletContext } from 'react-router-dom';
import { SetupContextProps } from '../ProfileSetupLayout';
import './ProfileSteps.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

interface StepCompanyForm {
  companyName: string;
}

export default function StepCompany() {
  const { t } = useTranslation('profile');

  const schema = yup.object().shape({
    companyName: yup
      .string()
      .required(t('company_required')),
  });

  const navigate = useNavigate();
  const { formData, updateForm } = useOutletContext<SetupContextProps>();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<StepCompanyForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      companyName: formData.companyName,
    },
    mode: 'onChange',
  });

  const onSubmit = (data: StepCompanyForm) => {
    updateForm(data);
    navigate('/setup/industry');
  };

  return (
    <div className="profile-step">
      <div className="step-icon">
        <FontAwesomeIcon icon={faBuilding} />
      </div>

      <h1>{t('your_company')}</h1>
      <p className="subtitle">{t('company_subtitle')}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="form-group-stack">
        <div className="input-with-error">
          <input
            type="text"
            placeholder={t('company_name')}
            {...register('companyName')}
            className={`step-input ${errors.companyName ? 'invalid' : ''}`}
          />
          {errors.companyName && (
            <p className="error-message">{errors.companyName.message}</p>
          )}
        </div>

        <button type="submit" className="btn-continue" disabled={!isValid}>
          {t('continue')}
        </button>
      </form>
    </div>
  );
}
