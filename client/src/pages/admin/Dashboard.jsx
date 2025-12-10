import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Truck, MapPin, Users, Wrench, TrendingUp, AlertTriangle } from 'lucide-react';
import { StatsCard } from '../../components/admin';
import { Card } from '../../components/common';
import { FuelChart, KilometrageChart } from '../../components/charts';
import { getVehicles, selectVehicles, selectVehiclesLoading } from '../../store/slices/vehiclesSlice';
import { getTrips, selectTrips, selectTripsLoading } from '../../store/slices/tripsSlice';
import { getMaintenanceRecords, selectMaintenanceRecords } from '../../store/slices/maintenanceSlice';

/**
 * AdminDashboard Page
 * Main dashboard for admin with statistics and charts
 */
export default function AdminDashboard() {
  const dispatch = useDispatch();
  const vehicles = useSelector(selectVehicles);
  const vehiclesLoading = useSelector(selectVehiclesLoading);
  const trips = useSelector(selectTrips);
  const tripsLoading = useSelector(selectTripsLoading);
  const maintenanceRecords = useSelector(selectMaintenanceRecords);

  // Local state for dashboard stats
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeTrips: 0,
    totalDrivers: 0,
    pendingMaintenance: 0,
  });

  // Fetch data on mount
  useEffect(() => {
    dispatch(getVehicles());
    dispatch(getTrips());
    dispatch(getMaintenanceRecords());
  }, [dispatch]);

  // Calculate stats when data changes
  useEffect(() => {
    setStats({
      totalVehicles: vehicles.length,
      activeTrips: trips.filter(t => t.status === 'in_progress').length,
      totalDrivers: new Set(trips.map(t => t.driver?._id).filter(Boolean)).size,
      pendingMaintenance: maintenanceRecords.filter(m => m.status === 'pending').length,
    });
  }, [vehicles, trips, maintenanceRecords]);

  // Recent trips for display
  const recentTrips = trips.slice(0, 5);

  // Vehicles needing attention
  const vehiclesNeedingAttention = vehicles.filter(
    v => v.status === 'maintenance' || v.nextMaintenanceKm - v.kilometrage < 1000
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
        <p className="text-gray-600">Bienvenue dans votre espace d'administration</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Véhicules"
          value={stats.totalVehicles}
          icon={Truck}
          color="primary"
          trend="up"
          trendValue="+2 ce mois"
        />
        <StatsCard
          title="Trajets en cours"
          value={stats.activeTrips}
          icon={MapPin}
          color="success"
        />
        <StatsCard
          title="Chauffeurs actifs"
          value={stats.totalDrivers}
          icon={Users}
          color="info"
        />
        <StatsCard
          title="Maintenance en attente"
          value={stats.pendingMaintenance}
          icon={Wrench}
          color={stats.pendingMaintenance > 0 ? 'warning' : 'success'}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Consommation de carburant" subtitle="Derniers 6 mois">
          <FuelChart />
        </Card>
        <Card title="Kilométrage mensuel" subtitle="Évolution sur l'année">
          <KilometrageChart />
        </Card>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Trips */}
        <Card title="Trajets récents" subtitle="Les 5 derniers trajets">
          {tripsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : recentTrips.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucun trajet récent</p>
          ) : (
            <div className="space-y-4">
              {recentTrips.map((trip) => (
                <div
                  key={trip._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <MapPin size={20} className="text-primary-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {trip.origin} → {trip.destination}
                      </p>
                      <p className="text-sm text-gray-500">
                        {trip.driver?.firstname} {trip.driver?.lastname}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      trip.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : trip.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {trip.status === 'completed'
                      ? 'Terminé'
                      : trip.status === 'in_progress'
                      ? 'En cours'
                      : 'En attente'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Vehicles Needing Attention */}
        <Card
          title="Véhicules à surveiller"
          subtitle="Maintenance requise ou proche"
        >
          {vehiclesLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : vehiclesNeedingAttention.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp size={48} className="mx-auto text-green-500 mb-2" />
              <p className="text-gray-500">Tous les véhicules sont en bon état</p>
            </div>
          ) : (
            <div className="space-y-4">
              {vehiclesNeedingAttention.map((vehicle) => (
                <div
                  key={vehicle._id}
                  className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <AlertTriangle size={20} className="text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {vehicle.matricule}
                      </p>
                      <p className="text-sm text-gray-500">
                        {vehicle.brand} {vehicle.model}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-yellow-700 font-medium">
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
