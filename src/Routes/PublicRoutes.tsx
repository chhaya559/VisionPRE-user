import { Navigate } from 'react-router-dom';
import { ROUTES_CONFIG, WILDCARD_ROUTES } from '../Shared/Constants';
import { CustomRouter } from './RootRoutes';
import SplashScreen from '../features/Splash/Splash';
import OnboardingFlow from '../features/Onboarding/OnboardingFlow';
import Login from '../Views/Login/Login';
import CreateAccount from '../Views/CreateAccount/CreateAccount';
import EmailVerification from '../features/Auth/EmailVerification';
import ForgotPassword from '../features/Auth/ForgotPassword';
import ResetPassword from '../features/Auth/ResetPassword';

export const PUBLIC_ROUTES: Array<CustomRouter> = [
  {
    path: ROUTES_CONFIG.SPLASHSCREEN.path,
    element: <SplashScreen />,
    title: ROUTES_CONFIG.SPLASHSCREEN.title
  },
  {
    path: ROUTES_CONFIG.ONBOARDING.path,
    element: <OnboardingFlow />,
    title: ROUTES_CONFIG.ONBOARDING.title,
  },
  {
    path: ROUTES_CONFIG.LOGIN.path,
    element: <Login />,
    title: ROUTES_CONFIG.LOGIN.title,
  },
  {
    path: ROUTES_CONFIG.CREATE_ACCOUNT.path,
    element: <CreateAccount />,
    title: ROUTES_CONFIG.LOGIN.title,
  },
  {
    path: ROUTES_CONFIG.EMAILVERIFICATION.path,
    element: <EmailVerification />,
    title: ROUTES_CONFIG.EMAILVERIFICATION.title,
  },
  {
    path: ROUTES_CONFIG.FORGOT_PASSWORD.path,
    element: <ForgotPassword />,
    title: ROUTES_CONFIG.FORGOT_PASSWORD.title,
  },
  {
    path: ROUTES_CONFIG.RESET_PASSWORD.path,
    element: <ResetPassword />,
    title: ROUTES_CONFIG.RESET_PASSWORD.title,
  },
  {
    path: '*',
    element: <Navigate to={WILDCARD_ROUTES.PUBLIC} />,
    title: 'Rendering wildcard',
  },
];
