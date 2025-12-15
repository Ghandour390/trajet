import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Card, PageHeader, SearchFilter, ConfirmModal } from '../../components/common';
import { VehicleTable } from '../../components/admin';
import {
  getVehicles,
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
      <PageHeader
        title="Véhicules"
        subtitle="Gérez votre flotte de véhicules"
        actionLabel="Ajouter un véhicule"
        actionIcon={Plus}
        onAction={() => navigate('/admin/vehicles/create')}
      />

      {/* Filters */}
      <SearchFilter
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Rechercher par matricule, marque, modèle..."
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={statusOptions}
        filterPlaceholder="Tous les statuts"
      />

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
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Confirmer la suppression"
        itemName={selectedVehicle?.plateNumber}
        loading={loading}
      />
    </div>
  );
}
