import React from "react";
import "../styles/successModal.css";

const SuccessModal = ({ isOpen, onClose, message = "Successful" }) => {
  if (!isOpen) return null;

  return (
    <div className="success-modal-overlay" role="dialog" aria-modal="true">
      <div className="success-modal-card">
        <p className="success-modal-text">{message}</p>
        <button className="success-modal-btn" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;


