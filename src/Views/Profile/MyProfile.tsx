import { useNavigate, useOutletContext } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../Store/Common';
import './MyProfile.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPencilAlt,
  faBriefcase,
  faCog,
  faBell,
  faBuilding,
  faCircle,
  faExclamationTriangle,
  faSignOutAlt,
  faRedo,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import type { DashboardOutletContext } from '../Dashboard/Dashboard';

export default function MyProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation('settings');
  const { profile, profileLoading, profileError } =
    useOutletContext<DashboardOutletContext>();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (profileLoading) {
    return (
      <div className="my-profile-container my-profile-state-center">
        <div className="my-profile-loading-text">{t('myProfile.loading')}</div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="my-profile-container my-profile-state-center">
        <div className="error-state-card">
          <div className="error-icon-wrap">
            <FontAwesomeIcon icon={faExclamationTriangle} />
          </div>
          <h2 className="my-profile-error-title">
            {t('myProfile.error', 'Something went wrong')}
          </h2>
          <p className="my-profile-error-desc">
            {t(
              'myProfile.errorDescription',
              "We couldn't load your profile. This might be due to a connection issue."
            )}
          </p>
          <div className="my-profile-error-actions">
            <button
              className="btn-error-action btn-primary"
              onClick={() => window.location.reload()}
            >
              <FontAwesomeIcon icon={faRedo} />
              {t('myProfile.tryAgain', 'Try Again')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const profileData = profile || {};
  const firstName = profileData.firstName || profileData.FirstName || 'User';
  const lastName = profileData.lastName || profileData.LastName || '';
  const email = profileData.email || profileData.Email || '';
  const companyName = profileData.companyName || profileData.CompanyName;
  const bio =
    profileData.businessDescription ||
    profileData.BusinessDescription ||
    t('myProfile.noBio', 'No bio available.');
  const initials = firstName.charAt(0).toUpperCase();

  return (
    <div className="my-profile-container">
      <header className="my-profile-header">
        <div className="header-inner">
          <h1>{t('myProfile.title')}</h1>
          <p>{t('myProfile.description')}</p>
        </div>
      </header>

      <div className="my-profile-content-wrapper">
        {/* Public Profile Card */}
        <div className="profile-card public-profile-card">
          <div className="card-banner" />

          <div className="avatar-overlap-wrapper">
            <div className="avatar-circle">{initials}</div>
            <button
              className="btn-edit-floating"
              onClick={() => navigate('/dashboard/profile/edit-public')}
            >
              <FontAwesomeIcon icon={faPencilAlt} />
            </button>
          </div>

          <div className="card-main-content">
            <div className="name-details">
              <h2>{firstName} {lastName}</h2>
              <p className="email-text">{email}</p>
            </div>

            <div className="profile-details-list">
              {companyName && (
                <div className="detail-item">
                  <div className="detail-icon">
                    <FontAwesomeIcon icon={faBuilding} />
                  </div>
                  <span className="detail-val">{companyName}</span>
                </div>
              )}
              <p className="bio-text">{bio}</p>
            </div>
          </div>
        </div>

        {/* Business Profile Card */}
        <div className="profile-card info-card">
          <div className="card-header-row">
            <div className="title-with-icon">
              <div className="title-icon green">
                <FontAwesomeIcon icon={faBriefcase} />
              </div>
              <div className="title-text">
                <h3>{t('myProfile.businessProfile')}</h3>
                <p>{t('myProfile.grantInfo')}</p>
              </div>
            </div>
            <button
              className="btn-edit-small"
              onClick={() => navigate('/dashboard/profile/edit-business')}
            >
              <FontAwesomeIcon icon={faPencilAlt} />
            </button>
          </div>

          <div className="card-body">
            {!companyName ? (
              <div className="empty-state">{t('myProfile.incomplete')}</div>
            ) : (
              <div className="business-summary">
                <div className="summary-item">
                  <strong>{t('myProfile.industry')}</strong>{' '}
                  {profileData.industry || profileData.Industry || t('myProfile.notSet')}
                </div>
                <div className="summary-item">
                  <strong>{t('myProfile.stage')}</strong>{' '}
                  {profileData.stage || profileData.Stage || t('myProfile.notSet')}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Settings Card */}
        <div className="profile-card info-card">
          <div className="card-header-row">
            <div className="title-with-icon">
              <div className="title-icon green">
                <FontAwesomeIcon icon={faCog} />
              </div>
              <div className="title-text">
                <h3>{t('myProfile.settings')}</h3>
              </div>
            </div>
            <button
              className="btn-edit-small"
              onClick={() => navigate('/dashboard/profile/settings')}
            >
              <FontAwesomeIcon icon={faPencilAlt} />
            </button>
          </div>

          <div className="card-body">
            <div className="settings-section">
              <div className="section-subtitle">
                <FontAwesomeIcon icon={faBell} className="label-icon" />
                {t('myProfile.notifications')}
              </div>
              <ul className="settings-list">
                <li>
                  <FontAwesomeIcon icon={faCircle} className="dot" />
                  {t('myProfile.emailEnabled')}
                </li>
                <li>
                  <FontAwesomeIcon icon={faCircle} className="dot" />
                  {t('myProfile.newGalasDisabled')}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <button className="btn-logout" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} />
          {t('myProfile.logout')}
        </button>
      </div>
    </div>
  );
}