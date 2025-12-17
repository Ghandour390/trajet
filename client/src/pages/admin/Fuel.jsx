import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Fuel as FuelIcon } from 'lucide-react';
import { Card, PageHeader, SearchFilter, ConfirmModal } from '../../components/common';
import { getFuelRecords, deleteFuelRecord, selectFuelRecords, selectFuelLoading } from '../../store/slices/fuelSlice';
import { notify } from '../../utils/notifications';
import { useNavigate } from 'react-router-dom';

export default function AdminFuel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fuelRecords = useSelector(selectFuelRecords);
  const loading = useSelector(selectFuelLoading);

  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    dispatch(getFuelRecords());
  }, [dispatch]);

  const filteredRecords = fuelRecords.filter((record) =>
    record.vehicle?.plateNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.driver?.firstname?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async () => {
    try {
      await dispatch(deleteFuelRecord(selectedRecord._id)).unwrap();
      notify.success('Enregistrement supprimé');
      setIsDeleteModalOpen(false);
      setSelectedRecord(null);
    } catch (error) {
      notify.error(error || 'Erreur lors de la suppression');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestion Carburant"
        subtitle="Suivez la consommation de carburant"
        actionLabel="Ajouter un plein"
        actionIcon={Plus}
        onAction={() => navigate('/admin/fuel/create')}
      />

      <SearchFilter
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Rechercher par véhicule, chauffeur..."
      />

      <Card padding={false}>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"></div>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-12">
            <FuelIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Aucun enregistrement trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Véhicule</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Chauffeur</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Litres</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Coût</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Prix/L</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Station</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {filteredRecords.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50 dark:hover:bg-slate-800">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {new Date(record.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {record.vehicle?.plateNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-300">
                      {record.driver?.firstname} {record.driver?.lastname}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                      {record.liters} L
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                      {record.cost} MAD
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-300">
                      {record.pricePerLiter?.toFixed(2)} MAD
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-300">
                      {record.station || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => {
                          setSelectedRecord(record);
                          setIsDeleteModalOpen(true);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Confirmer la suppression"
        itemName={`Plein du ${selectedRecord?.date ? new Date(selectedRecord.date).toLocaleDateString('fr-FR') : ''}`}
        loading={loading}
      />
    </div>
  );
}
