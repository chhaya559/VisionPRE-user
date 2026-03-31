import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useChangePasswordMutation } from '../../Services/Api/module/UserApi';
import './Settings.scss';
import { useTranslation } from 'react-i18next';

type FormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ChangePassword() {
  const navigate = useNavigate();
  const { t } = useTranslation('private');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const schema = yup.object({
    currentPassword: yup
      .string()
      .required(t('settings.changePassword.errors.currentRequired')),
    newPassword: yup
      .string()
      .required(t('settings.changePassword.errors.newRequired'))
      .min(8, t('settings.changePassword.errors.minLength'))
      .matches(/[a-z]/, t('settings.changePassword.errors.lowerRequired'))
      .matches(/[A-Z]/, t('settings.changePassword.errors.upperRequired'))
      .matches(/[0-9]/, t('settings.changePassword.errors.numberRequired'))
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        t('settings.changePassword.errors.specialRequired')
      ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('newPassword')], t('settings.changePassword.errors.match'))
      .required(t('settings.changePassword.errors.confirm')),
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const newPassword = watch('newPassword') || '';

  const onSubmit = async (data: FormData) => {
    try {
      const response = await changePassword({
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();

      if (response.success) {
        navigate(-1);
      }
    } catch (err) {
      console.error('Failed to change password:', err);
    }
  };

  return (
    <div className="edit-profile-container">
      <header className="edit-profile-header secondary">
        <button
          className="back-btn"
          onClick={() => navigate(-1)}
          style={{ position: 'static', marginBottom: '16px', padding: 0 }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            width="20"
            height="20"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          {t('settings.changePassword.back')}
        </button>
        <div className="header-info">
          <h1>{t('settings.changePassword.title')}</h1>
          <p>{t('settings.changePassword.description')}</p>
        </div>
      </header>

      <div className="settings-card">
        <form onSubmit={handleSubmit(onSubmit)} className="section">
          <div
            className="form-grid"
            style={{
              gridTemplateColumns: '1fr',
              maxWidth: '500px',
              margin: '0 auto',
            }}
          >
            {/* Current Password */}
            <div className="form-group">
              <label>{t('settings.changePassword.currentPassword')}</label>
              <div className="password-input-wrapper">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  {...register('currentPassword')}
                  placeholder={t('settings.changePassword.currentPlaceholder')}
                  className={errors.currentPassword ? 'error' : ''}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowCurrent(!showCurrent)}
                >
                  {showCurrent ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {errors.currentPassword && (
                <span className="error-text">{errors.currentPassword.message}</span>
              )}
            </div>

            {/* New Password */}
            <div className="form-group">
              <label>{t('settings.changePassword.newPassword')}</label>
              <div className="password-input-wrapper">
                <input
                  type={showNew ? 'text' : 'password'}
                  {...register('newPassword')}
                  placeholder="••••••••••••"
                  className={errors.newPassword ? 'error' : ''}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {errors.newPassword && (
                <span className="error-text">{errors.newPassword.message}</span>
              )}
              <div className="password-requirements">
                <p>{t('settings.changePassword.requirements')}</p>
                <ul>
                  <PasswordRequirement
                    met={newPassword.length >= 8}
                    label={t('settings.changePassword.req8chars')}
                  />
                  <PasswordRequirement
                    met={/[a-z]/.test(newPassword)}
                    label={t('settings.changePassword.reqLower')}
                  />
                  <PasswordRequirement
                    met={/[A-Z]/.test(newPassword)}
                    label={t('settings.changePassword.reqUpper')}
                  />
                  <PasswordRequirement
                    met={/[0-9]/.test(newPassword)}
                    label={t('settings.changePassword.reqNumber')}
                  />
                  <PasswordRequirement
                    met={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)}
                    label={t('settings.changePassword.reqSpecial')}
                  />
                </ul>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label>{t('settings.changePassword.confirmPassword')}</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  placeholder="••••••••••••"
                  className={errors.confirmPassword ? 'error' : ''}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="error-text">{errors.confirmPassword.message}</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn-save"
            disabled={isLoading}
            style={{ marginTop: '32px' }}
          >
            {isLoading
              ? t('settings.changePassword.updating')
              : t('settings.changePassword.update')}
          </button>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button type="button" className="text-btn success">
              {t('settings.changePassword.forgot')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Small helper components ──────────────────────────────────────────────────

function PasswordRequirement({ met, label }: { met: boolean; label: string }) {
  return (
    <li className={met ? 'valid' : 'invalid'}>
      {met ? <CheckIcon /> : <XIcon />}
      {label}
    </li>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}