import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../Store';
import './AuthScreens.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { ROUTES_CONFIG } from '../../Shared/Constants';

export default function EmailVerification() {
  const navigate = useNavigate();
  const email = useSelector((state: RootState) => state.common.email);
  const { t } = useTranslation('common');
  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="illustration-circle">
          <FontAwesomeIcon icon={faEnvelope} className="main-icon" />
        </div>
        <h1>{t('check_email')}</h1>
        <p className="subtitle">{t('email_verify_str1')}</p>
        <span className="target-email">{email || 'your email'}</span>
        <p className="instruction-text">{t('email_verify_str1')}</p>

        <button
          className="btn-primary"
          onClick={() => window.open('https://mail.google.com', '_blank')}
        >
          <FontAwesomeIcon icon={faEnvelope} />
          {t('open_email')}
        </button>

        <div className="footer-links">
          <div className="footer-item">
            {t('dont_receive_email')}{' '}
            <span className="link">{t('resend')}</span>
          </div>
          <div className="footer-item">
            {t('wrong_email')}
            <span
              className="link"
              onClick={() => navigate(ROUTES_CONFIG.CREATE_ACCOUNT.path)}
            >
              {t('change_it')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
