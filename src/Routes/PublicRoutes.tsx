import { Navigate } from 'react-router-dom';
import { ROUTES_CONFIG, WILDCARD_ROUTES } from '../Shared/Constants';
import { CustomRouter } from './RootRoutes';
import SplashScreen from '../features/Splash/Splash';
import OnboardingFlow from '../features/Onboarding/OnboardingFlow';
import Login from '../Views/Login/Login';
import CreateAccount from '../Views/CreateAccount/CreateAccount';
import ProfileSetupLayout from '../features/ProfileSetup/ProfileSetupLayout';
import Welcome from '../features/ProfileSetup/Steps/Welcome';
import AlmostReady from '../features/ProfileSetup/Steps/AlmostReady';
import StepName from '../features/ProfileSetup/Steps/StepName';
import StepCompany from '../features/ProfileSetup/Steps/StepCompany';
import StepIndustry from '../features/ProfileSetup/Steps/StepIndustry';
import StepStage from '../features/ProfileSetup/Steps/StepStage';
import StepProfile from '../features/ProfileSetup/Steps/StepProfile';
import StepDescribe from '../features/ProfileSetup/Steps/StepDescribe';
import StepGoal from '../features/ProfileSetup/Steps/StepGoal';
import StepPhone from '../features/ProfileSetup/Steps/StepPhone';
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
    path: ROUTES_CONFIG.SETUP.path,
    element: <ProfileSetupLayout />,
    title: ROUTES_CONFIG.SETUP.title,
    children: [
      { path: 'welcome', element: <Welcome /> },
      { path: 'ready', element: <AlmostReady /> },
      { path: 'name', element: <StepName /> },
      { path: 'company', element: <StepCompany /> },
      { path: 'industry', element: <StepIndustry /> },
      { path: 'stage', element: <StepStage /> },
      { path: 'profile', element: <StepProfile /> },
      { path: 'describe', element: <StepDescribe /> },
      { path: 'goal', element: <StepGoal /> },
      { path: 'phone', element: <StepPhone /> },
      { path: '', element: <Navigate to="welcome" replace /> }
    ]
  },
  {
    path: '/verify-email',
    element: <EmailVerification />,
    title: 'Verify Email',
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
    title: 'Forgot Password',
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
    title: 'Reset Password',
  },
  {
    path: '*',
    element: <Navigate to={WILDCARD_ROUTES.PUBLIC} />,
    title: 'Rendering wildcard',
  },
];
