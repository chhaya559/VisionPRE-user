import { Navigate } from 'react-router-dom';
import { ROUTES_CONFIG, WILDCARD_ROUTES } from '../Shared/Constants';
import { CustomRouter } from './RootRoutes';
import SplashScreen from '../Views/Splash/Splash';
import OnboardingFlow from '../Views/Onboarding/OnboardingFlow';
import Login from '../Views/Auth/Login';
import CreateAccount from '../Views/CreateAccount/CreateAccount';
import EmailVerification from '../Views/Auth/EmailVerification';
import ForgotPassword from '../Views/Auth/ForgotPassword';
import ResetPassword from '../Views/Auth/ResetPassword';
import ProfileSetupLayout from '../Views/ProfileSetup/ProfileSetupLayout';
import Welcome from '../Views/ProfileSetup/Steps/Welcome';

export const PUBLIC_ROUTES: Array<CustomRouter> = [
  {
    path: ROUTES_CONFIG.SPLASHSCREEN.path,
    element: <SplashScreen />,
    title: ROUTES_CONFIG.SPLASHSCREEN.title,
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
    path: ROUTES_CONFIG.SETUP.path,
    element: <ProfileSetupLayout />,
    title: ROUTES_CONFIG.SETUP.title,
    children: [{ path: 'welcome', element: <Welcome /> }],
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
