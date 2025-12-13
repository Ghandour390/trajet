import { ChevronDown } from 'lucide-react';

/**
 * Select Component
 * Reusable dropdown select with label and error state - Professional design with dark mode
 */
export default function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Sélectionner...',
  error,
  required = false,
  disabled = false,
  icon: Icon,
  className = '',
  ...props
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon 
            size={20} 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 pointer-events-none" 
          />
        )}
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`
            w-full py-3 pr-10 border rounded-xl appearance-none
            ${Icon ? 'pl-12' : 'pl-4'}
            bg-white dark:bg-slate-800
            text-gray-900 dark:text-white
            focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
            dark:focus:ring-primary-400/20 dark:focus:border-primary-400
            outline-none transition-all duration-200 cursor-pointer
            ${error 
              ? 'border-red-500 dark:border-red-400 focus:ring-red-500/20' 
              : 'border-gray-200 dark:border-slate-600'
            }
            ${disabled 
              ? 'bg-gray-100 dark:bg-slate-700 cursor-not-allowed opacity-60' 
              : 'hover:border-gray-300 dark:hover:border-slate-500'
            }
          `}
          {...props}
        >
          <option value="" className="text-gray-400">{placeholder}</option>
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              className="text-gray-900 dark:text-white bg-white dark:bg-slate-800"
            >
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown 
          size={20} 
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 pointer-events-none" 
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
