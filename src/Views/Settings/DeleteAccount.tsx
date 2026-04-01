import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../Store/Common';
import './Settings.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faTriangleExclamation,
  faXmarkCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useDeleteAccountMutation } from '../../Services/Api/module/UserApi';

export default function DeleteAccount() {
  const { t } = useTranslation('settings');
  const [deleteAccount] = useDeleteAccountMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      const response = await deleteAccount({}).unwrap();
      console.log('Account deleted successfully:', response);
      dispatch(logout());
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  return (
    <div className="edit-profile-container">
      <header className="edit-profile-header secondary">
        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
          {t('deleteAccount.back')}
        </button>
        <div className="header-info">
          <h1>{t('deleteAccount.title')}</h1>
          <p>{t('deleteAccount.subtitle')}</p>
        </div>
      </header>

      <div className="edit-profile-form">
        <div className="warning-box delete-account-box">
          <div className="warning-icon">
            <FontAwesomeIcon icon={faTriangleExclamation} />
          </div>

          <h2>{t('deleteAccount.confirmTitle')}</h2>
          <p>{t('deleteAccount.confirmDescription')}</p>

          <div className="loss-card">
            <h4>{t('deleteAccount.lose')}</h4>
            <ul>
              <li>
                <FontAwesomeIcon icon={faXmarkCircle} />
                {t('deleteAccount.loseApplications')}
              </li>
              <li>
                <FontAwesomeIcon icon={faXmarkCircle} />
                {t('deleteAccount.loseProfile')}
              </li>
              <li>
                <FontAwesomeIcon icon={faXmarkCircle} />
                {t('deleteAccount.loseAccess')}
              </li>
            </ul>
          </div>

          <button className="btn-delete" onClick={handleDelete}>
            {t('deleteAccount.delete')}
          </button>
          <button className="btn-cancel" onClick={() => navigate(-1)}>
            {t('deleteAccount.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}
