import { Search } from 'lucide-react';
import Card from './Card';

/**
 * SearchFilter Component
 * Reusable search input with optional filter select
 */
export default function SearchFilter({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Rechercher...',
  filterValue,
  onFilterChange,
  filterOptions = [],
  filterPlaceholder = 'Tous',
  showFilter = true,
}) {
  return (
    <Card>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Filter Select */}
        {showFilter && filterOptions.length > 0 && (
          <div className="sm:w-48">
            <select
              value={filterValue}
              onChange={(e) => onFilterChange(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            >
              <option value="">{filterPlaceholder}</option>
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </Card>
  );
}
