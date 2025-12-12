import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Search } from 'lucide-react';
import { Button, Card, Modal, Input, Select } from '../../components/common';
import { VehicleTable } from '../../components/admin';
import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  selectVehicles,
  selectVehiclesLoading,
} from '../../store/slices/vehiclesSlice';
import { notify } from '../../utils/notifications';

/**
 * AdminVehicles Page
 * Vehicle management for admin
 */
export default function AdminVehicles() {
  const dispatch = useDispatch();
  const vehicles = useSelector(selectVehicles);
  const loading = useSelector(selectVehiclesLoading);

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [formData, setFormData] = useState({
    plateNumber: '',
    type: '',
    brand: '',
    year: '',
    currentKm: '',
    status: 'active',
  });

  // Fetch vehicles on mount
  useEffect(() => {
    dispatch(getVehicles());
  }, [dispatch]);

  // Filter vehicles
  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.plateNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open modal for create/edit
  const openModal = (vehicle = null) => {
    if (vehicle) {
      setSelectedVehicle(vehicle);
      setFormData({
        plateNumber: vehicle.plateNumber || '',
        type: vehicle.type || '',
        brand: vehicle.brand || '',
        year: vehicle.year || '',
        currentKm: vehicle.currentKm || '',
        status: vehicle.status || 'active',
      });
    } else {
      setSelectedVehicle(null);
      setFormData({
        plateNumber: '',
        type: '',
        brand: '',
        year: '',
        currentKm: '',
        status: 'active',
      });
    }
    setIsModalOpen(true);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedVehicle) {
        await dispatch(updateVehicle({ id: selectedVehicle._id, data: formData })).unwrap();
        notify.success('Véhicule mis à jour avec succès');
      } else {
        await dispatch(createVehicle(formData)).unwrap();
        notify.success('Véhicule créé avec succès');
      }
      setIsModalOpen(false);
      dispatch(getVehicles());
    } catch (error) {
      notify.error(error || 'Erreur lors de l\'opération');
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      await dispatch(deleteVehicle(selectedVehicle._id)).unwrap();
      notify.success('Véhicule supprimé avec succès');
      setIsDeleteModalOpen(false);
      setSelectedVehicle(null);
    } catch (error) {
      notify.error(error || 'Erreur lors de la suppression');
    }
  };

  const statusOptions = [
    { value: 'active', label: 'Actif' },
    { value: 'in_use', label: 'En utilisation' },
    { value: 'maintenance', label: 'En maintenance' },
    { value: 'inactive', label: 'Inactif' },
  ];

  const typeOptions = [
    { value: 'Camion', label: 'Camion' },
    { value: 'Remorque', label: 'Remorque' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Véhicules</h1>
          <p className="text-gray-600">Gérez votre flotte de véhicules</p>
        </div>
        <Button onClick={() => openModal()} variant="primary">
          <Plus size={20} className="mr-2" />
          Ajouter un véhicule
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par matricule, marque, modèle..."
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

      {/* Vehicles Table */}
      <Card padding={false}>
        <VehicleTable
          vehicles={filteredVehicles}
          loading={loading}
          onView={(vehicle) => openModal(vehicle)}
          onEdit={(vehicle) => openModal(vehicle)}
          onDelete={(vehicle) => {
            setSelectedVehicle(vehicle);
            setIsDeleteModalOpen(true);
          }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedVehicle ? 'Modifier le véhicule' : 'Ajouter un véhicule'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Matricule"
              name="plateNumber"
              value={formData.plateNumber}
              onChange={handleInputChange}
              required
              placeholder="AA-123-BB"
            />
            <Select
              label="Type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              options={typeOptions}
              required
            />
            <Input
              label="Marque"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              required
              placeholder="Mercedes"
            />
            <Input
              label="Année"
              name="year"
              type="number"
              value={formData.year}
              onChange={handleInputChange}
              required
              placeholder="2023"
            />
            <Input
              label="Kilométrage actuel"
              name="currentKm"
              type="number"
              value={formData.currentKm}
              onChange={handleInputChange}
              required
              placeholder="50000"
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
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              {selectedVehicle ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmer la suppression"
        size="sm"
      >
        <p className="text-gray-600 mb-6">
          Êtes-vous sûr de vouloir supprimer le véhicule{' '}
          <span className="font-semibold">{selectedVehicle?.plateNumber}</span> ?
          Cette action est irréversible.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDelete} loading={loading}>
            Supprimer
          </Button>
        </div>
      </Modal>
    </div>
  );
}
