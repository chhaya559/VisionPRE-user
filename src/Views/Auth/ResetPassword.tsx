import { useNavigate, useSearchParams } from 'react-router-dom';
import './AuthScreens.scss';
import { faArrowLeft, faKey } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import PasswordField from '../../Shared/Components/PasswordField';
import { resetPasswordSchema } from '../../validations/validationSchema';
import { useResetPasswordMutation } from '../../Services/Api/module/AuthApi';
import { ROUTES_CONFIG } from '../../Shared/Constants';
import { toast } from 'react-toastify';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [resetPasswordApi, { isLoading }] = useResetPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    mode: 'onTouched',
  });

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        token,
        newPassword: data.password,
      };
      const response = await resetPasswordApi(payload).unwrap();
      if (response?.success) {
        toast.success(response?.message || 'Password reset successfully');
        navigate(ROUTES_CONFIG.LOGIN.path);
      } else {
        toast.error(response?.message || 'Failed to reset password');
      }
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error(error.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="illustration-circle">
          <FontAwesomeIcon icon={faKey} className="main-icon" />
        </div>
        <h1>{t('create_newPass')}</h1>
        <p className="subtitle">{t('create_newPass_subtitle')}</p>

        <form
          className="auth-form"
          style={{ marginTop: '24px' }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="form-group">
            <PasswordField
              id="signup-pass"
              label={t('password')}
              register={register}
              name="password"
              error={errors.password?.message}
            />

            <PasswordField
              id="signup-confirm"
              label={t('confirm_pass')}
              register={register}
              name="confirmPassword"
              error={errors.confirmPassword?.message}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {t('reset_pass')}
          </button>

          <div className="back-btn" onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} />
            {t('back')}
          </div>
        </form>
      </div>
    </div>
  );
}
