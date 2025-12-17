import toast from 'react-hot-toast';

const success = (message) => {
  toast.success(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      color: '#fff',
      fontWeight: '600',
      padding: '16px 20px',
      borderRadius: '12px',
      boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4), 0 8px 10px -6px rgba(16, 185, 129, 0.3)',
      backdropFilter: 'blur(10px)',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#10B981',
    },
  });
};

const error = (message) => {
  toast.error(message, {
    duration: 5000,
    position: 'top-right',
    style: {
      background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      color: '#fff',
      fontWeight: '600',
      padding: '16px 20px',
      borderRadius: '12px',
      boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.4), 0 8px 10px -6px rgba(239, 68, 68, 0.3)',
      backdropFilter: 'blur(10px)',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#EF4444',
    },
  });
};

const info = (message) => {
  toast(message, {
    duration: 4000,
    position: 'top-right',
    icon: '💡',
    style: {
      background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      color: '#fff',
      fontWeight: '600',
      padding: '16px 20px',
      borderRadius: '12px',
      boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4), 0 8px 10px -6px rgba(59, 130, 246, 0.3)',
      backdropFilter: 'blur(10px)',
    },
  });
};

const warning = (message) => {
  toast(message, {
    duration: 4000,
    position: 'top-right',
    icon: '⚠️',
    style: {
      background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      color: '#fff',
      fontWeight: '600',
      padding: '16px 20px',
      borderRadius: '12px',
      boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.4), 0 8px 10px -6px rgba(245, 158, 11, 0.3)',
      backdropFilter: 'blur(10px)',
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
