import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Eye, MapPin, Truck, User, Calendar, Fuel, Route } from 'lucide-react';
import { Card, Table, PageHeader, SearchFilter, StatusBadge } from '../../components/common';
import {
  getTrips,
  selectTrips,
  selectTripsLoading,
} from '../../store/slices/tripsSlice';

/**
 * AdminTrips Page
 * Trip management for admin
 */
export default function AdminTrips() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const trips = useSelector(selectTrips);
  const loading = useSelector(selectTripsLoading);

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Fetch data on mount
  useEffect(() => {
    dispatch(getTrips());
  }, [dispatch]);

  // Filter trips
  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.origin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.destination?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || trip.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (trip) => {
    navigate(`/admin/trips/edit/${trip._id}`);
  };

  const handleView = (trip) => {
    navigate(`/admin/trips/view/${trip._id}`);
  };

  // Status options for filter
  const statusOptions = [
    { value: 'planned', label: 'Planifié' },
    { value: 'in_progress', label: 'En cours' },
    { value: 'completed', label: 'Terminé' },
    { value: 'cancelled', label: 'Annulé' },
  ];

  const columns = [
    {
      header: 'Référence',
      accessor: 'reference',
      render: (row) => (
        <span className="font-semibold text-gray-900 dark:text-white">{row.reference}</span>
      ),
    },
    {
      header: 'Origine',
      accessor: 'origin',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-300">{row.origin}</span>
      ),
    },
    {
      header: 'Destination',
      accessor: 'destination',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-300">{row.destination}</span>
      ),
    },
    {
      header: 'Véhicule',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-300">{row.vehicleRef?.plateNumber || '-'}</span>
      ),
    },
    {
      header: 'Remorque',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-300">{row.trailerRef?.plateNumber || '-'}</span>
      ),
    },
    {
      header: 'Chauffeur',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-300">
          {row.assignedTo ? `${row.assignedTo.firstname} ${row.assignedTo.lastname}` : '-'}
        </span>
      ),
    },
    {
      header: 'Distance',
      render: (row) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {row.endKm && row.startKm ? `${row.endKm - row.startKm} km` : `${row.startKm || 0} km`}
        </span>
      ),
    },
    {
      header: 'Carburant',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-300">{row.fuelVolume ? `${row.fuelVolume} L` : '-'}</span>
      ),
    },
    {
      header: 'Date début',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-300">
          {row.startAt ? new Date(row.startAt).toLocaleDateString('fr-FR') : '-'}
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
        <div className="flex gap-1">
          <button
            onClick={() => handleView(row)}
            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
            title="Voir détails"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => handleEdit(row)}
            className="p-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg transition-colors"
            title="Modifier"
          >
            <Edit size={18} />
          </button>
        </div>
      ),
    },
  ];

  // Mobile Card Renderer for Trips
  const renderMobileCard = (row, index) => (
    <div
      key={row._id || index}
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden"
    >
      {/* Card Header with route */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/80 text-sm font-medium">{row.reference}</span>
          <StatusBadge status={row.status} />
        </div>
        <div className="flex items-center gap-2 text-white">
          <MapPin size={16} className="text-white/70" />
          <span className="font-semibold">{row.origin}</span>
          <Route size={16} className="text-white/70" />
          <span className="font-semibold">{row.destination}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-3">
        {/* Vehicle & Driver Row */}
        <div className="grid grid-cols-2 gap-3">
          {row.vehicleRef && (
            <div className="flex items-center gap-2 text-sm">
              <Truck size={16} className="text-gray-400 dark:text-slate-500" />
              <span className="text-gray-500 dark:text-slate-400">Véhicule:</span>
              <span className="font-medium text-gray-900 dark:text-white truncate">{row.vehicleRef.plateNumber}</span>
            </div>
          )}
          {row.assignedTo && (
            <div className="flex items-center gap-2 text-sm">
              <User size={16} className="text-gray-400 dark:text-slate-500" />
              <span className="text-gray-500 dark:text-slate-400">Chauffeur:</span>
              <span className="font-medium text-gray-900 dark:text-white truncate">{row.assignedTo.firstname}</span>
            </div>
          )}
        </div>

        {/* Distance & Fuel Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Route size={16} className="text-gray-400 dark:text-slate-500" />
            <span className="text-gray-500 dark:text-slate-400">Distance:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {row.endKm && row.startKm ? `${row.endKm - row.startKm}` : row.startKm || 0} km
            </span>
          </div>
          {row.fuelVolume && (
            <div className="flex items-center gap-2 text-sm">
              <Fuel size={16} className="text-gray-400 dark:text-slate-500" />
              <span className="text-gray-500 dark:text-slate-400">Carburant:</span>
              <span className="font-medium text-gray-900 dark:text-white">{row.fuelVolume} L</span>
            </div>
          )}
        </div>

        {/* Date */}
        {row.startAt && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar size={16} className="text-gray-400 dark:text-slate-500" />
            <span className="text-gray-500 dark:text-slate-400">Date début:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {new Date(row.startAt).toLocaleDateString('fr-FR')}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-slate-700">
          <button
            onClick={() => handleView(row)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl font-medium text-sm hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
          >
            <Eye size={16} />
            Voir
          </button>
          <button
            onClick={() => handleEdit(row)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl font-medium text-sm hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
          >
            <Edit size={16} />
            Modifier
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Trajets"
        subtitle="Gérez les trajets de votre flotte"
        actionLabel="Créer un trajet"
        actionIcon={Plus}
        onAction={() => navigate('/admin/trips/create')}
      />

      {/* Filters */}
      <SearchFilter
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Rechercher par origine ou destination..."
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={statusOptions}
        filterPlaceholder="Tous les statuts"
      />

      {/* Trips Table */}
      <Card padding={false}>
        <Table
          columns={columns}
          data={filteredTrips}
          loading={loading}
          emptyMessage="Aucun trajet trouvé"
          mobileCard={renderMobileCard}
        />
      </Card>


    </div>
  );
}
