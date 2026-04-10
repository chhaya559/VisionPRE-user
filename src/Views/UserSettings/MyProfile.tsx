import { useNavigate, useOutletContext } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showLogoutModal } from '../../Store/Common';
import { ensureAbsoluteUrl, formatList } from '../../Shared/Utils';
import type { UserProfile } from '../../Shared/Types';
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

import Skeleton from '../../Shared/Components/Skeleton/Skeleton';

export default function MyProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation('settings');
  const { profile, profileLoading, profileError } =
    useOutletContext<DashboardOutletContext>();

  const handleLogout = () => {
    dispatch(showLogoutModal());
  };

  if (profileLoading) {
    return (
      <div className="my-profile-container">
        <header className="my-profile-header">
          <div className="header-inner">
            <Skeleton variant="text" width={150} height={32} />
            <Skeleton variant="text" width={250} height={20} />
          </div>
        </header>

        <div className="my-profile-content-wrapper">
          <div className="profile-card public-profile-card">
            <div className="card-banner" />
            <div className="avatar-overlap-wrapper">
              <Skeleton variant="circle" width={100} height={100} />
            </div>
            <div className="card-main-content">
              <div className="name-details">
                <Skeleton variant="text" width={200} height={28} />
                <Skeleton variant="text" width={150} height={18} />
              </div>
              <div className="profile-details-list">
                <Skeleton variant="text" width="100%" height={60} />
              </div>
            </div>
          </div>

          <div className="profile-card info-card">
            <div className="card-header-row">
              <Skeleton variant="rect" width="100%" height={60} />
            </div>
          </div>
        </div>
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
          <h2 className="my-profile-error-title">{t('myProfile.error')}</h2>
          <p className="my-profile-error-desc">
            {t('myProfile.errorDescription')}
          </p>
          <div className="my-profile-error-actions">
            <button
              type="button"
              className="btn-error-action btn-primary"
              onClick={() => window.location.reload()}
            >
              <FontAwesomeIcon icon={faRedo} />
              {t('myProfile.tryAgain')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const profileData = (profile || {}) as UserProfile;
  const firstName = profileData.firstName || 'User';
  const lastName = profileData.lastName || '';
  const email = profileData.email || '';
  const companyName = profileData.companyName;
  const bio = profileData.businessDescription || t('myProfile.noBio');
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
            <div className="avatar-circle">
              {profileData.avatarUrl ? (
                <img
                  src={ensureAbsoluteUrl(profileData.avatarUrl) || ''}
                  alt="Avatar"
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                initials
              )}
            </div>
            <button
              type="button"
              className="btn-edit-floating"
              onClick={() => navigate('/dashboard/profile/edit-public')}
            >
              <FontAwesomeIcon icon={faPencilAlt} />
            </button>
          </div>

          <div className="card-main-content">
            <div className="name-details">
              <h2>
                {firstName} {lastName}
              </h2>
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
              type="button"
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
                  {formatList(profileData.industry) ||
                    t('myProfile.notSet')}
                </div>
                <div className="summary-item">
                  <strong>{t('myProfile.stage')}</strong>{' '}
                  {profileData.stage ||
                    t('myProfile.notSet')}
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
              type="button"
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

        <button type="button" className="btn-logout" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} />
          {t('myProfile.logout')}
        </button>
      </div>
    </div>
  );
}
