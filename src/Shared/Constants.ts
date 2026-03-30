const STRING: string = 'Test';
export { STRING };

const ROUTES = {
  SplashScreen: '/',
  Onboarding: '/onboarding',
  CREATE_ACCOUNT: '/create-account',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  SETUP: '/setup',
  EMAIL_VERIFICATION : '/verify-email',
  FORGOT_PASSWORD  : '/forgot-password',
  RESET_PASSWORD : '/reset-password'
};

const WILDCARD_ROUTES = {
  PUBLIC: ROUTES.SplashScreen,
  PRIVATE: ROUTES.DASHBOARD,
};

const ROUTES_CONFIG = {
  SPLASHSCREEN: {
    path: ROUTES.SplashScreen,
    title: '',
  },
  ONBOARDING: {
    path: ROUTES.Onboarding,
    title: 'Onboarding',
  },
  LOGIN: {
    path: ROUTES.LOGIN,
    title: 'Login',
  },
  CREATE_ACCOUNT: {
    path: ROUTES.CREATE_ACCOUNT,
    title: 'Register',
  },
  DASHBOARD: {
    path: ROUTES.DASHBOARD,
    title: 'About us',
  },
  SETUP: {
    path: ROUTES.SETUP,
    title: 'Profile Setup',
  },
  EMAILVERIFICATION : {
    path : ROUTES.EMAIL_VERIFICATION,
    title : 'Verify Email'
  },
  FORGOT_PASSWORD : {
    path : ROUTES.FORGOT_PASSWORD,
    title : "Forgot Password"
  },
  RESET_PASSWORD : {
    path : ROUTES.RESET_PASSWORD,
    title : "Reset Password"
  }
};

export { ROUTES, WILDCARD_ROUTES, ROUTES_CONFIG };
