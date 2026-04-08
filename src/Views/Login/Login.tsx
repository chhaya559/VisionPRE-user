import '../CreateAccount/styles.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faApple } from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Bounce, toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { signInWithPopup } from 'firebase/auth';
import { login } from '../../Store/Common';
import { loginSchema } from '../../validations/userSchema';
import {
  useAppleLoginMutation,
  useGoogleLoginMutation,
  useLoginMutation,
} from '../../Services/Api/module/AuthApi';
import PasswordField from '../../Shared/Components/PasswordField';
import { auth, googleProvider, appleProvider } from '../../Services/firebase';

export default function LoginPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [googleLogin] = useGoogleLoginMutation();
  const [loginApi, { isLoading }] = useLoginMutation();
  const [appleLogin] = useAppleLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onTouched',
  });

  const onSubmit = async (data: any) => {
    const payload = {
      email: data.email,
      password: data.password,
    };
    console.log(payload);
    try {
      const response = await loginApi(payload).unwrap();

      console.log('Login Response (Full):', response);
      if (response.message) {
        toast.success(response.message, { position: 'top-right' });
      }
      const token = response.data?.accessToken;
      const refreshToken = response.data?.refreshToken;
      const email = response.data?.email;
      const userName = response.data?.username;
      const isProfileCompleted = response.data?.isProfileCompleted;

      dispatch(
        login({
          token,
          refreshToken,
          email,
          userName,
          isProfileCompleted,
        })
      );
    } catch (err: any) {
      console.log('error-', err);
      toast.error(err?.data?.message || 'Login failed', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      });
    }
  };

  async function handleGoogleLogin() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      console.log('Firebase ID token:', idToken);
      const response = await googleLogin({ idToken }).unwrap();
      console.log(response);
      if (response.success) {
        dispatch(
          login({
            token: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            email: response.data.email,
            userName: response.data.username,
            isProfileCompleted: response.data.isProfileCompleted,
          })
        );
        // navigate('/dashboard');
      }
    } catch (err) {
      console.error('Google login failed:', err);
    }
  }

  const handleAppleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, appleProvider);
      const idToken = await result.user.getIdToken();
      const response = await appleLogin({ idToken }).unwrap();
      if (response.success) {
        dispatch(
          login({
            token: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            email: response.data.email,
            userName: response.data.username,
            isProfileCompleted: response.data.isProfileCompleted,
          })
        );
        // navigate('/dashboard');
      }
    } catch (err) {
      console.error('Apple login failed:', err);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__logo">
          {/* <div className="logo-bubble"> */}
          <img src="../../assets/logoGreen.png" alt="logo" />
          {/* </div> */}
        </div>

        <div className="login-card__heading">
          <h1>{t('welcome_string')}</h1>
          <p>{t('login_str')}</p>
        </div>

        {/* Form */}
        <div className="login-card__form">
          <div className="form-group">
            <label htmlFor="email">{t('email')}</label>
            <div className="input-wrap">
              <input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                {...register('email')}
              />
            </div>
            {errors.email && (
              <span className="error">{errors.email.message}</span>
            )}
          </div>
          <PasswordField
            id="password"
            label={t('password')}
            name="password"
            register={register}
            error={errors.password?.message}
          />

          <button
            className="forgot-link"
            type="button"
            onClick={() => navigate('/forgot-password')}
          >
            {t('forgot_pass')}
          </button>

          {/* Sign In CTA */}
          <button
            type="button"
            className="btn-signin"
            onClick={handleSubmit(onSubmit)}
          >
            {isLoading ? t('signing_in') : t('sign_in')}
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
            <button
              className="btn-social btn-social--apple"
              type="button"
              onClick={handleAppleLogin}
            >
              <FontAwesomeIcon icon={faApple} className="apple-icon" />
              {t('apple')}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="login-footer">
          {t('dont_account')}{' '}
          <button type="button" onClick={() => navigate('/create-account')}>
            {t('sign_up')}
          </button>
        </div>
      </div>
    </div>
  );
}
