/**
 * Button Component
 * Reusable button with variants, sizes and loading state - Professional design with dark mode
 */
function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  className = '',
  ...props
}) {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-semibold rounded-xl
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    dark:focus:ring-offset-slate-900
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    active:scale-[0.98]
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-primary-500 to-primary-600
      hover:from-primary-600 hover:to-primary-700
      text-white shadow-lg shadow-primary-500/25
      hover:shadow-xl hover:shadow-primary-500/30
      focus:ring-primary-500
    `,
    secondary: `
      bg-gradient-to-r from-secondary-500 to-secondary-600
      hover:from-secondary-600 hover:to-secondary-700
      text-white shadow-lg shadow-secondary-500/25
      hover:shadow-xl hover:shadow-secondary-500/30
      focus:ring-secondary-500
    `,
    outline: `
      border-2 border-primary-500 text-primary-600
      dark:border-primary-400 dark:text-primary-400
      hover:bg-primary-50 dark:hover:bg-primary-900/20
      focus:ring-primary-500
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-red-600
      hover:from-red-600 hover:to-red-700
      text-white shadow-lg shadow-red-500/25
      hover:shadow-xl hover:shadow-red-500/30
      focus:ring-red-500
    `,
    success: `
      bg-gradient-to-r from-green-500 to-green-600
      hover:from-green-600 hover:to-green-700
      text-white shadow-lg shadow-green-500/25
      hover:shadow-xl hover:shadow-green-500/30
      focus:ring-green-500
    `,
    ghost: `
      text-gray-600 dark:text-gray-300
      hover:bg-gray-100 dark:hover:bg-slate-800
      focus:ring-gray-500
    `,
    glass: `
      bg-white/10 backdrop-blur-md
      border border-white/20
      text-white hover:bg-white/20
      focus:ring-white/50
    `,
  };

  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
    xl: 'px-6 py-3.5 text-lg',
  };

  const iconSizes = {
    xs: 14,
    sm: 16,
    md: 18,
    lg: 20,
    xl: 22,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg 
            className="animate-spin" 
            width={iconSizes[size]} 
            height={iconSizes[size]} 
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Chargement...</span>
        </span>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={iconSizes[size]} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon size={iconSizes[size]} />}
        </>
      )}
    </button>
  );
}

export default Button;
export { Button };
