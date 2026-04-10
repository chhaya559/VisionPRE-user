import PrivateLayout from './Private/PrivateLayout';
import PublicLayout from './Public/PublicLayout';
import { AppLayoutProps } from './AppLayout.d';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Store';
import { hideLogoutModal, logout } from '../../Store/Common';
import LogoutModal from '../../Shared/Components/LogoutModal/LogoutModal';
import api from '../../Services/Api/api';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../../Services/Api/module/AuthApi';

function AppLayout({ isAuthenticated, children }: AppLayoutProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLogoutModalOpen, refreshToken } = useSelector(
    (state: RootState) => state.common
  );
  const [logoutApi] = useLogoutMutation();

  const handleConfirmLogout = async () => {
    try {
      if (refreshToken) {
        await logoutApi(refreshToken).unwrap();
      }
    } catch (err) {
      console.error('Logout API error:', err);
    } finally {
      dispatch(logout());
      dispatch(hideLogoutModal());
      dispatch(api.util.resetApiState());
      navigate('/login', { replace: true });
    }
  };

  return (
    <>
      {isAuthenticated ? (
        <PrivateLayout>{children}</PrivateLayout>
      ) : (
        <PublicLayout>{children}</PublicLayout>
      )}

      {isAuthenticated && (
        <LogoutModal
          isOpen={isLogoutModalOpen}
          onClose={() => dispatch(hideLogoutModal())}
          onConfirm={handleConfirmLogout}
        />
      )}
    </>
  );
}

export default AppLayout;
