import React from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import PropTypes from "prop-types";

const typeIcons = {
  success: <CheckCircle className="text-green-600" size={20} />,
  error: <XCircle className="text-red-600" size={20} />,
  warning: <AlertTriangle className="text-yellow-500" size={20} />,
  info: <Info className="text-blue-500" size={20} />,
};

const Notification = ({ type = "success", message, onClose }) => {
  const icon = typeIcons[type] || typeIcons.success;

  return (
    <div
      role="alert"
      className="flex items-start gap-3 max-w-sm w-full p-4 rounded-lg shadow-md mb-4 border border-gray-300 bg-white dark:bg-gray-800 dark:text-white"
    >
      <div className="pt-1">{icon}</div>
      <div className="flex-1 text-sm font-medium">{message}</div>
      <button
        onClick={onClose}
        aria-label="Close"
        className="ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 p-1"
      >
        <X size={16} />
      </button>
    </div>
  );
};

Notification.propTypes = {
  type: PropTypes.oneOf(["success", "error", "warning", "info"]),
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Notification;
