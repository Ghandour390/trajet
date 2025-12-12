import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Fuel, Save } from 'lucide-react';
import { Button, Card, Input } from '../../components/common';
import {
  getTripById,
  updateTrip,
  updateTripStatus,
  selectCurrentTrip,
  selectTripsLoading,
  clearCurrentTrip,
} from '../../store/slices/tripsSlice';
import { createFuelRecord } from '../../store/slices/fuelSlice';
import { notify } from '../../utils/notifications';
import { updateTripMileage } from '../../api/trips';

/**
 * TripDetails Page
 * View and update trip details (status, fuel, kilometrage)
 */
export default function TripDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const trip = useSelector(selectCurrentTrip);
  const loading = useSelector(selectTripsLoading);

  // Local state for form
  const [formData, setFormData] = useState({
    status: '',
    startKilometrage: '',
    endKilometrage: '',
    notes: '',
  });

  // Local state for fuel form
  const [fuelData, setFuelData] = useState({
    liters: '',
    cost: '',
    station: '',
  });

  const [showFuelForm, setShowFuelForm] = useState(false);

  // Fetch trip on mount
  useEffect(() => {
    if (id) {
      dispatch(getTripById(id));
    }

    return () => {
      dispatch(clearCurrentTrip());
    };
  }, [dispatch, id]);

  // Update form when trip loads
  useEffect(() => {
    if (trip) {
      setFormData({
        status: trip.status || '',
        startKilometrage: trip.startKm || '',
        endKilometrage: trip.endKm || '',
        notes: trip.notes || '',
      });
    }
  }, [trip]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle fuel input change
  const handleFuelChange = (e) => {
    const { name, value } = e.target;
    setFuelData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle status update
  const handleStatusUpdate = async (newStatus) => {
    try {
      await dispatch(updateTripStatus({ id, status: newStatus })).unwrap();
      notify.success('Statut mis à jour');
    } catch (error) {
      notify.error(error || 'Erreur lors de la mise à jour');
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTripMileage(id, formData.startKilometrage, formData.endKilometrage, formData.notes);
      notify.success('Trajet mis à jour avec succès');
      dispatch(getTripById(id));
    } catch (error) {
      notify.error(error?.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  // Handle fuel submit
  const handleFuelSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        createFuelRecord({
          trip: id,
          vehicle: trip.vehicleRef?._id,
          driver: trip.assignedTo?._id,
          ...fuelData,
        })
      ).unwrap();
      notify.success('Carburant enregistré');
      setFuelData({ liters: '', cost: '', station: '' });
      setShowFuelForm(false);
    } catch (error) {
      notify.error(error || 'Erreur lors de l\'enregistrement');
    }
  };

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
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status] || 'bg-gray-100'}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

  // Status options pour future utilisation
  const _statusOptions = [
    { value: 'pending', label: 'En attente' },
    { value: 'in_progress', label: 'En cours' },
    { value: 'completed', label: 'Terminé' },
  ];

  if (loading && !trip) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!trip) {
    return (
      <Card>
        <div className="text-center py-12">
          <p className="text-gray-500">Trajet non trouvé</p>
          <Button onClick={() => navigate('/chauffeur/my-trips')} className="mt-4">
            Retour aux trajets
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button & Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/chauffeur/my-trips')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">
            Détails du trajet
          </h1>
          <p className="text-gray-600">#{trip._id?.slice(-6).toUpperCase()}</p>
        </div>
        {getStatusBadge(trip.status)}
      </div>

      {/* Trip Info */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Origin */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Départ</p>
              <p className="text-lg font-semibold text-gray-800">
                {trip.origin || trip.startLocation}
              </p>
            </div>
          </div>

          {/* Destination */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Arrivée</p>
              <p className="text-lg font-semibold text-gray-800">
                {trip.destination || trip.endLocation}
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Distance estimée</p>
            <p className="font-semibold">{trip.distimatedKm || 0} km</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Véhicule</p>
            <p className="font-semibold">{trip.vehicleRef?.plateNumber || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Remorque</p>
            <p className="font-semibold">{trip.trailerRef?.plateNumber || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date début</p>
            <p className="font-semibold">
              {trip.startAt ? new Date(trip.startAt).toLocaleDateString('fr-FR') : 'Invalid Date'}
            </p>
          </div>
        </div>
      </Card>

      {/* Quick Status Actions */}
      {trip.status !== 'completed' && trip.status !== 'cancelled' && (
        <Card title="Actions rapides">
          <div className="flex flex-wrap gap-3">
            {trip.status === 'planned' && (
              <Button
                variant="primary"
                onClick={() => handleStatusUpdate('in_progress')}
              >
                Démarrer le trajet
              </Button>
            )}
            {trip.status === 'in_progress' && (
              <>
                <Button
                  variant="success"
                  onClick={() => handleStatusUpdate('completed')}
                >
                  Terminer le trajet
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowFuelForm(!showFuelForm)}
                >
                  <Fuel size={20} className="mr-2" />
                  Ajouter carburant
                </Button>
              </>
            )}
          </div>
        </Card>
      )}

      {/* Fuel Form */}
      {showFuelForm && (
        <Card title="Enregistrer du carburant">
          <form onSubmit={handleFuelSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Litres"
                name="liters"
                type="number"
                value={fuelData.liters}
                onChange={handleFuelChange}
                required
                placeholder="50"
              />
              <Input
                label="Coût (MAD)"
                name="cost"
                type="number"
                value={fuelData.cost}
                onChange={handleFuelChange}
                required
                placeholder="500"
              />
              <Input
                label="Station"
                name="station"
                value={fuelData.station}
                onChange={handleFuelChange}
                placeholder="Shell, Total..."
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" variant="primary" loading={loading}>
                Enregistrer
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowFuelForm(false)}
              >
                Annuler
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Update Form */}
      <Card title="Mettre à jour le trajet">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Kilométrage départ"
              name="startKilometrage"
              type="number"
              value={formData.startKilometrage}
              onChange={handleInputChange}
              placeholder="150000"
            />
            <Input
              label="Kilométrage arrivée"
              name="endKilometrage"
              type="number"
              value={formData.endKilometrage}
              onChange={handleInputChange}
              placeholder="150300"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="Remarques sur le trajet..."
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="primary" loading={loading}>
              <Save size={20} className="mr-2" />
              Enregistrer
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
