import { MoreVertical } from 'lucide-react';
import { useState } from 'react';

/**
 * Table Component
 * Reusable table with responsive card view on mobile - Professional design with dark mode
 */
export default function Table({
  columns,
  data,
  loading = false,
  emptyMessage = 'Aucune donnée disponible',
  onRowClick,
  className = '',
  // Mobile card configuration
  mobileCard, // Custom render function for mobile cards
  cardTitle, // Function to get card title from row
  cardSubtitle, // Function to get card subtitle from row
  cardBadge, // Function to render badge on card
  cardFields, // Array of { label, accessor/render } for card fields
  cardActions, // Function to render actions for card
}) {
  const [activeMenu, setActiveMenu] = useState(null);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-primary-200 dark:border-primary-900"></div>
          <div className="w-12 h-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="mt-4 text-gray-500 dark:text-slate-400 text-sm">Chargement...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <p className="text-gray-500 dark:text-slate-400">{emptyMessage}</p>
      </div>
    );
  }

  // Default mobile card renderer
  const renderMobileCard = (row, index) => {
    if (mobileCard) {
      return mobileCard(row, index);
    }

    return (
      <div
        key={row._id || index}
        onClick={() => onRowClick && onRowClick(row)}
        className={`
          bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700
          ${onRowClick ? 'cursor-pointer active:scale-[0.98]' : ''}
          transition-all duration-200
        `}
      >
        {/* Card Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            {cardTitle && (
              <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                {cardTitle(row)}
              </h3>
            )}
            {cardSubtitle && (
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
                {cardSubtitle(row)}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {cardBadge && cardBadge(row)}
            {cardActions && (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu(activeMenu === row._id ? null : row._id);
                  }}
                  className="p-1.5 text-gray-400 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <MoreVertical size={18} />
                </button>
                {activeMenu === row._id && (
                  <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden z-20 animate-fade-in">
                    {cardActions(row, () => setActiveMenu(null))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Card Fields */}
        {cardFields && (
          <div className="space-y-2">
            {cardFields.map((field, idx) => {
              const value = field.render ? field.render(row) : row[field.accessor];
              if (!value || value === '-') return null;
              return (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-slate-400">{field.label}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{value}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={className}>
      {/* Desktop Table View */}
      <div className="hidden tablet:block overflow-x-auto rounded-xl">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-900/50">
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-700/50">
            {data.map((row, rowIndex) => (
              <tr
                key={row._id || rowIndex}
                onClick={() => onRowClick && onRowClick(row)}
                className={`
                  bg-white dark:bg-slate-800/50
                  ${onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50' : ''}
                  transition-colors duration-150
                `}
              >
                {columns.map((column, colIndex) => (
                  <td 
                    key={colIndex} 
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200"
                  >
                    {column.render ? column.render(row) : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="tablet:hidden space-y-3 p-3">
        {data.map((row, index) => renderMobileCard(row, index))}
      </div>
    </div>
  );
}

