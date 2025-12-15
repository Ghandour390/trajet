import { User } from 'lucide-react';

/**
 * Avatar Component
 * Reusable avatar with image or initials fallback
 */
export default function Avatar({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  className = '',
  gradient = 'from-primary-400 to-primary-600'
}) {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl'
  };

  const iconSizes = {
    xs: 12,
    sm: 14,
    md: 18,
    lg: 22,
    xl: 28,
    '2xl': 36
  };

  // Get initials from name
  const getInitials = (fullName) => {
    if (!fullName) return '';
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(name);

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full object-cover shadow-lg ${className}`}
      />
    );
  }

  return (
    <div
      className={`
        ${sizeClasses[size]} 
        rounded-full 
        bg-gradient-to-br ${gradient}
        flex items-center justify-center 
        text-white font-semibold shadow-lg
        ${className}
      `}
    >
      {initials || <User size={iconSizes[size]} />}
    </div>
  );
}
