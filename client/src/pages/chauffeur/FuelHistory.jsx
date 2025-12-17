import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Fuel as FuelIcon } from 'lucide-react';
import { Card, PageHeader } from '../../components/common';
import { getFuelRecords, selectFuelRecords, selectFuelLoading } from '../../store/slices/fuelSlice';
import { selectUser } from '../../store/slices/authSlice';

export default function FuelHistory() {
  const dispatch = useDispatch();
  const fuelRecords = useSelector(selectFuelRecords);
  const loading = useSelector(selectFuelLoading);
  const user = useSelector(selectUser);

  useEffect(() => {
    dispatch(getFuelRecords({ driver: user.id }));
  }, [dispatch, user.id]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Historique Carburant"
        subtitle="Vos enregistrements de carburant"
      />

      <Card padding={false}>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"></div>
          </div>
        ) : fuelRecords.length === 0 ? (
          <div className="text-center py-12">
            <FuelIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Aucun enregistrement</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-slate-700">
            {fuelRecords.map((record) => (
              <div key={record._id} className="p-6 hover:bg-gray-50 dark:hover:bg-slate-800">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {record.vehicle?.plateNumber}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      {new Date(record.date).toLocaleDateString('fr-FR')}
                    </p>
                    {record.station && (
                      <p className="text-sm text-gray-600 dark:text-slate-300 mt-1">
                        📍 {record.station} - {record.location}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {record.liters} L
                    </p>
                    <p className="text-sm text-gray-600 dark:text-slate-300">
                      {record.cost} MAD
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      {record.pricePerLiter?.toFixed(2)} MAD/L
                    </p>
                  </div>
                </div>
                {record.notes && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">
                    💬 {record.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
