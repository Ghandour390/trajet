import { Edit, Trash2 } from 'lucide-react';
import { Table, StatusBadge } from '../../components/common';

/**
 * TrailerTable Component
 * Table for displaying trailers list with actions.
 */
export default function TrailerTable({ trailers, onEdit, onDelete }) {
  const columns = [
    {
      header: 'Matricule',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
              {row.plateNumber?.slice(0, 2)}
            </span>
          </div>
          <span className="font-semibold text-gray-900 dark:text-white">{row.plateNumber}</span>
        </div>
      ),
    },
    {
      header: 'Type',
      render: (row) => <span className="text-gray-600 dark:text-gray-300">{row.type}</span>,
    },
    {
      header: 'Marque & Modèle',
      render: (row) => <span className="text-gray-600 dark:text-gray-300">{row.brand} {row.model}</span>,
    },
    {
      header: 'Capacité',
      render: (row) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {row.capacity?.toLocaleString() || 0} <span className="text-gray-400 dark:text-gray-500 text-xs">kg</span>
        </span>
      ),
    },
    {
      header: 'Statut',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(row); }}
            className="p-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg transition-all duration-200 hover:scale-110"
            title="Modifier"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(row); }}
            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200 hover:scale-110"
            title="Supprimer"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  const renderMobileCard = (row) => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white">{row.plateNumber}</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400">{row.brand} {row.model}</p>
        </div>
        <StatusBadge status={row.status} />
      </div>
      <div className="text-sm space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-slate-400">Type:</span>
          <span className="font-medium text-gray-800 dark:text-gray-200">{row.type}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-slate-400">Capacité:</span>
          <span className="font-medium text-gray-800 dark:text-gray-200">{row.capacity?.toLocaleString()} kg</span>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-700 flex gap-2">
        <button onClick={() => onEdit(row)} className="flex-1 py-2 text-sm font-semibold bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 rounded-lg">
          Modifier
        </button>
        <button onClick={() => onDelete(row)} className="flex-1 py-2 text-sm font-semibold bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-lg">
          Supprimer
        </button>
      </div>
    </div>
  );

  return (
    <Table
      columns={columns}
      data={trailers}
      emptyMessage="Aucune remorque trouvée"
      mobileCard={renderMobileCard}
    />
  );
}