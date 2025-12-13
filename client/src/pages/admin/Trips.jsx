import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Eye, MapPin, Truck, User, Calendar, Fuel, Route } from 'lucide-react';
import { Button, Card, Table } from '../../components/common';
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

  const getStatusBadge = (status) => {
    const statusStyles = {
      planned: {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        text: 'text-yellow-700 dark:text-yellow-400',
        dot: 'bg-yellow-500'
      },
      in_progress: {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-700 dark:text-blue-400',
        dot: 'bg-blue-500'
      },
      completed: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-400',
        dot: 'bg-green-500'
      },
      cancelled: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-700 dark:text-red-400',
        dot: 'bg-red-500'
      },
    };

    const statusLabels = {
      planned: 'Planifié',
      in_progress: 'En cours',
      completed: 'Terminé',
      cancelled: 'Annulé',
    };

    const style = statusStyles[status] || { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400', dot: 'bg-gray-400' };

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
        {statusLabels[status] || status}
      </span>
    );
  };

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
      render: (row) => getStatusBadge(row.status),
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
          {getStatusBadge(row.status)}
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

  const statusOptions = [
    { value: 'planned', label: 'Planifié' },
    { value: 'in_progress', label: 'En cours' },
    { value: 'completed', label: 'Terminé' },
    { value: 'cancelled', label: 'Annulé' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Trajets</h1>
          <p className="text-gray-600 dark:text-slate-400">Gérez les trajets de votre flotte</p>
        </div>
        <Button onClick={() => navigate('/admin/trips/create')} variant="primary">
          <Plus size={20} className="mr-2" />
          Créer un trajet
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Rechercher par origine ou destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="">Tous les statuts</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

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
