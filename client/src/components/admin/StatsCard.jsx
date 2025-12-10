/**
 * StatsCard Component
 * Card for displaying statistics with icon and trend
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
  const colors = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    success: 'bg-green-500',
    danger: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  };

  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-gray-500',
  };

  return (
    <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${trendColors[trend]}`}>
              {trend === 'up' && '↑'}
              {trend === 'down' && '↓'}
              {trendValue}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-full ${colors[color]} text-white`}>
            <Icon size={24} />
          </div>
        )}
      </div>
    </div>
  );
}
