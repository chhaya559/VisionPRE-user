import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './style.scss';
import { useTranslation } from 'react-i18next';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  showFooter?: boolean;
};

function Modal({
  isOpen,
  onClose,
  title,
  children,
  showFooter = true,
}: ModalProps) {
  const { t } = useTranslation('terms');
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    globalThis.addEventListener('keydown', handleEsc);
    return () => globalThis.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose} aria-hidden="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button type="button" className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">{children}</div>

        {showFooter && (
          <div className="modal-footer">
            <button type="button" className="btn-primary" onClick={onClose}>
              {t('I_understand')}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

export default Modal;
