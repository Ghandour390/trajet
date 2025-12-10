import { Table } from '../common';
import { Eye, Edit, Trash2 } from 'lucide-react';

/**
 * VehicleTable Component
 * Table for displaying vehicles list with actions
 */
export default function VehicleTable({
  vehicles,
  loading,
  onView,
  onEdit,
  onDelete,
}) {
  const getStatusBadge = (status) => {
    const statusStyles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
    };

    const statusLabels = {
      active: 'Actif',
      inactive: 'Inactif',
      maintenance: 'En maintenance',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || statusStyles.inactive}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

  const columns = [
    {
      header: 'Matricule',
      accessor: 'matricule',
      render: (row) => (
        <span className="font-medium text-gray-900">{row.matricule}</span>
      ),
    },
    {
      header: 'Marque / Modèle',
      render: (row) => (
        <span>{row.brand} {row.model}</span>
      ),
    },
    {
      header: 'Année',
      accessor: 'year',
    },
    {
      header: 'Kilométrage',
      render: (row) => (
        <span>{row.kilometrage?.toLocaleString() || 0} km</span>
      ),
    },
    {
      header: 'Statut',
      render: (row) => getStatusBadge(row.status),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(row);
            }}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Voir"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(row);
            }}
            className="p-1 text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
            title="Modifier"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(row);
            }}
            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Supprimer"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={vehicles}
      loading={loading}
      emptyMessage="Aucun véhicule trouvé"
      onRowClick={onView}
    />
  );
}
