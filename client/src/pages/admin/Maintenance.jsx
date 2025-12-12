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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    vehicleRef: '',
    type: '',
    notes: '',
    cost: '',
    date: '',
    km: '',
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
      record.vehicleRef?.plateNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
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
        vehicleRef: '',
        type: '',
        notes: '',
        cost: '',
        date: '',
        km: '',
      });
      dispatch(getMaintenanceRecords());
    } catch (_error) {
      notify.error(_error || 'Erreur lors de la création');
    }
  };

  const columns = [
    {
      header: 'Véhicule',
      render: (row) => row.vehicleRef?.plateNumber || '-',
    },
    {
      header: 'Marque',
      render: (row) => row.vehicleRef?.brand || '-',
    },
    {
      header: 'Type',
      accessor: 'type',
    },
    {
      header: 'Kilométrage',
      render: (row) => row.km ? `${row.km.toLocaleString()} km` : '-',
    },
    {
      header: 'Notes',
      accessor: 'notes',
      render: (row) => (
        <span className="truncate max-w-xs block">{row.notes || '-'}</span>
      ),
    },
    {
      header: 'Coût',
      render: (row) => row.cost ? `${row.cost.toLocaleString()} MAD` : '-',
    },
    {
      header: 'Date',
      render: (row) =>
        row.date
          ? new Date(row.date).toLocaleDateString('fr-FR')
          : '-',
    },
  ];

  const typeOptions = [
    { value: 'Vidange', label: 'Vidange' },
    { value: 'Révision', label: 'Révision' },
    { value: 'Changement pneus', label: 'Changement pneus' },
    { value: 'Freins', label: 'Freins' },
    { value: 'Moteur', label: 'Moteur' },
    { value: 'Contrôle technique', label: 'Contrôle technique' },
    { value: 'Autre', label: 'Autre' },
  ];

  const vehicleOptions = vehicles.map((v) => ({
    value: v._id,
    label: `${v.plateNumber} - ${v.brand}`,
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
              name="vehicleRef"
              value={formData.vehicleRef}
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
              label="Kilométrage"
              name="km"
              type="number"
              value={formData.km}
              onChange={handleInputChange}
              required
              placeholder="45000"
            />
            <Input
              label="Coût (MAD)"
              name="cost"
              type="number"
              value={formData.cost}
              onChange={handleInputChange}
              placeholder="1500"
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
          <Input
            label="Notes"
            name="notes"
            value={formData.notes}
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
