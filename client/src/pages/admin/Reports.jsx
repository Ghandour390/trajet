import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Download } from 'lucide-react';
import { Button, Card, Select } from '../../components/common';
import { FuelChart, KilometrageChart } from '../../components/charts';
import { getFuelStats, selectFuelStats } from '../../store/slices/fuelSlice';
import { getTrips, selectTrips } from '../../store/slices/tripsSlice';
import { downloadPDF } from '../../utils/fileHelpers';

/**
 * AdminReports Page
 * Reports and analytics for admin
 */
export default function AdminReports() {
  const dispatch = useDispatch();
  const fuelStats = useSelector(selectFuelStats);
  const trips = useSelector(selectTrips);

  // Local state
  const [period, setPeriod] = useState('month');
  const [reportType, setReportType] = useState('fuel');

  // Fetch data on mount
  useEffect(() => {
    dispatch(getFuelStats({ period }));
    dispatch(getTrips());
  }, [dispatch, period]);

  // Calculate summary stats
  const totalDistance = trips.reduce((sum, trip) => sum + (trip.distance || 0), 0);
  const totalFuel = fuelStats?.totalConsumption || 0;
  const avgConsumption = totalDistance > 0 ? (totalFuel / totalDistance * 100).toFixed(2) : 0;
  const totalCost = fuelStats?.totalCost || 0;

  const handleDownloadReport = () => {
    downloadPDF(`rapport-${reportType}-${period}.pdf`);
  };

  const periodOptions = [
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' },
    { value: 'quarter', label: 'Ce trimestre' },
    { value: 'year', label: 'Cette année' },
  ];

  const reportOptions = [
    { value: 'fuel', label: 'Consommation carburant' },
    { value: 'kilometrage', label: 'Kilométrage' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'trips', label: 'Trajets' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Rapports</h1>
          <p className="text-gray-600">Analyses et statistiques de votre flotte</p>
        </div>
        <Button onClick={handleDownloadReport} variant="secondary">
          <Download size={20} className="mr-2" />
          Télécharger PDF
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="sm:w-48">
            <Select
              label="Période"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              options={periodOptions}
            />
          </div>
          <div className="sm:w-48">
            <Select
              label="Type de rapport"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              options={reportOptions}
            />
          </div>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center">
          <p className="text-sm text-gray-500">Distance totale</p>
          <p className="text-2xl font-bold text-gray-800">{totalDistance.toLocaleString()} km</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-500">Carburant consommé</p>
          <p className="text-2xl font-bold text-gray-800">{totalFuel.toLocaleString()} L</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-500">Consommation moyenne</p>
          <p className="text-2xl font-bold text-gray-800">{avgConsumption} L/100km</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-500">Coût total carburant</p>
          <p className="text-2xl font-bold text-gray-800">{totalCost.toLocaleString()} MAD</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Consommation de carburant" subtitle="Évolution sur la période">
          <FuelChart />
        </Card>
        <Card title="Kilométrage" subtitle="Distance parcourue">
          <KilometrageChart />
        </Card>
      </div>
    </div>
  );
}
