import React, { useEffect } from "react";
import { IconCheckCircle, IconAlertCircle, IconClose } from "./Icons";

export const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === "success";
  const isError = toast.type === "error";

  return (
    <div className={`toast-container ${toast.type}`}>
      <div className="toast-icon">
        {isSuccess ? <IconCheckCircle size={22} /> : <IconAlertCircle size={22} />}
      </div>
      <div className="toast-content">
        <p className="toast-title">{isSuccess ? "Success" : isError ? "Notice" : "Info"}</p>
        <p className="toast-message">{toast.message}</p>
      </div>
      <button className="toast-close" onClick={onClose} aria-label="Close notification">
        <IconClose size={16} />
      </button>
    </div>
  );
};
