import { useSelector } from 'react-redux';
import { useRoutes, useLocation, Navigate } from 'react-router-dom';
import DocumentTitle from './DocumentTitle';
import { authenticatedRoutes, guestRoutes } from './config';
import AppLayout from '../Components/Layouts/AppLayout';
import { ROUTES } from '../Shared/Constants';
import type { RootState } from '../Store';

function RootRouter() {
  const location = useLocation();
  const guest = useRoutes(guestRoutes);
  const authenticated = useRoutes(authenticatedRoutes);
  // const { token, isProfileCompleted } = useSelector((state: RootState) => state.common);
  const { isProfileCompleted } = useSelector((state: RootState) => state.common);

  // const isAuthenticated = !!token;
  const isAuthenticated = true;

  if (isAuthenticated) {
    const isGuestPath = [
      ROUTES.SplashScreen,
      ROUTES.LOGIN,
      ROUTES.CREATE_ACCOUNT,
      ROUTES.FORGOT_PASSWORD,
      ROUTES.RESET_PASSWORD,
      ROUTES.Onboarding
    ].includes(location.pathname);

    if (isGuestPath) {
      return <Navigate to="/dashboard" replace />;
    }

    if (!isProfileCompleted && location.pathname !== '/profile') {
      return <Navigate to="/profile" replace />;
    }

    if (isProfileCompleted && location.pathname === '/profile') {
      return <Navigate to="/dashboard" replace />;
    }
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