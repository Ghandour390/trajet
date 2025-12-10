/**
 * Card Component
 * Reusable card container with optional header and footer
 */
export default function Card({
  children,
  title,
  subtitle,
  footer,
  padding = true,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
}) {
  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}>
      {(title || subtitle) && (
        <div className={`px-6 py-4 border-b border-gray-100 ${headerClassName}`}>
          {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      )}
      <div className={`${padding ? 'p-6' : ''} ${bodyClassName}`}>
        {children}
      </div>
      {footer && (
        <div className={`px-6 py-4 bg-gray-50 border-t border-gray-100 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
}
