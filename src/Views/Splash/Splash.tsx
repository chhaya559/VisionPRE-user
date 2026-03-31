import { useNavigate, useLocation } from 'react-router-dom';
import './styles.scss';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function SplashScreen() {
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/onboarding') {
      const timer = setTimeout(() => {
        navigate('/onboarding');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  const { t } = useTranslation('common');

  return (
    <div className="splashContainer">
      <img
        src="../../../assets/logoWithoutBG.png"
        alt="logo"
        className="logo"
      />

      <div className="textContainer">
        <h1>
          <span className="vision">{t('onboarding_title1')}</span>
          <span className="pme">{t('onboarding_title2')}</span>
        </h1>
        <p>{t('onboarding_Campaign')}</p>
      </div>

      <div className="loader-container">
        <div className="loader" />
        <span className="loading-text">{t('loading_string')}</span>
      </div>
    </div>
  );
}
