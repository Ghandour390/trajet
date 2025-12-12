import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Search, Edit, Eye } from 'lucide-react';
import { Button, Card, Modal, Input, Select, Table } from '../../components/common';
import {
  getTrips,
  createTrip,
  updateTrip,
  selectTrips,
  selectTripsLoading,
} from '../../store/slices/tripsSlice';

import { notify } from '../../utils/notifications';
import { getAvailableDrivers, getAvailableVehicles, getAvailableTrailers } from '../../api/trips';

/**
 * AdminTrips Page
 * Trip management for admin
 */
export default function AdminTrips() {
  const dispatch = useDispatch();
  const trips = useSelector(selectTrips);
  const loading = useSelector(selectTripsLoading);

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [availableTrailers, setAvailableTrailers] = useState([]);
  const [formData, setFormData] = useState({
    reference: '',
    origin: '',
    destination: '',
    vehicleRef: '',
    trailerRef: '',
    assignedTo: '',
    startAt: '',
    endAt: '',
    distimatedKm: '',
  });

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

  // Handle form input change
  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);

    if ((name === 'startAt' || name === 'endAt') && newFormData.startAt && newFormData.endAt) {
      try {
        const [drivers, vehicles, trailers] = await Promise.all([
          getAvailableDrivers(newFormData.startAt, newFormData.endAt),
          getAvailableVehicles(newFormData.startAt, newFormData.endAt),
          getAvailableTrailers(newFormData.startAt, newFormData.endAt)
        ]);
        setAvailableDrivers(drivers);
        setAvailableVehicles(vehicles);
        setAvailableTrailers(trailers);
        console.log('Chauffeurs disponibles:', drivers);
        console.log('Véhicules disponibles:', vehicles);
        console.log('Remorques disponibles:', trailers);
      } catch (error) {
        console.error('Erreur:', error);
        notify.error('Erreur lors du chargement des disponibilités');
      }
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await dispatch(updateTrip({ id: selectedTrip._id, data: formData })).unwrap();
        notify.success('Trajet modifié avec succès');
      } else {
        await dispatch(createTrip(formData)).unwrap();
        notify.success('Trajet créé avec succès');
      }
      setIsModalOpen(false);
      setIsEditMode(false);
      setSelectedTrip(null);
      setFormData({
        reference: '',
        origin: '',
        destination: '',
        vehicleRef: '',
        trailerRef: '',
        assignedTo: '',
        startAt: '',
        endAt: '',
        distimatedKm: '',
      });
      setAvailableDrivers([]);
      setAvailableVehicles([]);
      setAvailableTrailers([]);
      dispatch(getTrips());
    } catch (error) {
      notify.error(error || 'Erreur lors de la création');
    }
  };

  const handleEdit = (trip) => {
    setSelectedTrip(trip);
    setIsEditMode(true);
    setFormData({
      reference: trip.reference,
      origin: trip.origin,
      destination: trip.destination,
      vehicleRef: trip.vehicleRef?._id || '',
      trailerRef: trip.trailerRef?._id || '',
      assignedTo: trip.assignedTo?._id || '',
      startAt: trip.startAt ? new Date(trip.startAt).toISOString().slice(0, 16) : '',
      endAt: trip.endAt ? new Date(trip.endAt).toISOString().slice(0, 16) : '',
      distimatedKm: trip.distimatedKm || '',
    });
    setIsModalOpen(true);
  };

  const handleView = (trip) => {
    setSelectedTrip(trip);
    setIsViewModalOpen(true);
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      planned: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };

    const statusLabels = {
      planned: 'Planifié',
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
      header: 'Référence',
      accessor: 'reference',
    },
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
      render: (row) => row.vehicleRef?.plateNumber || '-',
    },
    {
      header: 'Remorque',
      render: (row) => row.trailerRef?.plateNumber || '-',
    },
    {
      header: 'Chauffeur',
      render: (row) =>
        row.assignedTo ? `${row.assignedTo.firstname} ${row.assignedTo.lastname}` : '-',
    },
    {
      header: 'Distance',
      render: (row) => row.endKm && row.startKm ? `${row.endKm - row.startKm} km` : `${row.startKm || 0} km`,
    },
    {
      header: 'Carburant',
      render: (row) => row.fuelVolume ? `${row.fuelVolume} L` : '-',
    },
    {
      header: 'Date début',
      render: (row) =>
        row.startAt ? new Date(row.startAt).toLocaleDateString('fr-FR') : '-',
    },
    {
      header: 'Statut',
      render: (row) => getStatusBadge(row.status),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleView(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
            title="Voir détails"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => handleEdit(row)}
            className="p-2 text-green-600 hover:bg-green-50 rounded"
            title="Modifier"
          >
            <Edit size={18} />
          </button>
        </div>
      ),
    },
  ];

  const statusOptions = [
    { value: 'planned', label: 'Planifié' },
    { value: 'in_progress', label: 'En cours' },
    { value: 'completed', label: 'Terminé' },
    { value: 'cancelled', label: 'Annulé' },
  ];

  const vehicleOptions = availableVehicles.map((v) => ({
    value: v._id,
    label: `${v.plateNumber} - ${v.brand}`,
  }));

  const driverOptions = availableDrivers.map((d) => ({
    value: d._id,
    label: `${d.firstname} ${d.lastname}`,
  }));

  const trailerOptions = availableTrailers.map((t) => ({
    value: t._id,
    label: `${t.plateNumber} - ${t.type}`,
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

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsEditMode(false);
          setSelectedTrip(null);
        }}
        title={isEditMode ? 'Modifier un trajet' : 'Créer un trajet'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Référence"
              name="reference"
              value={formData.reference}
              onChange={handleInputChange}
              required
              placeholder="TRIP001"
            />
            {/* <Input
              label="Kilométrage départ"
              name="startKm"
              type="number"
              value={formData.startKm}
              onChange={handleInputChange}
              placeholder="45000"
            /> */}
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
            <Input
              label="Date début"
              name="startAt"
              type="datetime-local"
              value={formData.startAt}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Date fin"
              name="endAt"
              type="datetime-local"
              value={formData.endAt}
              onChange={handleInputChange}
              required
            />
            <Select
              label="Véhicule disponible"
              name="vehicleRef"
              value={formData.vehicleRef}
              onChange={handleInputChange}
              options={vehicleOptions}
              disabled={!formData.startAt || !formData.endAt}
              placeholder={formData.startAt && formData.endAt ? "Sélectionner un véhicule" : "Choisir dates d'abord"}
            />
            <Select
              label="Chauffeur disponible"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleInputChange}
              options={driverOptions}
              disabled={!formData.startAt || !formData.endAt}
              placeholder={formData.startAt && formData.endAt ? "Sélectionner un chauffeur" : "Choisir dates d'abord"}
            />
            <Select
              label="Remorque disponible"
              name="trailerRef"
              value={formData.trailerRef}
              onChange={handleInputChange}
              options={trailerOptions}
              disabled={!formData.startAt || !formData.endAt}
              placeholder={formData.startAt && formData.endAt ? "Sélectionner une remorque" : "Choisir dates d'abord"}
            />
            <Input
              label="Distance (km)"
              name="distimatedKm"
              type="number"
              value={formData.distimatedKm}
              onChange={handleInputChange}
              placeholder="150"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              {isEditMode ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedTrip(null);
        }}
        title="Détails du trajet"
        size="lg"
      >
        {selectedTrip && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Référence</p>
                <p className="font-semibold">{selectedTrip.reference}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Statut</p>
                {getStatusBadge(selectedTrip.status)}
              </div>
              <div>
                <p className="text-sm text-gray-600">Origine</p>
                <p className="font-semibold">{selectedTrip.origin}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Destination</p>
                <p className="font-semibold">{selectedTrip.destination}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date début</p>
                <p className="font-semibold">
                  {selectedTrip.startAt ? new Date(selectedTrip.startAt).toLocaleString('fr-FR') : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date fin</p>
                <p className="font-semibold">
                  {selectedTrip.endAt ? new Date(selectedTrip.endAt).toLocaleString('fr-FR') : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Véhicule</p>
                <p className="font-semibold">{selectedTrip.vehicleRef?.plateNumber || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Remorque</p>
                <p className="font-semibold">{selectedTrip.trailerRef?.plateNumber || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Chauffeur</p>
                <p className="font-semibold">
                  {selectedTrip.assignedTo
                    ? `${selectedTrip.assignedTo.firstname} ${selectedTrip.assignedTo.lastname}`
                    : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Distance estimée</p>
                <p className="font-semibold">{selectedTrip.distimatedKm} km</p>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedTrip(null);
                }}
              >
                Fermer
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
