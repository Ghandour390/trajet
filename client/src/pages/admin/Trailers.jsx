import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Card, PageHeader, SearchFilter, ConfirmModal } from '../../components/common';
import { TrailerTable } from '../../components/admin';
import {
  getTrailers,
  deleteTrailer,
  selectTrailers,
  selectTrailersLoading,
} from '../../store/slices/trailersSlice';
import { notify } from '../../utils/notifications';

/**
 * AdminTrailers Page
 * Trailer management for admin
 */
export default function AdminTrailers() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const trailers = useSelector(selectTrailers);
  const loading = useSelector(selectTrailersLoading);

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState(null);

  // Fetch trailers on mount
  useEffect(() => {
    dispatch(getTrailers());
  }, [dispatch]);

  // Filter trailers
  const filteredTrailers = trailers.filter((trailer) => {
    const matchesSearch =
      trailer.plateNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trailer.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trailer.type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || trailer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });



  // Handle delete
  const handleDelete = async () => {
    try {
      await dispatch(deleteTrailer(selectedTrailer._id)).unwrap();
      notify.success('Remorque supprimée avec succès');
      setIsDeleteModalOpen(false);
      setSelectedTrailer(null);
    } catch (error) {
      notify.error(error || 'Erreur lors de la suppression');
    }
  };

  const statusOptions = [
    { value: 'available', label: 'Disponible' },
    { value: 'in_use', label: 'En utilisation' },
    { value: 'maintenance', label: 'En maintenance' },
    { value: 'out_of_service', label: 'Hors service' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Remorques"
        subtitle="Gérez votre flotte de remorques"
        actionLabel="Ajouter une remorque"
        actionIcon={Plus}
        onAction={() => navigate('/admin/trailers/create')}
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

      {/* Trailers Table */}
      <Card padding={false}>
        <TrailerTable
          trailers={filteredTrailers}
          loading={loading}
          onView={(trailer) => navigate(`/admin/trailers/edit/${trailer._id}`)}
          onEdit={(trailer) => navigate(`/admin/trailers/edit/${trailer._id}`)}
          onDelete={(trailer) => {
            setSelectedTrailer(trailer);
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
        itemName={selectedTrailer?.plateNumber}
        loading={loading}
      />
    </div>
  );
}
