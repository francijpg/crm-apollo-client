import React from "react";

const Alert = ({ alert }) => {
  if (!alert) return null;
  const { message, type } = alert;

  return (
    <div className="modal-background">
      <div className={`alert ${type}`}>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Alert;
