import { Table, StatusBadge } from '../common';
import { Eye, Edit, Trash2, Container, Calendar, Gauge } from 'lucide-react';

/**
 * TrailerTable Component
 * Table for displaying trailers list with actions - Professional design with dark mode
 * Shows cards on mobile for better UX
 */
export default function TrailerTable({
  trailers,
  loading,
  onView,
  onEdit,
  onDelete,
}) {
  const columns = [
    {
      header: 'Matricule',
      accessor: 'plateNumber',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
              {row.plateNumber?.slice(0, 2)}
            </span>
          </div>
          <span className="font-semibold text-gray-900 dark:text-white">{row.plateNumber}</span>
        </div>
      ),
    },
    {
      header: 'Type',
      accessor: 'type',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-300">{row.type}</span>
      ),
    },
    {
      header: 'Marque',
      accessor: 'brand',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-300">{row.brand}</span>
      ),
    },
    {
      header: 'Modèle',
      accessor: 'model',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-300">{row.model}</span>
      ),
    },
    {
      header: 'Capacité',
      render: (row) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {row.capacity} <span className="text-gray-400 dark:text-gray-500 text-xs">t</span>
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
            onClick={(e) => {
              e.stopPropagation();
              onView(row);
            }}
            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200 hover:scale-110"
            title="Voir"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(row);
            }}
            className="p-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg transition-all duration-200 hover:scale-110"
            title="Modifier"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(row);
            }}
            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200 hover:scale-110"
            title="Supprimer"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  // Mobile Card Renderer
  const renderMobileCard = (row, index) => (
    <div
      key={row._id || index}
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden"
    >
      {/* Card Header with gradient */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Container size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">{row.plateNumber}</h3>
              <p className="text-primary-100 text-sm">{row.brand} - {row.type}</p>
            </div>
          </div>
          <StatusBadge status={row.status} />
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-3">
        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar size={16} className="text-gray-400 dark:text-slate-500" />
            <span className="text-gray-500 dark:text-slate-400">Capacité:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{row.capacity || '-'} t</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Gauge size={16} className="text-gray-400 dark:text-slate-500" />
            <span className="text-gray-500 dark:text-slate-400">Km:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{row.currentKm?.toLocaleString() || 0}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-slate-700">
          <button
            onClick={() => onView(row)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl font-medium text-sm hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
          >
            <Eye size={16} />
            Voir
          </button>
          <button
            onClick={() => onEdit(row)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl font-medium text-sm hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
          >
            <Edit size={16} />
            Modifier
          </button>
          <button
            onClick={() => onDelete(row)}
            className="p-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Table
      columns={columns}
      data={trailers}
      loading={loading}
      emptyMessage="Aucune remorque trouvée"
      onRowClick={onView}
      mobileCard={renderMobileCard}
    />
  );
}
