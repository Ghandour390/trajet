/**
 * StatusBadge Component
 * Reusable status badge with configurable colors and labels
 */

// Predefined status configurations
const STATUS_CONFIGS = {
  // Trip statuses
  planned: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    text: 'text-yellow-700 dark:text-yellow-400',
    dot: 'bg-yellow-500',
    label: 'Planifié'
  },
  in_progress: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-400',
    dot: 'bg-blue-500',
    label: 'En cours'
  },
  completed: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-400',
    dot: 'bg-green-500',
    label: 'Terminé'
  },
  cancelled: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-400',
    dot: 'bg-red-500',
    label: 'Annulé'
  },
  pending: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-500',
    label: 'En attente'
  },
  
  // Vehicle statuses
  active: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-400',
    dot: 'bg-green-500',
    label: 'Actif'
  },
  in_use: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-400',
    dot: 'bg-blue-500',
    label: 'En utilisation'
  },
  maintenance: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-500',
    label: 'En maintenance'
  },
  inactive: {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-600 dark:text-gray-400',
    dot: 'bg-gray-400',
    label: 'Inactif'
  },

  // User roles
  admin: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-700 dark:text-purple-400',
    dot: 'bg-purple-500',
    label: 'Administrateur'
  },
  chauffeur: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-400',
    dot: 'bg-blue-500',
    label: 'Chauffeur'
  },
  manager: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-400',
    dot: 'bg-green-500',
    label: 'Manager'
  },
};

// Default config for unknown statuses
const DEFAULT_CONFIG = {
  bg: 'bg-gray-100 dark:bg-gray-800',
  text: 'text-gray-600 dark:text-gray-400',
  dot: 'bg-gray-400',
  label: ''
};

export default function StatusBadge({ 
  status, 
  customLabel,
  showDot = true,
  size = 'md',
  className = ''
}) {
  const config = STATUS_CONFIGS[status] || DEFAULT_CONFIG;
  const label = customLabel || config.label || status;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-xs',
    lg: 'px-4 py-2 text-sm'
  };

  const dotSizes = {
    sm: 'w-1 h-1',
    md: 'w-1.5 h-1.5',
    lg: 'w-2 h-2'
  };

  return (
    <span 
      className={`
        inline-flex items-center gap-1.5 rounded-full font-semibold
        ${config.bg} ${config.text} ${sizeClasses[size]} ${className}
      `}
    >
      {showDot && (
        <span className={`rounded-full ${config.dot} ${dotSizes[size]}`} />
      )}
      {label}
    </span>
  );
}

// Export configs for custom usage
export { STATUS_CONFIGS };
