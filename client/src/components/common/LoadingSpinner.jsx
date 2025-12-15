/**
 * LoadingSpinner Component
 * Reusable loading indicator
 */
export default function LoadingSpinner({ 
  size = 'md', 
  className = '',
  color = 'primary'
}) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'border-primary-200 dark:border-primary-900 border-t-primary-500',
    white: 'border-white/30 border-t-white',
    gray: 'border-gray-200 dark:border-gray-700 border-t-gray-500'
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className="relative">
        <div 
          className={`
            ${sizeClasses[size]} 
            rounded-full border-4 
            ${colorClasses[color].split(' ').slice(0, 2).join(' ')}
          `}
        />
        <div 
          className={`
            ${sizeClasses[size]} 
            rounded-full border-4 border-transparent
            ${colorClasses[color].split(' ').slice(2).join(' ')}
            animate-spin absolute top-0 left-0
          `}
        />
      </div>
    </div>
  );
}

// Full page loading variant
export function PageLoader({ message = 'Chargement...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-12">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-gray-500 dark:text-slate-400">{message}</p>
    </div>
  );
}
