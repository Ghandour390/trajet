import { MapPin, Calendar, ChevronRight } from 'lucide-react';

/**
 * TripCard Component
 * Card for displaying trip information for drivers
 */
export default function TripCard({ trip, onClick }) {
  const getStatusBadge = (status) => {
    const statusStyles = {
      planned: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };

    const statusLabels = {
      planned: 'Planifié',
      pending: 'En attente',
      in_progress: 'En cours',
      completed: 'Terminé',
      cancelled: 'Annulé',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
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
      className="bg-white rounded-xl shadow-md p-5 cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-800">
            Trajet #{trip._id?.slice(-6).toUpperCase()}
          </h3>
          {getStatusBadge(trip.status)}
        </div>
        <ChevronRight size={20} className="text-gray-400" />
      </div>

      <div className="space-y-3">
        {/* Origin */}
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Départ</p>
            <p className="font-medium text-gray-800">{trip.origin || trip.startLocation}</p>
          </div>
        </div>

        {/* Destination */}
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Arrivée</p>
            <p className="font-medium text-gray-800">{trip.destination || trip.endLocation}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
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
