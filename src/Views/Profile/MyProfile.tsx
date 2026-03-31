import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGetProfileQuery } from '../../Services/Api/module/UserApi';
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
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

export default function MyProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation('private');
  const { data: apiResponse, isLoading, error } = useGetProfileQuery({});

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div
        className="my-profile-container"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <div style={{ color: '#94A3B8' }}>{t('profile.myProfile.loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="my-profile-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          style={{ fontSize: '3rem', color: '#EF4444', marginBottom: '1rem' }}
        />
        <h2 style={{ color: '#1E293B', marginBottom: '8px' }}>
          {t('profile.myProfile.error')}
        </h2>
        <p
          style={{ color: '#64748B', maxWidth: '400px', marginBottom: '24px' }}
        >
          {t('profile.myProfile.errorDescription')}
        </p>
        <button
          className="btn-edit"
          style={{ background: '#1E293B', color: '#fff', padding: '10px 24px' }}
          onClick={() => window.location.reload()}
        >
          {t('profile.myProfile.tryAgain')}
        </button>
      </div>
    );
  }

  const profileData = (apiResponse as any)?.data || apiResponse || {};
  const firstName = profileData.firstName || profileData.FirstName || 'User';
  const lastName = profileData.lastName || profileData.LastName || '';
  const email = profileData.email || profileData.Email || '';
  const companyName = profileData.companyName || profileData.CompanyName;
  const bio =
    profileData.businessDescription ||
    profileData.BusinessDescription ||
    t('profile.myProfile.noBio');
  const initials = firstName.charAt(0).toUpperCase();

  return (
    <div className="my-profile-container">
      <header className="my-profile-header">
        <div className="header-inner">
          <h1>{t('profile.myProfile.title')}</h1>
          <p>{t('profile.myProfile.description')}</p>
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
                <h3>{t('profile.myProfile.businessProfile')}</h3>
                <p>{t('profile.myProfile.grantInfo')}</p>
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
              <div className="empty-state">{t('profile.myProfile.incomplete')}</div>
            ) : (
              <div className="business-summary">
                <div className="summary-item">
                  <strong>{t('profile.myProfile.industry')}</strong>{' '}
                  {profileData.industry || profileData.Industry || t('profile.myProfile.notSet')}
                </div>
                <div className="summary-item">
                  <strong>{t('profile.myProfile.stage')}</strong>{' '}
                  {profileData.stage || profileData.Stage || t('profile.myProfile.notSet')}
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
                <h3>{t('profile.myProfile.settings')}</h3>
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
                {t('profile.myProfile.notifications')}
              </div>
              <ul className="settings-list">
                <li>
                  <FontAwesomeIcon icon={faCircle} className="dot" /> {t('profile.myProfile.emailEnabled')}
                </li>
                <li>
                  <FontAwesomeIcon icon={faCircle} className="dot" /> {t('profile.myProfile.newGalasDisabled')}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <button className="btn-logout" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} />
          {t('profile.myProfile.logout')}
        </button>
      </div>
    </div>
  );
}
