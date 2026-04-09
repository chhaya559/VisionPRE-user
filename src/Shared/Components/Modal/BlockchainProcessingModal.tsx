import React from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown, faShield } from '@fortawesome/free-solid-svg-icons';
import './BlockchainProcessingModal.scss';

interface BlockchainProcessingModalProps {
  isOpen: boolean;
  status: string;
}

const BlockchainProcessingModal: React.FC<BlockchainProcessingModalProps> = ({ isOpen, status }) => {
  const { t } = useTranslation('private');

  if (!isOpen) return null;

  return (
    <div className="blockchain-processing-overlay">
      <div className="blockchain-processing-content">
        <div className="blockchain-processing-loader">
          <div className="blockchain-processing-spinner" />
          <div className="blockchain-processing-crown-inner">
            <FontAwesomeIcon icon={faCrown} />
          </div>
        </div>
        <h2 className="blockchain-processing-title">
          {t('subscription.processing.title') || 'Processing Transaction'}
        </h2>
        <p className="blockchain-processing-text">{status}</p>
        <div className="blockchain-processing-security">
          <FontAwesomeIcon icon={faShield} />
          <span>{t('subscription.processing.secureNote') || 'Secure transaction handled via MetaMask'}</span>
        </div>
      </div>
    </div>
  );
};

export default BlockchainProcessingModal;
