import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Search } from 'lucide-react';
import { Button, Card, Modal, Input, Select, Table } from '../../components/common';
import {
  getMaintenanceRecords,
  createMaintenance,
  selectMaintenanceRecords,
  selectMaintenanceLoading,
} from '../../store/slices/maintenanceSlice';
import { getVehicles, selectVehicles } from '../../store/slices/vehiclesSlice';
import { notify } from '../../utils/notifications';

/**
 * AdminMaintenance Page
 * Maintenance management for admin
 */
export default function AdminMaintenance() {
  const dispatch = useDispatch();
  const maintenanceRecords = useSelector(selectMaintenanceRecords);
  const vehicles = useSelector(selectVehicles);
  const loading = useSelector(selectMaintenanceLoading);

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    vehicle: '',
    type: '',
    description: '',
    cost: '',
    scheduledDate: '',
    status: 'pending',
  });

  // Fetch data on mount
  useEffect(() => {
    dispatch(getMaintenanceRecords());
    dispatch(getVehicles());
  }, [dispatch]);

  // Filter records
  const filteredRecords = maintenanceRecords.filter((record) => {
    const matchesSearch =
      record.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.vehicle?.matricule?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || record.status === statusFilter;
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
      await dispatch(createMaintenance(formData)).unwrap();
      notify.success('Maintenance créée avec succès');
      setIsModalOpen(false);
      setFormData({
        vehicle: '',
        type: '',
        description: '',
        cost: '',
        scheduledDate: '',
        status: 'pending',
      });
      dispatch(getMaintenanceRecords());
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
      completed: 'Terminée',
      cancelled: 'Annulée',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100'}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

  const columns = [
    {
      header: 'Véhicule',
      render: (row) => row.vehicle?.matricule || '-',
    },
    {
      header: 'Type',
      accessor: 'type',
    },
    {
      header: 'Description',
      accessor: 'description',
      render: (row) => (
        <span className="truncate max-w-xs block">{row.description || '-'}</span>
      ),
    },
    {
      header: 'Coût',
      render: (row) => row.cost ? `${row.cost.toLocaleString()} MAD` : '-',
    },
    {
      header: 'Date prévue',
      render: (row) =>
        row.scheduledDate
          ? new Date(row.scheduledDate).toLocaleDateString('fr-FR')
          : '-',
    },
    {
      header: 'Statut',
      render: (row) => getStatusBadge(row.status),
    },
  ];

  const statusOptions = [
    { value: 'pending', label: 'En attente' },
    { value: 'in_progress', label: 'En cours' },
    { value: 'completed', label: 'Terminée' },
    { value: 'cancelled', label: 'Annulée' },
  ];

  const typeOptions = [
    { value: 'oil_change', label: 'Vidange' },
    { value: 'tire_change', label: 'Changement pneus' },
    { value: 'brake_service', label: 'Freins' },
    { value: 'engine_repair', label: 'Moteur' },
    { value: 'inspection', label: 'Contrôle technique' },
    { value: 'other', label: 'Autre' },
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
          <h1 className="text-2xl font-bold text-gray-800">Maintenance</h1>
          <p className="text-gray-600">Gérez les maintenances de vos véhicules</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} variant="primary">
          <Plus size={20} className="mr-2" />
          Planifier une maintenance
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par type ou véhicule..."
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

      {/* Maintenance Table */}
      <Card padding={false}>
        <Table
          columns={columns}
          data={filteredRecords}
          loading={loading}
          emptyMessage="Aucune maintenance trouvée"
        />
      </Card>

      {/* Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Planifier une maintenance"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Véhicule"
              name="vehicle"
              value={formData.vehicle}
              onChange={handleInputChange}
              options={vehicleOptions}
              required
            />
            <Select
              label="Type de maintenance"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              options={typeOptions}
              required
            />
            <Input
              label="Coût estimé (MAD)"
              name="cost"
              type="number"
              value={formData.cost}
              onChange={handleInputChange}
              placeholder="1500"
            />
            <Input
              label="Date prévue"
              name="scheduledDate"
              type="date"
              value={formData.scheduledDate}
              onChange={handleInputChange}
              required
            />
            <Select
              label="Statut"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              options={statusOptions}
              required
            />
          </div>
          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Détails de la maintenance..."
          />
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
