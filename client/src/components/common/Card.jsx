/**
 * Card Component
 * Reusable card container with optional header and footer - Professional design with dark mode
 */
export default function Card({
  children,
  title,
  subtitle,
  footer,
  action,
  padding = true,
  hoverable = false,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
}) {
  return (
    <div 
      className={`
        bg-white dark:bg-slate-800 
        rounded-2xl 
        shadow-sm hover:shadow-md
        border border-gray-100 dark:border-slate-700
        overflow-hidden 
        transition-all duration-300
        ${hoverable ? 'hover:-translate-y-1 hover:shadow-xl cursor-pointer' : ''}
        ${className}
      `}
    >
      {(title || subtitle || action) && (
        <div className={`px-6 py-4 border-b border-gray-100 dark:border-slate-700 ${headerClassName}`}>
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
            {action && (
              <div className="flex-shrink-0">
                {action}
              </div>
            )}
          </div>
        </div>
      )}
      <div className={`${padding ? 'p-6' : ''} ${bodyClassName}`}>
        {children}
      </div>
      {footer && (
        <div className={`px-6 py-4 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-700 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
}
