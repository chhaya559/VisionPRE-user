import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "./style.scss"

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
};

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        globalThis.addEventListener("keydown", handleEsc);
        return () => globalThis.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div
            className="modal-overlay"
            onClick={onClose}
            aria-hidden="true"
        >
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="close-btn" onClick={onClose}>
                        &times;
                    </button>
                </div>

                <div className="modal-body">{children}</div>

                <div className="modal-footer">
                    <button className="btn-primary" onClick={onClose}>
                        I Understand
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;