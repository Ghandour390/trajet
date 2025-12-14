// Dashboard component
import { useSelector } from 'react-redux';
import { MapPin, Truck, Clock } from 'lucide-react';
import { Card } from '../../components/common';
import { selectUser } from '../../store/slices/authSlice';

/**
 * ChauffeurDashboard Page
 * Dashboard for drivers showing their stats and upcoming trips
 */
export default function ChauffeurDashboard() {
  const user = useSelector(selectUser);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold">
          Bonjour, {user?.firstname} {user?.lastname}! 👋
        </h1>
        <p className="text-primary-100 mt-1">
          Bienvenue dans votre espace chauffeur
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
            <MapPin size={24} className="text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">0</p>
          <p className="text-sm text-gray-500 dark:text-slate-400">Trajets ce mois</p>
        </Card>
        <Card className="text-center">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
            <Truck size={24} className="text-green-600 dark:text-green-400" />
          </div>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">0 km</p>
          <p className="text-sm text-gray-500 dark:text-slate-400">Distance parcourue</p>
        </Card>
        <Card className="text-center">
          <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock size={24} className="text-yellow-600 dark:text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">0</p>
          <p className="text-sm text-gray-500 dark:text-slate-400">Trajets en attente</p>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card title="Activité récente">
        <div className="text-center py-8 text-gray-500 dark:text-slate-400">
          <MapPin size={48} className="mx-auto mb-3 text-gray-300 dark:text-slate-600" />
          <p>Aucune activité récente</p>
          <p className="text-sm">Vos trajets apparaîtront ici</p>
        </div>
      </Card>
    </div>
  );
}
