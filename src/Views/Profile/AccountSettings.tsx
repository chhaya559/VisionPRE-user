import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faChevronLeft,
  faChevronRight,
  faCrown,
  faFileLines,
  faGlobe,
  faLock,
  faQuestionCircle,
  faRightFromBracket,
  faShieldHalved,
  faTrash,
  faUserGroup,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { logout } from '../../Store/Common';
import { useLogoutMutation } from '../../Services/Api/module/AuthApi';
import type { RootState } from '../../Store';
import { useGetSubscriptionQuery } from '../../Services/Api/module/SubscriptionApi';
import api from '../../Services/Api/api';
import SubscriptionBanner from '../Settings/SubscriptionBanner';

import './ProfileEdits.scss';
import '../Settings/Subscription.scss';

export default function AccountSettings() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const refreshToken = useSelector(
    (state: RootState) => state.common.refreshToken
  );
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      if (refreshToken) {
        await logoutApi(refreshToken).unwrap();
      }
    } catch (err) {
      console.log('Logout error:', err);
    } finally {
      dispatch(logout());
      dispatch(api.util.resetApiState());
      navigate('/login', { replace: true });
    }
  };

  const [toggles, setToggles] = useState({
    email: true,
    push: true,
    newGalas: false,
    updates: true,
  });

  const toggle = (key: keyof typeof toggles) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const { t } = useTranslation('settings');
  const { data: subscriptionResponse, isLoading: isSubscriptionLoading } =
    useGetSubscriptionQuery(undefined);
  const subscription = subscriptionResponse?.data || subscriptionResponse;

  const isActive = subscription?.subscriptionStatus === 'Active';
  const planName =
    subscription?.subscriptionPlan || t('subscription.plans.free');
  // billingCycle 1 appears to be monthly in the users sample (price 19.99 is typically monthly)
  const isYearly = subscription?.billingCycle === 2;
  const planType = isYearly
    ? t('subscription.billing.yearly')
    : t('subscription.billing.monthly');
  const price = subscription?.price?.toFixed(2) || '0.00';
  const nextBilling = subscription?.expiryDate
    ? new Date(subscription.expiryDate).toLocaleDateString()
    : t('accountSettings.billingDate');

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
            {isSubscriptionLoading ? (
              <div
                className="premium-card loading-state"
                style={{ padding: '24px' }}
              >
                <p>Loading subscription details...</p>
              </div>
            ) : isActive ? (
              <div className="premium-card">
                <div className="pc-header">
                  <div className="pc-main">
                    <div className="pc-icon">
                      <FontAwesomeIcon icon={faCrown} />
                    </div>
                    <div className="pc-text">
                      <h4>{planName}</h4>
                      <p>{planType}</p>
                    </div>
                  </div>
                  <div
                    className={`pc-badge ${
                      !isActive ? 'pc-badge--inactive' : ''
                    }`}
                  >
                    {isActive
                      ? t('accountSettings.active')
                      : t('subscription.status.inactive')}
                  </div>
                </div>
                <div className="pc-meta">
                  <div className="meta-item">
                    <span className="label">
                      {t('accountSettings.nextBilling')}
                    </span>
                    <span className="val">{nextBilling}</span>
                  </div>
                  <div className="meta-item right">
                    <span className="label">{t('accountSettings.amount')}</span>
                    <span className="val">
                      ${price}
                      {isYearly
                        ? t('subscription.yearly')
                        : t('subscription.monthly')}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-manage"
                  onClick={() =>
                    navigate('/dashboard/profile/settings/subscription')
                  }
                >
                  {t('accountSettings.manageSubscription')}
                </button>
              </div>
            ) : (
              <SubscriptionBanner />
            )}

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
                <div className="setting-toggle">
                  <div className="st-info">
                    <h4>{t('accountSettings.newGalas')}</h4>
                    <p>{t('accountSettings.newGalasDescription')}</p>
                  </div>
                  <div
                    className={`toggle-switch ${toggles.newGalas ? 'on' : ''}`}
                    onClick={() => toggle('newGalas')}
                  />
                </div>
                <div className="setting-toggle">
                  <div className="st-info">
                    <h4>{t('accountSettings.applicationUpdates')}</h4>
                    <p>{t('accountSettings.applicationDescription')}</p>
                  </div>
                  <div
                    className={`toggle-switch ${toggles.updates ? 'on' : ''}`}
                    onClick={() => toggle('updates')}
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

            <div className="settings-help-card">
              <div className="help-icon">
                <FontAwesomeIcon icon={faQuestionCircle} />
              </div>
              <h4>{t('accountSettings.help')}</h4>
              <p>{t('accountSettings.helpDescription')}</p>
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
