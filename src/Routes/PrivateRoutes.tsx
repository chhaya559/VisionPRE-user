import { Navigate } from 'react-router-dom';
import { ROUTES_CONFIG, WILDCARD_ROUTES } from '../Shared/Constants';
import { CustomRouter } from './RootRoutes';

import Dashboard from '../Views/Dashboard/Dashboard';
import DiscoverGalas from '../Views/Galas/DiscoverGalas';
import GalaDetails from '../Views/Galas/GalaDetails';
import GalaGrants from '../Views/Galas/GalaGrants';
import GrantApplication from '../Views/Grants/GrantApplication';
import GrantsList from '../Views/Grants/GrantsList';
import MyProfile from '../Views/Profile/MyProfile';
import EditPublicProfile from '../Views/Profile/EditPublicProfile';
import EditBusinessProfile from '../Views/Profile/EditBusinessProfile';
import AccountSettings from '../Views/Profile/AccountSettings';
import ChangePassword from '../Views/Settings/ChangePassword';
import LanguageSettings from '../Views/Settings/LanguageSettings';
import TermsAndConditions from '../Views/Settings/TermsAndConditions';
import PrivacyPolicy from '../Views/Settings/PrivacyPolicy';
import DeleteAccount from '../Views/Settings/DeleteAccount';
import ProfileSetupLayout from '../Views/ProfileSetup/ProfileSetupLayout';
// ... rest of imports
import Welcome from '../Views/ProfileSetup/Steps/Welcome';
import AlmostReady from '../Views/ProfileSetup/Steps/AlmostReady';
import StepName from '../Views/ProfileSetup/Steps/StepName';
import StepCompany from '../Views/ProfileSetup/Steps/StepCompany';
import StepIndustry from '../Views/ProfileSetup/Steps/StepIndustry';
import StepStage from '../Views/ProfileSetup/Steps/StepStage';
import StepProfile from '../Views/ProfileSetup/Steps/StepProfile';
import StepDescribe from '../Views/ProfileSetup/Steps/StepDescribe';
import StepGoal from '../Views/ProfileSetup/Steps/StepGoal';
import StepPhone from '../Views/ProfileSetup/Steps/StepPhone';
import ProfileReady from '../Views/ProfileSetup/Steps/ProfileReady';

// eslint-disable-next-line import/prefer-default-export
export const PRIVATE_ROUTES: Array<CustomRouter> = [
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
    title: 'Redirect',
  },
  {
    path: ROUTES_CONFIG.DASHBOARD.path,
    element: <Dashboard />,
    title: ROUTES_CONFIG.DASHBOARD.title,
    children: [
      {
        path: 'galas',
        element: <DiscoverGalas />,
      },
      { path: 'galas/:id', element: <GalaDetails /> },
      { path: 'galas/:id/grants', element: <GalaGrants /> },
      { path: 'galas/:id/apply/:grantId', element: <GrantApplication /> },
      { path: 'grants', element: <GrantsList /> },
      { path: 'profile', element: <MyProfile /> },
      { path: 'profile/edit-public', element: <EditPublicProfile /> },
      { path: 'profile/edit-business', element: <EditBusinessProfile /> },
      { path: 'profile/settings', element: <AccountSettings /> },
      { path: 'profile/settings/change-password', element: <ChangePassword /> },
      { path: 'profile/settings/language', element: <LanguageSettings /> },
      { path: 'profile/settings/terms', element: <TermsAndConditions /> },
      { path: 'profile/settings/privacy', element: <PrivacyPolicy /> },
      { path: 'profile/settings/delete-account', element: <DeleteAccount /> },
    ],
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
      { path: 'finish', element: <ProfileReady /> },
      { path: '', element: <Navigate to="welcome" replace /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to={WILDCARD_ROUTES.PRIVATE} />,
    title: 'Rendering wildcard',
  },
];
