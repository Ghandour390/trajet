import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus, Circle } from 'lucide-react';
import { Card, PageHeader, SearchFilter, ConfirmModal } from '../../components/common';
import { VehicleTable } from '../../components/admin';
import TireCard from '../../components/admin/TireCard';
import {
  getVehicles,
  deleteVehicle,
  selectVehicles,
  selectVehiclesLoading,
} from '../../store/slices/vehiclesSlice';
import { getVehicleWithTires } from '../../api/vehicles';
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
  const [viewTires, setViewTires] = useState(null);
  const [tires, setTires] = useState([]);
  const [loadingTires, setLoadingTires] = useState(false);

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

  const handleViewTires = async (vehicle) => {
    setViewTires(vehicle);
    setLoadingTires(true);
    try {
      const data = await getVehicleWithTires(vehicle._id);
      setTires(data.tires || []);
    } catch (error) {
      notify.error('Erreur lors du chargement des pneus');
    } finally {
      setLoadingTires(false);
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
          onView={handleViewTires}
          onEdit={(vehicle) => navigate(`/admin/vehicles/edit/${vehicle._id}`)}
          onDelete={(vehicle) => {
            setSelectedVehicle(vehicle);
            setIsDeleteModalOpen(true);
          }}
        />
      </Card>

      {/* Tires Modal */}
      {viewTires && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Circle size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Pneus - {viewTires.plateNumber}</h2>
                  <p className="text-primary-100 text-sm">{viewTires.brand} {viewTires.type}</p>
                </div>
              </div>
              <button
                onClick={() => setViewTires(null)}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              {loadingTires ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="text-gray-500 dark:text-gray-400 mt-4">Chargement...</p>
                </div>
              ) : tires.length === 0 ? (
                <div className="text-center py-12">
                  <Circle size={48} className="mx-auto text-gray-400 dark:text-slate-600 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Aucun pneu trouvé</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tires.map((tire) => (
                    <TireCard key={tire._id} tire={tire} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
