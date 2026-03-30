import { Navigate } from 'react-router-dom';
import { ROUTES_CONFIG, WILDCARD_ROUTES } from '../Shared/Constants';
import { CustomRouter } from './RootRoutes';

import Dashboard from '../Views/Dashboard/Dashboard';
import DiscoverGalas from '../features/Galas/DiscoverGalas';
import GalaDetails from '../features/Galas/GalaDetails';
import GalaGrants from '../features/Galas/GalaGrants';
import GrantApplication from '../features/Grants/GrantApplication';
import MyApplications from '../features/Grants/MyApplications';
import MyProfile from '../features/Profile/MyProfile';
import EditPublicProfile from '../features/Profile/EditPublicProfile';
import EditBusinessProfile from '../features/Profile/EditBusinessProfile';
import AccountSettings from '../features/Profile/AccountSettings';
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
import ProfileReady from '../features/ProfileSetup/Steps/ProfileReady';

// eslint-disable-next-line import/prefer-default-export
export const PRIVATE_ROUTES: Array<CustomRouter> = [
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
    title: "Redirect",
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
      { path: 'grants', element: <MyApplications /> },
      { path: 'profile', element: <MyProfile /> },
      { path: 'profile/edit-public', element: <EditPublicProfile /> },
      { path: 'profile/edit-business', element: <EditBusinessProfile /> },
      { path: 'profile/settings', element: <AccountSettings /> },
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
      { path: '', element: <Navigate to="welcome" replace /> }
    ]
  },
  {
    path: '*',
    element: <Navigate to={WILDCARD_ROUTES.PRIVATE} />,
    title: 'Rendering wildcard',
  },
];
