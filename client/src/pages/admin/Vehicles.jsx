import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { Button, Card } from '../../components/common';
import { VehicleTable } from '../../components/admin';
import {
  getVehicles,
  deleteVehicle,
  selectVehicles,
  selectVehiclesLoading,
} from '../../store/slices/vehiclesSlice';
import { notify } from '../../utils/notifications';
import { Modal } from '../../components/common';

/**
 * AdminVehicles Page
 * Vehicle management for admin
 */
export default function AdminVehicles() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const vehicles = useSelector(selectVehicles);
  const loading = useSelector(selectVehiclesLoading);

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Véhicules</h1>
          <p className="text-gray-600 dark:text-slate-400">Gérez votre flotte de véhicules</p>
        </div>
        <Button onClick={() => navigate('/admin/vehicles/create')} variant="primary">
          <Plus size={20} className="mr-2" />
          Ajouter un véhicule
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Rechercher par matricule, marque, modèle..."
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

      {/* Vehicles Table */}
      <Card padding={false}>
        <VehicleTable
          vehicles={filteredVehicles}
          loading={loading}
          onView={(vehicle) => navigate(`/admin/vehicles/edit/${vehicle._id}`)}
          onEdit={(vehicle) => navigate(`/admin/vehicles/edit/${vehicle._id}`)}
          onDelete={(vehicle) => {
            setSelectedVehicle(vehicle);
            setIsDeleteModalOpen(true);
          }}
        />
      </Card>

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
