import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft } from 'lucide-react';
import { Button, Card } from '../../components/common';
import { selectTrips } from '../../store/slices/tripsSlice';

export default function TripView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const trips = useSelector(selectTrips);
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    const foundTrip = trips.find(t => t._id === id);
    setTrip(foundTrip);
  }, [id, trips]);

  const getStatusBadge = (status) => {
    const statusStyles = {
      planned: {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        text: 'text-yellow-700 dark:text-yellow-400',
        dot: 'bg-yellow-500'
      },
      in_progress: {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-700 dark:text-blue-400',
        dot: 'bg-blue-500'
      },
      completed: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-400',
        dot: 'bg-green-500'
      },
      cancelled: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-700 dark:text-red-400',
        dot: 'bg-red-500'
      },
    };

    const statusLabels = {
      planned: 'Planifié',
      in_progress: 'En cours',
      completed: 'Terminé',
      cancelled: 'Annulé',
    };

    const style = statusStyles[status] || { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400', dot: 'bg-gray-400' };

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
        {statusLabels[status] || status}
      </span>
    );
  };

  if (!trip) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/admin/trips')}>
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Trajet introuvable</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/admin/trips')}>
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Détails du trajet</h1>
            <p className="text-gray-600 dark:text-slate-400">Informations complètes du trajet</p>
          </div>
        </div>
        <Button variant="primary" onClick={() => navigate(`/admin/trips/edit/${id}`)}>
          Modifier
        </Button>
      </div>

      <Card>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-slate-400">Référence</p>
              <p className="font-semibold text-gray-900 dark:text-white">{trip.reference}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-slate-400">Statut</p>
              {getStatusBadge(trip.status)}
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-slate-400">Origine</p>
              <p className="font-semibold text-gray-900 dark:text-white">{trip.origin}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-slate-400">Destination</p>
              <p className="font-semibold text-gray-900 dark:text-white">{trip.destination}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-slate-400">Date début</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {trip.startAt ? new Date(trip.startAt).toLocaleString('fr-FR') : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-slate-400">Date fin</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {trip.endAt ? new Date(trip.endAt).toLocaleString('fr-FR') : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-slate-400">Véhicule</p>
              <p className="font-semibold text-gray-900 dark:text-white">{trip.vehicleRef?.plateNumber || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-slate-400">Remorque</p>
              <p className="font-semibold text-gray-900 dark:text-white">{trip.trailerRef?.plateNumber || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-slate-400">Chauffeur</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {trip.assignedTo ? `${trip.assignedTo.firstname} ${trip.assignedTo.lastname}` : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-slate-400">Distance estimée</p>
              <p className="font-semibold text-gray-900 dark:text-white">{trip.distimatedKm} km</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
