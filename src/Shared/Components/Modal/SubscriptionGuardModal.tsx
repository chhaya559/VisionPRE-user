import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import Modal from './index';

interface SubscriptionGuardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscriptionGuardModal: React.FC<SubscriptionGuardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation('private');
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onClose();
    navigate('/dashboard/profile/settings/plans');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('galas.grants.subscriptionRequired')}
      showFooter={false}
    >
      <div style={{ textAlign: 'center', padding: '20px 10px' }}>
        <div
          style={{
            fontSize: '48px',
            color: '#fbbf24',
            marginBottom: '20px',
            filter: 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.2))',
          }}
        >
          <FontAwesomeIcon icon={faCrown} />
        </div>
        <h3
          style={{
            margin: '0 0 12px 0',
            fontSize: '20px',
            fontWeight: 700,
            color: '#1e293b',
          }}
        >
          {t('galas.grants.subscriptionRequired')}
        </h3>
        <p
          style={{
            margin: '0 0 24px 0',
            color: '#64748b',
            lineHeight: '1.6',
            fontSize: '15px',
          }}
        >
          {t('galas.grants.subscriptionRequiredDesc')}
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            style={{
              backgroundColor: '#f1f5f9',
              color: '#475569',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '10px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {t('galas.grants.back')}
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={handleUpgrade}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '10px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)',
              transition: 'all 0.2s',
            }}
          >
            <FontAwesomeIcon icon={faCrown} style={{ marginRight: '8px' }} />
            {t('galas.grants.upgradeNow')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SubscriptionGuardModal;
