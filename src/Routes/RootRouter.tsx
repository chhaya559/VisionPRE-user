import { useSelector } from 'react-redux';
import { useRoutes, useLocation, Navigate } from 'react-router-dom';
import DocumentTitle from './DocumentTitle';
import { authenticatedRoutes, guestRoutes } from './config';
import AppLayout from '../Components/Layouts/AppLayout';
import { ROUTES } from '../Shared/Constants';
import type { RootState } from '../Store';

const GUEST_PATHS = [
  ROUTES.SplashScreen,
  ROUTES.LOGIN,
  ROUTES.CREATE_ACCOUNT,
  ROUTES.EMAIL_VERIFICATION,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
  ROUTES.Onboarding,
];

function RootRouter() {
  const location = useLocation();
  const guest = useRoutes(guestRoutes);
  const authenticated = useRoutes(authenticatedRoutes);
  const { token, isProfileCompleted } = useSelector(
    (state: RootState) => state.common
  );

  const isAuthenticated = !!token;
  const setupBasePath = ROUTES.SETUP || '/setup';
  const isSetupWelcomePath = location.pathname === `${setupBasePath}/welcome`;
  const hasVerificationToken = Boolean(
    new URLSearchParams(location.search).get('token')
  );
  const isGuestPath = GUEST_PATHS.includes(location.pathname);
  const isPublicVerificationPath = isSetupWelcomePath && hasVerificationToken;
  const isProfilePath =
    location.pathname === setupBasePath ||
    location.pathname.startsWith(`${setupBasePath}/`);

  if (isAuthenticated) {
    // Redirect away from guest pages
    if (isGuestPath) {
      return <Navigate to={ROUTES.DASHBOARD ?? '/dashboard'} replace />;
    }

    // Redirect to profile completion if not done yet (but not already there)
    if (!isProfileCompleted && !isProfilePath) {
      return <Navigate to={setupBasePath} replace />;
    }

    // Redirect away from profile page if already completed
    if (isProfileCompleted && isProfilePath) {
      return <Navigate to={ROUTES.DASHBOARD ?? '/dashboard'} replace />;
    }
  } else if (!isGuestPath && !isPublicVerificationPath) {
    return <Navigate to={ROUTES.LOGIN ?? '/login'} replace />;
  }

  return (
    <>
      <DocumentTitle isAuthenticated={isAuthenticated} />
      <AppLayout isAuthenticated={isAuthenticated}>
        {isAuthenticated ? authenticated : guest}
      </AppLayout>
    </>
  );
}

export default RootRouter;
