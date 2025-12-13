import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * StatsCard Component
 * Card for displaying statistics with icon and trend - Professional design with dark mode
 */
export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = 'primary',
  className = '',
}) {
  const colorStyles = {
    primary: {
      bg: 'bg-primary-50 dark:bg-primary-900/30',
      icon: 'bg-gradient-to-br from-primary-500 to-primary-700',
      iconText: 'text-white',
      ring: 'ring-primary-500/20',
    },
    secondary: {
      bg: 'bg-secondary-50 dark:bg-secondary-900/30',
      icon: 'bg-gradient-to-br from-secondary-500 to-secondary-700',
      iconText: 'text-white',
      ring: 'ring-secondary-500/20',
    },
    success: {
      bg: 'bg-green-50 dark:bg-green-900/30',
      icon: 'bg-gradient-to-br from-green-500 to-green-700',
      iconText: 'text-white',
      ring: 'ring-green-500/20',
    },
    danger: {
      bg: 'bg-red-50 dark:bg-red-900/30',
      icon: 'bg-gradient-to-br from-red-500 to-red-700',
      iconText: 'text-white',
      ring: 'ring-red-500/20',
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-900/30',
      icon: 'bg-gradient-to-br from-amber-500 to-amber-600',
      iconText: 'text-white',
      ring: 'ring-amber-500/20',
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/30',
      icon: 'bg-gradient-to-br from-blue-500 to-blue-700',
      iconText: 'text-white',
      ring: 'ring-blue-500/20',
    },
  };

  const trendStyles = {
    up: {
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-100 dark:bg-green-900/40',
      icon: TrendingUp,
    },
    down: {
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-100 dark:bg-red-900/40',
      icon: TrendingDown,
    },
    neutral: {
      color: 'text-gray-600 dark:text-gray-400',
      bg: 'bg-gray-100 dark:bg-gray-800',
      icon: Minus,
    },
  };

  const currentColor = colorStyles[color] || colorStyles.primary;
  const currentTrend = trend ? trendStyles[trend] : null;
  const TrendIcon = currentTrend?.icon;

  return (
    <div 
      className={`
        relative overflow-hidden
        bg-white dark:bg-slate-800 
        rounded-2xl shadow-sm hover:shadow-xl
        border border-gray-100 dark:border-slate-700
        p-6 transition-all duration-300 
        hover:-translate-y-1 group
        ${className}
      `}
    >
      {/* Background Decoration */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${currentColor.bg} opacity-50 group-hover:scale-150 transition-transform duration-500`} />
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          
          {trend && trendValue && (
            <div className={`inline-flex items-center gap-1.5 mt-3 px-2.5 py-1 rounded-full text-xs font-semibold ${currentTrend.bg} ${currentTrend.color}`}>
              <TrendIcon size={14} />
              <span>{trendValue}</span>
            </div>
          )}
        </div>

        {Icon && (
          <div className={`
            p-3.5 rounded-2xl ${currentColor.icon} ${currentColor.iconText}
            shadow-lg ring-4 ${currentColor.ring}
            transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300
          `}>
            <Icon size={26} strokeWidth={2} />
          </div>
        )}
      </div>
    </div>
  );
}
