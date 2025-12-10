import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Search } from 'lucide-react';
import { Button, Card, Modal, Input, Select, Table } from '../../components/common';
import {
  getTrips,
  createTrip,
  selectTrips,
  selectTripsLoading,
} from '../../store/slices/tripsSlice';
import { getVehicles, selectVehicles } from '../../store/slices/vehiclesSlice';
import { notify } from '../../utils/notifications';

/**
 * AdminTrips Page
 * Trip management for admin
 */
export default function AdminTrips() {
  const dispatch = useDispatch();
  const trips = useSelector(selectTrips);
  const vehicles = useSelector(selectVehicles);
  const loading = useSelector(selectTripsLoading);

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    vehicle: '',
    driver: '',
    date: '',
    distance: '',
  });

  // Fetch data on mount
  useEffect(() => {
    dispatch(getTrips());
    dispatch(getVehicles());
  }, [dispatch]);

  // Filter trips
  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.origin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.destination?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || trip.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createTrip(formData)).unwrap();
      notify.success('Trajet créé avec succès');
      setIsModalOpen(false);
      setFormData({
        origin: '',
        destination: '',
        vehicle: '',
        driver: '',
        date: '',
        distance: '',
      });
      dispatch(getTrips());
    } catch (error) {
      notify.error(error || 'Erreur lors de la création');
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };

    const statusLabels = {
      pending: 'En attente',
      in_progress: 'En cours',
      completed: 'Terminé',
      cancelled: 'Annulé',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100'}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

  const columns = [
    {
      header: 'Origine',
      accessor: 'origin',
    },
    {
      header: 'Destination',
      accessor: 'destination',
    },
    {
      header: 'Véhicule',
      render: (row) => row.vehicle?.matricule || '-',
    },
    {
      header: 'Chauffeur',
      render: (row) =>
        row.driver ? `${row.driver.firstname} ${row.driver.lastname}` : '-',
    },
    {
      header: 'Distance',
      render: (row) => `${row.distance || 0} km`,
    },
    {
      header: 'Date',
      render: (row) =>
        new Date(row.date || row.startDate).toLocaleDateString('fr-FR'),
    },
    {
      header: 'Statut',
      render: (row) => getStatusBadge(row.status),
    },
  ];

  const statusOptions = [
    { value: 'pending', label: 'En attente' },
    { value: 'in_progress', label: 'En cours' },
    { value: 'completed', label: 'Terminé' },
    { value: 'cancelled', label: 'Annulé' },
  ];

  const vehicleOptions = vehicles.map((v) => ({
    value: v._id,
    label: `${v.matricule} - ${v.brand} ${v.model}`,
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Trajets</h1>
          <p className="text-gray-600">Gérez les trajets de votre flotte</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} variant="primary">
          <Plus size={20} className="mr-2" />
          Créer un trajet
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par origine ou destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
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
        />
      </Card>

      {/* Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Créer un trajet"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Origine"
              name="origin"
              value={formData.origin}
              onChange={handleInputChange}
              required
              placeholder="Casablanca"
            />
            <Input
              label="Destination"
              name="destination"
              value={formData.destination}
              onChange={handleInputChange}
              required
              placeholder="Rabat"
            />
            <Select
              label="Véhicule"
              name="vehicle"
              value={formData.vehicle}
              onChange={handleInputChange}
              options={vehicleOptions}
              required
            />
            <Input
              label="Distance (km)"
              name="distance"
              type="number"
              value={formData.distance}
              onChange={handleInputChange}
              placeholder="150"
            />
            <Input
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              Créer
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
