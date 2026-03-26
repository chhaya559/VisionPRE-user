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
    path: '/wishlist',
    element: 'Your wishlist here',
    title: 'Dashboard',
  },
  {
    path: '*',
    element: <Navigate to={WILDCARD_ROUTES.PRIVATE} />,
    title: 'Rendering wildcard',
  },
];
