import React from "react";
import "./ErrorMessage.scss";

const ErrorMessage = ({ message }) => {
  return (
    <div className="error-message-container">
      <p className="error-message">{message}</p>
    </div>
  );
};

export default ErrorMessage;
