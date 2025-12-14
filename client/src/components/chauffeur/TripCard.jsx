import { MapPin, Calendar, ChevronRight } from 'lucide-react';

/**
 * TripCard Component
 * Card for displaying trip information for drivers
 */
export default function TripCard({ trip, onClick }) {
  const getStatusBadge = (status) => {
    const statusStyles = {
      planned: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400',
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400',
      in_progress: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400',
      completed: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
      cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400',
    };

    const statusLabels = {
      planned: 'Planifié',
      pending: 'En attente',
      in_progress: 'En cours',
      completed: 'Terminé',
      cancelled: 'Annulé',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div
      onClick={() => onClick(trip)}
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-md dark:shadow-slate-900/20 p-5 cursor-pointer hover:shadow-lg dark:hover:shadow-slate-900/40 transition-all duration-200 border border-gray-100 dark:border-slate-700"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-white">
            Trajet #{trip._id?.slice(-6).toUpperCase()}
          </h3>
          {getStatusBadge(trip.status)}
        </div>
        <ChevronRight size={20} className="text-gray-400 dark:text-slate-500" />
      </div>

      <div className="space-y-3">
        {/* Origin */}
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-slate-400">Départ</p>
            <p className="font-medium text-gray-800 dark:text-white">{trip.origin || trip.startLocation}</p>
          </div>
        </div>

        {/* Destination */}
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-slate-400">Arrivée</p>
            <p className="font-medium text-gray-800 dark:text-white">{trip.destination || trip.endLocation}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between text-sm text-gray-500 dark:text-slate-400">
        <div className="flex items-center gap-1">
          <Calendar size={16} />
          <span>{trip.startAt ? formatDate(trip.startAt) : 'Date invalide'}</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin size={16} />
          <span>{trip.distimatedKm || 0} km</span>
        </div>
      </div>
    </div>
  );
}
