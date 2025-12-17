import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Truck, MapPin, Users, Wrench, TrendingUp, AlertTriangle, ArrowRight, Calendar, Container } from 'lucide-react';
import { StatsCard } from '../../components/admin';
import { Card } from '../../components/common';
import Skeleton from '../../components/common/Skeleton';
import { FuelChart, KilometrageChart } from '../../components/charts';
import {
  getDashboardStats,
  getRecentTrips,
  getVehiclesNeedingAttention,
  getFuelChartData,
  getKilometrageChartData,
  selectDashboardStats,
  selectRecentTrips,
  selectVehiclesAttention,
  selectFuelChartData,
  selectKilometrageChartData,
  selectDashboardLoading
} from '../../store/slices/dashboardSlice';

/**
 * AdminDashboard Page
 * Main dashboard for admin with statistics and charts - Professional responsive design
 */
export default function AdminDashboard() {
  const dispatch = useDispatch();
  const stats = useSelector(selectDashboardStats);
  const recentTrips = useSelector(selectRecentTrips);
  const vehiclesNeedingAttention = useSelector(selectVehiclesAttention);
  const fuelChartData = useSelector(selectFuelChartData);
  const kilometrageChartData = useSelector(selectKilometrageChartData);
  const loading = useSelector(selectDashboardLoading);

  const [chartPeriod, setChartPeriod] = useState('month');

  // Fetch only critical stats immediately
  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  // Lazy load everything else
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(getRecentTrips());
      dispatch(getVehiclesNeedingAttention());
    }, 500);
    return () => clearTimeout(timer);
  }, [dispatch]);

  // Load charts only when visible
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(getFuelChartData(chartPeriod));
      dispatch(getKilometrageChartData(chartPeriod));
    }, 1000);
    return () => clearTimeout(timer);
  }, [dispatch, chartPeriod]);

  const getStatusConfig = (status) => {
    const configs = {
      completed: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-400',
        label: 'Terminé'
      },
      in_progress: {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-700 dark:text-blue-400',
        label: 'En cours'
      },
      pending: {
        bg: 'bg-amber-100 dark:bg-amber-900/30',
        text: 'text-amber-700 dark:text-amber-400',
        label: 'En attente'
      }
    };
    return configs[status] || configs.pending;
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Tableau de bord
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Bienvenue dans votre espace d'administration
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700">
          <Calendar size={18} />
          <span>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
        <StatsCard title="Véhicules" value={stats.totalVehicles || 0} icon={Truck} color="primary" />
        <StatsCard title="Remorques" value={stats.totalTrailers || 0} icon={Container} color="secondary" />
        <StatsCard title="Trajets en cours" value={stats.activeTrips || 0} icon={MapPin} color="success" />
        <StatsCard title="Chauffeurs" value={stats.totalDrivers || 0} icon={Users} color="info" />
        <StatsCard title="Maintenance" value={stats.pendingMaintenance || 0} icon={Wrench} color={stats.pendingMaintenance > 0 ? 'warning' : 'success'} />
      </div>

      {/* Charts Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Statistiques</h2>
          <select
            value={chartPeriod}
            onChange={(e) => setChartPeriod(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
          </select>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
          <Card title="Consommation de carburant" subtitle="Évolution sur la période">
            <div className="h-64 sm:h-80">
              <FuelChart data={fuelChartData} period={chartPeriod} />
            </div>
          </Card>
          <Card title="Kilométrage" subtitle="Distance parcourue">
            <div className="h-64 sm:h-80">
              <KilometrageChart data={kilometrageChartData} period={chartPeriod} />
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {/* Recent Trips */}
        <Card 
          title="Trajets récents" 
          subtitle="Les 5 derniers trajets"
          action={
            <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center gap-1 transition-colors">
              Voir tout
              <ArrowRight size={16} />
            </button>
          }
        >
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-primary-200 dark:border-primary-900"></div>
                <div className="w-12 h-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin absolute top-0 left-0"></div>
              </div>
            </div>
          ) : recentTrips.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                <MapPin size={32} className="text-gray-400 dark:text-slate-500" />
              </div>
              <p className="text-gray-500 dark:text-slate-400">Aucun trajet récent</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTrips.map((trip, index) => {
                const statusConfig = getStatusConfig(trip.status);
                return (
                  <div
                    key={trip._id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-900 transition-colors cursor-pointer group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MapPin size={22} className="text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {trip.origin} → {trip.destination}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          {trip.assignedTo?.firstname} {trip.assignedTo?.lastname}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Vehicles Needing Attention */}
        <Card
          title="Véhicules à surveiller"
          subtitle="Maintenance requise ou proche"
          action={
            <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center gap-1 transition-colors">
              Gérer
              <ArrowRight size={16} />
            </button>
          }
        >
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-primary-200 dark:border-primary-900"></div>
                <div className="w-12 h-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin absolute top-0 left-0"></div>
              </div>
            </div>
          ) : vehiclesNeedingAttention.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <TrendingUp size={32} className="text-green-500" />
              </div>
              <p className="text-gray-900 dark:text-white font-medium">Excellent !</p>
              <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">
                Tous les véhicules sont en bon état
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {vehiclesNeedingAttention.map((vehicle, index) => (
                <div
                  key={vehicle._id}
                  className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800/50 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors cursor-pointer group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <AlertTriangle size={22} className="text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {vehicle.matricule}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-slate-400">
                        {vehicle.brand} {vehicle.model}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-amber-700 dark:text-amber-400 font-semibold bg-amber-100 dark:bg-amber-900/50 px-3 py-1.5 rounded-full">
                    {vehicle.status === 'maintenance'
                      ? 'En maintenance'
                      : 'Maintenance proche'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
