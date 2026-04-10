import { useState } from 'react';
import './styles.scss';
import { faApple } from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { signInWithPopup } from 'firebase/auth';
import Modal from '../../Shared/Components/Modal';
import { userSchema } from '../../validations/validationSchema';
import { ROUTES_CONFIG } from '../../Shared/Constants';
import {
  useGoogleLoginMutation,
  useRegisterMutation,
} from '../../Services/Api/module/AuthApi';
import { setAuthData, login } from '../../Store/Common';
import PasswordField from '../../Shared/Components/PasswordField';
import { auth, googleProvider } from '../../Services/firebase';
import { toast } from 'react-toastify';

export default function CreateAccount() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const { t } = useTranslation(['common', 'terms']);
  const [registerApi, { isLoading }] = useRegisterMutation();
  const [googleLogin] = useGoogleLoginMutation();

  function handleBack() {
    navigate(-1);
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(userSchema),
    mode: 'onTouched',
  });

  const dispatch = useDispatch();

  async function handleGoogleLogin() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const response = await googleLogin({ idToken }).unwrap();
      if (response.success) {
        toast.success(response.message || 'Logged in with Google');
        dispatch(
          login({
            token: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            email: response.data.email,
            userName: response.data.username,
            isProfileCompleted: response.data.isProfileCompleted,
          })
        );
        if (response.data.isProfileCompleted) {
          navigate(ROUTES_CONFIG.DASHBOARD.path);
        } else {
          navigate(ROUTES_CONFIG.SETUP.path);
        }
      }
    } catch (err: unknown) {
      // eslint-disable-next-line no-console
      console.error('Google login failed:', err);
      const error = err as { data?: { message?: string } };
      toast.error(error.data?.message || 'Google login failed');
    }
  }

  const onSubmit = async (data: {
    userName: string;
    email: string;
    password?: string;
  }) => {
    if (!agreed) {
      toast.warning(
        'Please agree to the Terms & Conditions and Privacy Policy'
      );
      return;
    }

    const payload = {
      userName: data.userName,
      email: data.email,
      password: data.password,
    };
    try {
      const response = await registerApi(payload).unwrap();
      if (response.success) {
        toast.success(response.message || 'Account created successfully');
        dispatch(
          setAuthData({
            email: response.data.email,
            userName: response.data.userName,
            isProfileCompleted: response.data.isProfileCompleted,
          })
        );
        navigate(ROUTES_CONFIG.EMAILVERIFICATION.path);
      } else {
        toast.error(response.message || 'Registration failed');
      }
    } catch (err: unknown) {
      // eslint-disable-next-line no-console
      console.error('Registration error:', err);
      const error = err as { data?: { message?: string } };
      toast.error(
        error.data?.message || 'Something went wrong. Please try again.'
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <button className="login-card__back" type="button" onClick={handleBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
          {t('back')}
        </button>

        <div className="login-card__heading">
          <h1>{t('create_acc')}</h1>
          <p>{t('signup_str')}</p>
        </div>

        <div className="login-card__form">
          <div className="form-group">
            <label htmlFor="fullName">{t('Username')}</label>
            <div className="input-wrap">
              <input
                id="fullName"
                type="text"
                placeholder="Marc-Antoine Blais"
                {...register('userName')}
              />
            </div>
            {errors.userName && (
              <span className="error">{errors.userName.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="signup-email">{t('email')}</label>
            <div className="input-wrap">
              <input
                id="signup-email"
                type="email"
                placeholder="marc@example.com"
                {...register('email')}
              />
            </div>
            {errors.email && (
              <span className="error">{errors.email.message}</span>
            )}
          </div>

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

          <div className="terms-row">
            <input
              type="checkbox"
              id="terms"
              className="terms-checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <label htmlFor="terms">
              {t('agree')}{' '}
              <button
                className="policy-btn"
                type="button"
                onClick={(e) => {
                  setShowTerms(true);
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                {t('terms_str')}
              </button>{' '}
              {t('and')}{' '}
              <button
                className="policy-btn"
                type="button"
                onClick={(e) => {
                  setShowPolicy(true);
                  e.stopPropagation();
                }}
              >
                {t('privacy_str')}
              </button>
            </label>
          </div>

          <Modal
            isOpen={showTerms}
            title=""
            onClose={() => setShowTerms(false)}
          >
            <h1
              style={{
                fontWeight: 600,
                fontSize: '24px',
                marginBottom: '16px',
              }}
            >
              {t('terms:terms_cond')}
            </h1>
            <h2
              style={{ fontWeight: 600, fontSize: '18px', marginTop: '20px' }}
            >
              {t('terms:acceptance')}
            </h2>
            <p>{t('terms:acceptance_str')}</p>
            <h2
              style={{ fontWeight: 600, fontSize: '18px', marginTop: '20px' }}
            >
              {t('terms:license')}
            </h2>
            <p>{t('terms:license_str')}</p>
            <h2
              style={{ fontWeight: 600, fontSize: '18px', marginTop: '20px' }}
            >
              {t('terms:account')}
            </h2>
            <p>{t('terms:account_str')}</p>
            <h2
              style={{ fontWeight: 600, fontSize: '18px', marginTop: '20px' }}
            >
              {t('terms:privacy')}
            </h2>
            <p>{t('terms:privacy_str')}</p>
            <h2
              style={{ fontWeight: 600, fontSize: '18px', marginTop: '20px' }}
            >
              {t('terms:grant')}
            </h2>
            <p>{t('terms:grant_str')}</p>
          </Modal>

          <Modal
            isOpen={showPolicy}
            title=""
            onClose={() => setShowPolicy(false)}
          >
            <h1
              style={{
                fontWeight: 600,
                fontSize: '24px',
                marginBottom: '16px',
              }}
            >
              {t('terms:privacy_policy')}
            </h1>
            <h2
              style={{ fontWeight: 600, fontSize: '18px', marginTop: '20px' }}
            >
              {t('terms:information')}
            </h2>
            <p>{t('terms:information_str')}</p>
            <h2
              style={{ fontWeight: 600, fontSize: '18px', marginTop: '20px' }}
            >
              {t('terms:use_info')}
            </h2>
            <p>{t('terms:use_infoStr')}</p>
            <h2
              style={{ fontWeight: 600, fontSize: '18px', marginTop: '20px' }}
            >
              {t('terms:sharing')}
            </h2>
            <p>{t('terms:sharing_str')}</p>
            <h2
              style={{ fontWeight: 600, fontSize: '18px', marginTop: '20px' }}
            >
              {t('terms:security')}
            </h2>
            <p>{t('terms:security_str')}</p>
            <h2
              style={{ fontWeight: 600, fontSize: '18px', marginTop: '20px' }}
            >
              {t('terms:rights')}
            </h2>
            <p>{t('terms:rights_str')}</p>
          </Modal>

          <button
            className="btn-create"
            type="button"
            disabled={!isValid || !agreed}
            onClick={handleSubmit(onSubmit)}
          >
            {isLoading ? t('creating_acc') : t('create_acc')}
          </button>

          <div className="or-divider">
            <span>{t('social_option')}</span>
          </div>

          <div className="social-btns">
            <button
              className="btn-social"
              type="button"
              onClick={handleGoogleLogin}
            >
              <img
                src="../../assets/icons/google.png"
                alt="google-icon"
                className="google-icon"
              />
              {t('google')}
            </button>
            <button className="btn-social btn-social--apple" type="button">
              <FontAwesomeIcon icon={faApple} className="apple-icon" />
              {t('apple')}
            </button>
          </div>
        </div>

        <div className="login-footer">
          {t('already_account')}{' '}
          <button
            type="button"
            onClick={() => navigate(ROUTES_CONFIG.LOGIN.path)}
          >
            {t('sign_in')}
          </button>
        </div>
      </div>
    </div>
  );
}
