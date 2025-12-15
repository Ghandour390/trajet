import { MapPin, Calendar, ChevronRight } from 'lucide-react';
import { StatusBadge } from '../common';

/**
 * TripCard Component
 * Card for displaying trip information for drivers
 */
export default function TripCard({ trip, onClick }) {
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
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
            Trajet #{trip._id?.slice(-6).toUpperCase()}
          </h3>
          <StatusBadge status={trip.status} size="sm" />
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
