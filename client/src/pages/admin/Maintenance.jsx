import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus, Wrench, Truck, Calendar, Gauge, FileText } from 'lucide-react';
import { Card, Table, PageHeader, SearchFilter } from '../../components/common';
import {
  getMaintenanceRecords,
  selectMaintenanceRecords,
  selectMaintenanceLoading,
} from '../../store/slices/maintenanceSlice';

/**
 * AdminMaintenance Page
 * Maintenance management for admin
 */
export default function AdminMaintenance() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const maintenanceRecords = useSelector(selectMaintenanceRecords);
  const loading = useSelector(selectMaintenanceLoading);

  // Local state
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch data on mount
  useEffect(() => {
    dispatch(getMaintenanceRecords());
  }, [dispatch]);

  // Filter records
  const filteredRecords = maintenanceRecords.filter((record) => {
    const matchesSearch =
      record.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.vehicleRef?.plateNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });



  const columns = [
    {
      header: 'Véhicule',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <Truck size={16} className="text-primary-600 dark:text-primary-400" />
          </div>
          <span className="font-semibold text-gray-900 dark:text-white">{row.vehicleRef?.plateNumber || '-'}</span>
        </div>
      ),
    },
    {
      header: 'Marque',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-300">{row.vehicleRef?.brand || '-'}</span>
      ),
    },
    {
      header: 'Type',
      accessor: 'type',
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
          <Wrench size={12} />
          {row.type}
        </span>
      ),
    },
    {
      header: 'Kilométrage',
      render: (row) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {row.km ? `${row.km.toLocaleString()} km` : '-'}
        </span>
      ),
    },
    {
      header: 'Notes',
      accessor: 'notes',
      render: (row) => (
        <span className="truncate max-w-xs block text-gray-600 dark:text-gray-300">{row.notes || '-'}</span>
      ),
    },
    {
      header: 'Coût',
      render: (row) => (
        <span className="font-semibold text-green-600 dark:text-green-400">
          {row.cost ? `${row.cost.toLocaleString()} MAD` : '-'}
        </span>
      ),
    },
    {
      header: 'Date',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-300">
          {row.date ? new Date(row.date).toLocaleDateString('fr-FR') : '-'}
        </span>
      ),
    },
  ];

  // Get type color
  const getTypeColor = (type) => {
    const colors = {
      'Vidange': { bg: 'from-blue-500 to-blue-600', icon: 'bg-blue-400/20' },
      'Révision': { bg: 'from-purple-500 to-purple-600', icon: 'bg-purple-400/20' },
      'Changement pneus': { bg: 'from-amber-500 to-amber-600', icon: 'bg-amber-400/20' },
      'Freins': { bg: 'from-red-500 to-red-600', icon: 'bg-red-400/20' },
      'Moteur': { bg: 'from-gray-600 to-gray-700', icon: 'bg-gray-400/20' },
      'Contrôle technique': { bg: 'from-green-500 to-green-600', icon: 'bg-green-400/20' },
    };
    return colors[type] || { bg: 'from-slate-500 to-slate-600', icon: 'bg-slate-400/20' };
  };

  // Mobile Card Renderer for Maintenance
  const renderMobileCard = (row, index) => {
    const typeColor = getTypeColor(row.type);
    
    return (
      <div
        key={row._id || index}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden"
      >
        {/* Card Header */}
        <div className={`bg-gradient-to-r ${typeColor.bg} px-4 py-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${typeColor.icon} flex items-center justify-center`}>
                <Wrench size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">{row.type}</h3>
                <p className="text-white/80 text-sm">{row.vehicleRef?.plateNumber || 'N/A'}</p>
              </div>
            </div>
            {row.cost && (
              <span className="px-3 py-1 bg-white/20 rounded-full text-white font-semibold text-sm">
                {row.cost.toLocaleString()} MAD
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-3">
          {/* Vehicle Brand */}
          {row.vehicleRef?.brand && (
            <div className="flex items-center gap-2 text-sm">
              <Truck size={16} className="text-gray-400 dark:text-slate-500" />
              <span className="text-gray-500 dark:text-slate-400">Marque:</span>
              <span className="font-medium text-gray-900 dark:text-white">{row.vehicleRef.brand}</span>
            </div>
          )}

          {/* Km & Date Row */}
          <div className="grid grid-cols-2 gap-3">
            {row.km && (
              <div className="flex items-center gap-2 text-sm">
                <Gauge size={16} className="text-gray-400 dark:text-slate-500" />
                <span className="text-gray-500 dark:text-slate-400">Km:</span>
                <span className="font-medium text-gray-900 dark:text-white">{row.km.toLocaleString()}</span>
              </div>
            )}
            {row.date && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={16} className="text-gray-400 dark:text-slate-500" />
                <span className="text-gray-500 dark:text-slate-400">Date:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(row.date).toLocaleDateString('fr-FR')}
                </span>
              </div>
            )}
          </div>

          {/* Notes */}
          {row.notes && (
            <div className="flex items-start gap-2 text-sm pt-2 border-t border-gray-100 dark:border-slate-700">
              <FileText size={16} className="text-gray-400 dark:text-slate-500 mt-0.5" />
              <div>
                <span className="text-gray-500 dark:text-slate-400 block">Notes:</span>
                <span className="text-gray-700 dark:text-gray-300">{row.notes}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Maintenance"
        subtitle="Gérez les maintenances de vos véhicules"
        actionLabel="Planifier une maintenance"
        actionIcon={Plus}
        onAction={() => navigate('/admin/maintenance/create')}
      />

      {/* Filters */}
      <SearchFilter
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Rechercher par type ou véhicule..."
        showFilter={false}
      />

      {/* Maintenance Table */}
      <Card padding={false}>
        <Table
          columns={columns}
          data={filteredRecords}
          loading={loading}
          emptyMessage="Aucune maintenance trouvée"
          mobileCard={renderMobileCard}
        />
      </Card>


    </div>
  );
}
