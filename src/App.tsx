import { Provider } from 'react-redux';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './Store';
import RootRouter from './Routes/RootRouter';
import './App.css';
import { ToastContainer } from 'react-toastify';
import ErrorBoundary from './Components/ErrorBoundary';
import { useEffect } from 'react';

import { requestNotificationPermission } from './Services/notifications';
import { useFCMtokenMutation } from './Services/Api/module/NotificationApi';
import { WalletProvider } from './Context/WalletContext';

const baseName = import.meta.env.VITE_BASE_NAME;

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="*" element={<RootRouter />} errorElement={<ErrorBoundary />} />
  ),
  { basename: baseName }
);

function NotificationSetup() {
  const [sendToken] = useFCMtokenMutation();

  useEffect(() => {
    requestNotificationPermission(sendToken);
  }, [sendToken]);

  return null;
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <WalletProvider>
          <HelmetProvider>
            <NotificationSetup />
            <RouterProvider router={router} />
          </HelmetProvider>
        </WalletProvider>
        <ToastContainer />
      </PersistGate>
    </Provider>
  );
}

export default App;
