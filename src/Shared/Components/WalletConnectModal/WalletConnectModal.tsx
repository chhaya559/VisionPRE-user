import React from 'react';
import './WalletConnectModal.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

type WalletConnectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => void;
};

const WalletConnectModal: React.FC<WalletConnectModalProps> = ({
  isOpen,
  onClose,
  onConnect,
}) => {
  const { t } = useTranslation('settings');

  if (!isOpen) return null;

  return (
    <div className="wallet-modal-overlay" onClick={onClose}>
      <div
        className="wallet-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="wallet-modal-icon">
          <FontAwesomeIcon icon={faWallet} />
        </div>
        <div className="wallet-modal-content">
          <h2>{t('subscription.connectWallet', 'Connect Wallet')}</h2>
          <p>
            {t(
              'subscription.connectWalletPrompt',
              'Please connect your crypto wallet to proceed with the subscription.'
            )}
          </p>
        </div>
        <div className="wallet-modal-actions">
          <button type="button" className="btn-connect" onClick={onConnect}>
            <FontAwesomeIcon icon={faWallet} />
            {t('subscription.connectWallet', 'Connect Wallet')}
          </button>
          <button type="button" className="btn-cancel" onClick={onClose}>
            {t('deleteAccount.cancel', 'Cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectModal;
