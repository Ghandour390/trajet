import { STATUS_CONFIGS, DEFAULT_CONFIG } from '../../constants/statusConfigs';

/**
 * StatusBadge Component
 * Reusable status badge with configurable colors and labels
 */

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


