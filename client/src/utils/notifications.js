import toast from 'react-hot-toast';

/**
 * Notification utility using react-hot-toast
 * Provides consistent notification styling across the app
 */

// Success notification
const success = (message) => {
  toast.success(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#10B981',
      color: '#fff',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#10B981',
    },
  });
};

// Error notification
const error = (message) => {
  toast.error(message, {
    duration: 5000,
    position: 'top-right',
    style: {
      background: '#EF4444',
      color: '#fff',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#EF4444',
    },
  });
};

// Info notification
const info = (message) => {
  toast(message, {
    duration: 4000,
    position: 'top-right',
    icon: 'ℹ️',
    style: {
      background: '#3B82F6',
      color: '#fff',
      fontWeight: '500',
    },
  });
};

// Warning notification
const warning = (message) => {
  toast(message, {
    duration: 4000,
    position: 'top-right',
    icon: '⚠️',
    style: {
      background: '#F59E0B',
      color: '#fff',
      fontWeight: '500',
    },
  });
};

// Loading notification (returns dismiss function)
const loading = (message) => {
  return toast.loading(message, {
    position: 'top-right',
    style: {
      background: '#6B7280',
      color: '#fff',
      fontWeight: '500',
    },
  });
};

// Dismiss a specific toast
const dismiss = (toastId) => {
  toast.dismiss(toastId);
};

// Dismiss all toasts
const dismissAll = () => {
  toast.dismiss();
};

// Export as notify object
export const notify = {
  success,
  error,
  info,
  warning,
  loading,
  dismiss,
  dismissAll,
};

export default notify;
