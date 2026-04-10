import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faBookmark,
  faChevronLeft,
  faChevronRight,
  faFileLines,
  faGlobe,
  faLock,
  faRightFromBracket,
  faShieldHalved,
  faTrash,
  faUserGroup,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { showLogoutModal, setNotificationSettings } from '../../Store/Common';
import type { RootState } from '../../Store';
import {
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} from '../../Services/Api/module/NotificationApi';

import './ProfileEdits.scss';
import './Subscription.scss';
import SubscriptionBanner from './SubscriptionBanner';

export default function AccountSettings() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation('settings');
  const savedSettings = useSelector(
    (state: RootState) => state.common.notificationSettings
  );

  const [toggles, setToggles] = useState({
    email: savedSettings?.email ?? true,
    push: savedSettings?.push ?? true,
  });

  const { data: notificationSettings } = useGetNotificationSettingsQuery();
  const [updateSettings] = useUpdateNotificationSettingsMutation();

  useEffect(() => {
    if (notificationSettings) {
      const newSettings = {
        email: notificationSettings.emailNotifications,
        push: notificationSettings.pushNotifications,
      };
      setToggles(newSettings);
      dispatch(setNotificationSettings(newSettings));
    }
  }, [notificationSettings, dispatch]);

  const toggle = async (key: keyof typeof toggles) => {
    const nextValue = !toggles[key];
    const newLocalToggles = { ...toggles, [key]: nextValue };
    setToggles(newLocalToggles);
    dispatch(setNotificationSettings(newLocalToggles));

    try {
      await updateSettings({
        emailNotifications: newLocalToggles.email,
        pushNotifications: newLocalToggles.push,
      }).unwrap();
    } catch (err) {
      const revertedToggles = { ...toggles, [key]: !nextValue };
      setToggles(revertedToggles);
      dispatch(setNotificationSettings(revertedToggles));
      console.error('Failed to update notification settings:', err);
    }
  };

  const handleLogout = () => {
    dispatch(showLogoutModal());
  };

  return (
    <div className="account-settings-page">
      <header className="account-settings-header">
        <div className="header-inner">
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate(-1)}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
            {t('accountSettings.back')}
          </button>
          <div className="header-copy">
            <h1>{t('accountSettings.title')}</h1>
            <p>{t('accountSettings.description')}</p>
          </div>
        </div>
      </header>

      <div className="account-settings-content">
        <div className="account-settings-grid">
          <div className="account-settings-main">
            <SubscriptionBanner />

            <div className="section settings-section-card">
              <div className="section-header">
                <h3>
                  <FontAwesomeIcon icon={faBell} />
                  {t('accountSettings.notifications')}
                </h3>
              </div>
              <div className="settings-list">
                <div className="setting-toggle">
                  <div className="st-info">
                    <h4>{t('accountSettings.emailNotifications')}</h4>
                    <p>{t('accountSettings.emailDescription')}</p>
                  </div>
                  <div
                    className={`toggle-switch ${toggles.email ? 'on' : ''}`}
                    onClick={() => toggle('email')}
                  />
                </div>
                <div className="setting-toggle">
                  <div className="st-info">
                    <h4>{t('accountSettings.pushNotifications')}</h4>
                    <p>{t('accountSettings.pushDescription')}</p>
                  </div>
                  <div
                    className={`toggle-switch ${toggles.push ? 'on' : ''}`}
                    onClick={() => toggle('push')}
                  />
                </div>
              </div>
            </div>
          </div>

          <aside className="account-settings-side">
            <div className="section settings-section-card">
              <div className="section-header">
                <h3>
                  <FontAwesomeIcon icon={faUserGroup} />
                  {t('accountSettings.account')}
                </h3>
              </div>
              <div className="settings-list">
                <div
                  className="account-action"
                  onClick={() => navigate('/dashboard/galas/saved')}
                >
                  <div className="aa-icon">
                    <FontAwesomeIcon icon={faBookmark} />
                  </div>
                  <div className="aa-text">
                    <h5>{t('accountSettings.savedGalas')}</h5>
                  </div>
                  <FontAwesomeIcon icon={faChevronRight} className="chevron" />
                </div>

                <div
                  className="account-action"
                  onClick={() =>
                    navigate('/dashboard/profile/settings/change-password')
                  }
                >
                  <div className="aa-icon">
                    <FontAwesomeIcon icon={faLock} />
                  </div>
                  <div className="aa-text">
                    <h5>{t('accountSettings.changePassword')}</h5>
                  </div>
                  <FontAwesomeIcon icon={faChevronRight} className="chevron" />
                </div>

                <div
                  className="account-action"
                  onClick={() =>
                    navigate('/dashboard/profile/settings/language')
                  }
                >
                  <div className="aa-icon">
                    <FontAwesomeIcon icon={faGlobe} />
                  </div>
                  <div className="aa-text">
                    <h5>{t('accountSettings.language')}</h5>
                  </div>
                  <span className="badge-en">
                    {t('accountSettings.languageCode')}
                  </span>
                  <FontAwesomeIcon icon={faChevronRight} className="chevron" />
                </div>

                <div
                  className="account-action"
                  onClick={() =>
                    navigate('/dashboard/profile/settings/privacy')
                  }
                >
                  <div className="aa-icon">
                    <FontAwesomeIcon icon={faShieldHalved} />
                  </div>
                  <div className="aa-text">
                    <h5>{t('accountSettings.privacy')}</h5>
                  </div>
                  <FontAwesomeIcon icon={faChevronRight} className="chevron" />
                </div>

                <div
                  className="account-action"
                  onClick={() => navigate('/dashboard/profile/settings/terms')}
                >
                  <div className="aa-icon">
                    <FontAwesomeIcon icon={faFileLines} />
                  </div>
                  <div className="aa-text">
                    <h5>{t('accountSettings.termsConditions')}</h5>
                  </div>
                  <FontAwesomeIcon icon={faChevronRight} className="chevron" />
                </div>

                <div
                  className="account-action danger"
                  onClick={() =>
                    navigate('/dashboard/profile/settings/delete-account')
                  }
                >
                  <div className="aa-icon">
                    <FontAwesomeIcon icon={faTrash} />
                  </div>
                  <div className="aa-text">
                    <h5>{t('accountSettings.deleteAccount')}</h5>
                  </div>
                  <FontAwesomeIcon icon={faChevronRight} className="chevron" />
                </div>
              </div>
            </div>
          </aside>
        </div>

        <button type="button" className="logout-btn" onClick={handleLogout}>
          <FontAwesomeIcon icon={faRightFromBracket} />
          {t('accountSettings.logout')}
        </button>
      </div>
    </div>
  );
}
