import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useChangePasswordMutation } from '../../Services/Api/module/UserApi';
import './Settings.scss';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faChevronLeft,
  faEye,
  faEyeSlash,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

type FormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ChangePassword() {
  const navigate = useNavigate();
  const { t } = useTranslation('settings');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const schema = yup.object({
    currentPassword: yup
      .string()
      .required(t('changePassword.errors.currentRequired')),
    newPassword: yup
      .string()
      .required(t('changePassword.errors.newRequired'))
      .min(8, t('changePassword.errors.minLength'))
      .matches(/[a-z]/, t('changePassword.errors.lowerRequired'))
      .matches(/[A-Z]/, t('changePassword.errors.upperRequired'))
      .matches(/[0-9]/, t('changePassword.errors.numberRequired'))
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        t('changePassword.errors.specialRequired')
      ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('newPassword')], t('changePassword.errors.match'))
      .required(t('changePassword.errors.confirm')),
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
        >
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
            <div className="form-group">
              <label>{t('changePassword.currentPassword')}</label>
              <div className="password-input-wrapper">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  {...register('currentPassword')}
                  placeholder={t('changePassword.currentPlaceholder')}
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
              <label>{t('changePassword.newPassword')}</label>
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
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label>{t('changePassword.confirmPassword')}</label>
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
          >
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
  return <FontAwesomeIcon icon={faEye} />;
}

function EyeOffIcon() {
  return <FontAwesomeIcon icon={faEyeSlash} />;
}

function CheckIcon() {
  return <FontAwesomeIcon icon={faCheck} />;
}

function XIcon() {
  return <FontAwesomeIcon icon={faXmark} />;
}
