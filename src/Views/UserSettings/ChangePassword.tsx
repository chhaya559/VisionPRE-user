import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useChangePasswordMutation } from '../../Services/Api/module/UserApi';
import './Settings.scss';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faChevronLeft,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { changePasswordSchema } from '../../validations/validationSchema';
import PasswordField from '../../Shared/Components/PasswordField';
import { toast } from 'react-toastify';

type FormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ChangePassword() {
  const navigate = useNavigate();
  const { t } = useTranslation('settings');
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(changePasswordSchema),
  });

  const newPassword = watch('newPassword') || '';

  const onSubmit = async (data: FormData) => {
    try {
      const response = await changePassword({
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();
      if (response.success) {
        toast.success(response.message);
        navigate(-1);
      } else {
        toast.error(response.message);
      }
    } catch (err: unknown) {
      const apiError = err as { data?: { message?: string } };
      toast.error(apiError.data?.message || 'Password update failed');
    }
  };

  return (
    <div className="edit-profile-container">
      <header className="edit-profile-header secondary">
        <button type="button" className="back-btn" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faChevronLeft} />
          {t('changePassword.back')}
        </button>
        <div className="header-info">
          <h1>{t('changePassword.title')}</h1>
          <p>{t('changePassword.description')}</p>
        </div>
      </header>

      <div className="settings-card">
        <form onSubmit={handleSubmit(onSubmit)} className="section">
          <div className="form-grid settings-form-grid">
            {/* Current Password */}
            <PasswordField
              id="currentPassword"
              name="currentPassword"
              label={t('changePassword.currentPassword')}
              register={register}
              error={errors.currentPassword?.message}
            />

            {/* New Password */}
            <PasswordField
              id="newPassword"
              name="newPassword"
              label={t('changePassword.newPassword')}
              register={register}
              error={errors.newPassword?.message}
            />
            {/* Password Requirements Checklist */}
            <div className="password-requirements">
              <p>{t('changePassword.requirements')}</p>
              <ul>
                <PasswordRequirement
                  met={newPassword.length >= 8}
                  label={t('changePassword.req8chars')}
                />
                <PasswordRequirement
                  met={/[a-z]/.test(newPassword)}
                  label={t('changePassword.reqLower')}
                />
                <PasswordRequirement
                  met={/[A-Z]/.test(newPassword)}
                  label={t('changePassword.reqUpper')}
                />
                <PasswordRequirement
                  met={/[0-9]/.test(newPassword)}
                  label={t('changePassword.reqNumber')}
                />
                <PasswordRequirement
                  met={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)}
                  label={t('changePassword.reqSpecial')}
                />
              </ul>
            </div>

            {/* Confirm Password */}
            <PasswordField
              id="confirmPassword"
              name="confirmPassword"
              label={t('changePassword.confirmPassword')}
              register={register}
              error={errors.confirmPassword?.message}
            />
          </div>

          <button type="submit" className="btn-save" disabled={isLoading}>
            {isLoading
              ? t('changePassword.updating')
              : t('changePassword.update')}
          </button>

          <div className="settings-text-action">
            <button type="button" className="text-btn success">
              {t('changePassword.forgot')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PasswordRequirement({ met, label }: { met: boolean; label: string }) {
  return (
    <li className={met ? 'valid' : 'invalid'}>
      {met ? <CheckIcon /> : <XIcon />}
      {label}
    </li>
  );
}

function CheckIcon() {
  return <FontAwesomeIcon icon={faCheck} />;
}

function XIcon() {
  return <FontAwesomeIcon icon={faXmark} />;
}
