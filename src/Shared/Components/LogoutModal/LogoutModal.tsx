import React from 'react';
import './LogoutModal.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSignOutAlt,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

type LogoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation('private');

  if (!isOpen) return null;

  return (
    <div className="logout-modal-overlay">
      <div className="logout-modal-container">
        <div className="logout-modal-icon">
          <FontAwesomeIcon icon={faExclamationTriangle} />
        </div>
        <div className="logout-modal-content">
          <h2>{t('logout.confirmTitle', 'Logout Confirmation')}</h2>
          <p>
            {t(
              'logout.confirmMessage',
              'Are you sure you want to logout? You will need to login again to access your account.'
            )}
          </p>
        </div>
        <div className="logout-modal-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>
            {t('logout.cancel', 'Cancel')}
          </button>
          <button type="button" className="btn-confirm" onClick={onConfirm}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            {t('logout.confirm', 'Yes, Logout')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
