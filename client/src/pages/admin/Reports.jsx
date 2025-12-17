import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Download } from 'lucide-react';
import { Button, Card, Select } from '../../components/common';
import { FuelChart, KilometrageChart } from '../../components/charts';
import { getReportStats, selectReportStats, selectReportsLoading } from '../../store/slices/reportsSlice';
import { downloadPDF } from '../../utils/fileHelpers';

/**
 * AdminReports Page
 * Reports and analytics for admin
 */
export default function AdminReports() {
  const dispatch = useDispatch();
  const stats = useSelector(selectReportStats);
  const loading = useSelector(selectReportsLoading);

  // Local state
  const [period, setPeriod] = useState('month');
  const [reportType, setReportType] = useState('fuel');

  // Fetch data on mount
  useEffect(() => {
    dispatch(getReportStats(period));
  }, [dispatch, period]);

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Rapports</h1>
          <p className="text-gray-600 dark:text-slate-400">Analyses et statistiques de votre flotte</p>
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
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="text-center">
            <p className="text-sm text-gray-500 dark:text-slate-400">Distance totale</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalDistance.toLocaleString()} km</p>
          </Card>
          <Card className="text-center">
            <p className="text-sm text-gray-500 dark:text-slate-400">Carburant consommé</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalFuel.toLocaleString()} L</p>
          </Card>
          <Card className="text-center">
            <p className="text-sm text-gray-500 dark:text-slate-400">Consommation moyenne</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgConsumption} L/100km</p>
          </Card>
          <Card className="text-center">
            <p className="text-sm text-gray-500 dark:text-slate-400">Coût total</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCost.toLocaleString()} MAD</p>
          </Card>
          <Card className="text-center">
            <p className="text-sm text-gray-500 dark:text-slate-400">Trajets complétés</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTrips}</p>
          </Card>
        </div>
      )}

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
