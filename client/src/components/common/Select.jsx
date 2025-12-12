/**
 * Select Component
 * Reusable dropdown select with label and error state
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
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`
          w-full px-4 py-3 border rounded-lg
          focus:ring-2 focus:ring-primary-500 focus:border-transparent
          outline-none transition appearance-none
          bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : ''}
        `}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
