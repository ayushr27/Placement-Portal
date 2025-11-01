/**
 * @file Notification.jsx
 * @description Government-themed notification system component with accessibility features
 * @author Training & Placement Cell, IIITDM Kurnool
 * @version 1.0.0
 * @date 2025-01-14
 * 
 * @module components/Notification
 * @requires react
 * @requires lucide-react
 * 
 * This component provides a professional notification system that replaces
 * basic toast notifications with government-themed, accessible alerts.
 * Supports success, error, warning, and info notification types.
 */

import { useEffect, useCallback, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const notificationStyles = {
  success: {
    container: 'bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500',
    icon: 'text-green-600',
    titleColor: 'text-green-900',
    textColor: 'text-green-800',
    Icon: CheckCircle,
  },
  error: {
    container: 'bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500',
    icon: 'text-red-600',
    titleColor: 'text-red-900',
    textColor: 'text-red-800',
    Icon: XCircle,
  },
  warning: {
    container: 'bg-gradient-to-r from-amber-50 to-amber-100 border-l-4 border-amber-500',
    icon: 'text-amber-600',
    titleColor: 'text-amber-900',
    textColor: 'text-amber-800',
    Icon: AlertCircle,
  },
  info: {
    container: 'bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500',
    icon: 'text-blue-600',
    titleColor: 'text-blue-900',
    textColor: 'text-blue-800',
    Icon: Info,
  },
};

/**
 * @function Notification
 * @description Individual notification component that displays a single alert message
 * 
 * @param {Object} props - Component properties
 * @param {string} [props.type='info'] - Notification type: 'success', 'error', 'warning', or 'info'
 * @param {string} props.title - Notification title text
 * @param {string} props.message - Notification message content
 * @param {function} props.onClose - Callback function to handle notification dismissal
 * @param {boolean} [props.autoClose=true] - Whether notification should auto-dismiss
 * @param {number} [props.duration=5000] - Duration in milliseconds before auto-dismiss
 * 
 * @returns {JSX.Element} Notification component
 */
export const Notification = ({ type = 'info', title, message, onClose, autoClose = true, duration = 5000 }) => {
  const style = notificationStyles[type] || notificationStyles.info;
  const IconComponent = style.Icon;

  useEffect(() => {
    if (autoClose && duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  return (
    <div
      className={`${style.container} rounded-lg shadow-lg p-4 mb-3 min-w-[320px] max-w-md animate-slide-in-right`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 ${style.icon}`}>
          <IconComponent size={24} strokeWidth={2.5} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className={`font-bold text-sm mb-1 ${style.titleColor}`}>
              {title}
            </h3>
          )}
          <p className={`text-sm ${style.textColor} leading-relaxed`}>
            {message}
          </p>
        </div>

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className={`flex-shrink-0 ${style.icon} hover:opacity-70 transition-opacity rounded-lg p-1 hover:bg-black/5`}
            aria-label="Close notification"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Progress Bar (if auto-closing) */}
      {autoClose && duration > 0 && (
        <div className="mt-3 h-1 bg-black/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-current opacity-40 animate-progress-bar"
            style={{
              animationDuration: `${duration}ms`,
            }}
          />
        </div>
      )}
    </div>
  );
};

/**
 * @function NotificationContainer
 * @description Container component that manages and displays multiple notifications
 * 
 * @param {Object} props - Component properties
 * @param {Array} props.notifications - Array of notification objects to display
 * @param {function} props.removeNotification - Function to remove a notification by ID
 * 
 * @returns {JSX.Element|null} Container with notifications or null if empty
 */
export const NotificationContainer = ({ notifications, removeNotification }) => {
  if (!notifications || notifications.length === 0) return null;

  return (
    <div
      className="fixed top-20 right-4 z-[9999] flex flex-col items-end pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex flex-col gap-2 pointer-events-auto">
        {notifications.map((notif) => (
          <Notification
            key={notif.id}
            type={notif.type}
            title={notif.title}
            message={notif.message}
            onClose={() => removeNotification(notif.id)}
            autoClose={notif.autoClose !== false}
            duration={notif.duration || 5000}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * @hook useNotification
 * @description Custom React hook for managing notification state and operations
 * 
 * @returns {Object} Notification management object
 * @returns {Array} notifications - Current array of notifications
 * @returns {function} addNotification - Add a new notification
 * @returns {function} removeNotification - Remove a notification by ID
 * @returns {function} showSuccess - Show a success notification
 * @returns {function} showError - Show an error notification
 * @returns {function} showWarning - Show a warning notification
 * @returns {function} showInfo - Show an info notification
 */
export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback(({ type, title, message, autoClose = true, duration = 5000 }) => {
    const id = Date.now() + Math.random();
    setNotifications((prev) => [...prev, { id, type, title, message, autoClose, duration }]);
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  const showSuccess = useCallback((message, title = 'Success!') => {
    return addNotification({ type: 'success', title, message });
  }, [addNotification]);

  const showError = useCallback((message, title = 'Error') => {
    return addNotification({ type: 'error', title, message });
  }, [addNotification]);

  const showWarning = useCallback((message, title = 'Warning') => {
    return addNotification({ type: 'warning', title, message });
  }, [addNotification]);

  const showInfo = useCallback((message, title = 'Info') => {
    return addNotification({ type: 'info', title, message });
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

export default Notification;

