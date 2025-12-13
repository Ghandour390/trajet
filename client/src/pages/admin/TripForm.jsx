import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button, Card, Input, Select } from '../../components/common';
import { createTrip, updateTrip, selectTrips, selectTripsLoading } from '../../store/slices/tripsSlice';
import { notify } from '../../utils/notifications';
import { getAvailableDrivers, getAvailableVehicles, getAvailableTrailers } from '../../api/trips';

export default function TripForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const trips = useSelector(selectTrips);
  const loading = useSelector(selectTripsLoading);
  const isEditMode = !!id;

  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [availableTrailers, setAvailableTrailers] = useState([]);
  const [formData, setFormData] = useState({
    reference: '',
    origin: '',
    destination: '',
    vehicleRef: '',
    trailerRef: '',
    assignedTo: '',
    startAt: '',
    endAt: '',
    distimatedKm: '',
  });

  useEffect(() => {
    if (isEditMode) {
      const trip = trips.find(t => t._id === id);
      if (trip) {
        setFormData({
          reference: trip.reference,
          origin: trip.origin,
          destination: trip.destination,
          vehicleRef: trip.vehicleRef?._id || '',
          trailerRef: trip.trailerRef?._id || '',
          assignedTo: trip.assignedTo?._id || '',
          startAt: trip.startAt ? new Date(trip.startAt).toISOString().slice(0, 16) : '',
          endAt: trip.endAt ? new Date(trip.endAt).toISOString().slice(0, 16) : '',
          distimatedKm: trip.distimatedKm || '',
        });
      }
    }
  }, [id, isEditMode, trips]);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);

    if ((name === 'startAt' || name === 'endAt') && newFormData.startAt && newFormData.endAt) {
      try {
        const [drivers, vehicles, trailers] = await Promise.all([
          getAvailableDrivers(newFormData.startAt, newFormData.endAt),
          getAvailableVehicles(newFormData.startAt, newFormData.endAt),
          getAvailableTrailers(newFormData.startAt, newFormData.endAt)
        ]);
        setAvailableDrivers(drivers);
        setAvailableVehicles(vehicles);
        setAvailableTrailers(trailers);
      } catch {
        notify.error('Erreur lors du chargement des disponibilités');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await dispatch(updateTrip({ id, data: formData })).unwrap();
        notify.success('Trajet modifié avec succès');
      } else {
        await dispatch(createTrip(formData)).unwrap();
        notify.success('Trajet créé avec succès');
      }
      navigate('/admin/trips');
    } catch {
      notify.error('Erreur lors de la création');
    }
  };

  const vehicleOptions = availableVehicles.map((v) => ({
    value: v._id,
    label: `${v.plateNumber} - ${v.brand}`,
  }));

  const driverOptions = availableDrivers.map((d) => ({
    value: d._id,
    label: `${d.firstname} ${d.lastname}`,
  }));

  const trailerOptions = availableTrailers.map((t) => ({
    value: t._id,
    label: `${t.plateNumber} - ${t.type}`,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/admin/trips')}>
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {isEditMode ? 'Modifier un trajet' : 'Créer un trajet'}
          </h1>
          <p className="text-gray-600 dark:text-slate-400">
            {isEditMode ? 'Modifiez les informations du trajet' : 'Ajoutez un nouveau trajet'}
          </p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Référence"
              name="reference"
              value={formData.reference}
              onChange={handleInputChange}
              required
              placeholder="TRIP001"
            />
            <Input
              label="Origine"
              name="origin"
              value={formData.origin}
              onChange={handleInputChange}
              required
              placeholder="Casablanca"
            />
            <Input
              label="Destination"
              name="destination"
              value={formData.destination}
              onChange={handleInputChange}
              required
              placeholder="Rabat"
            />
            <Input
              label="Date début"
              name="startAt"
              type="datetime-local"
              value={formData.startAt}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Date fin"
              name="endAt"
              type="datetime-local"
              value={formData.endAt}
              onChange={handleInputChange}
              required
            />
            <Select
              label="Véhicule disponible"
              name="vehicleRef"
              value={formData.vehicleRef}
              onChange={handleInputChange}
              options={vehicleOptions}
              disabled={!formData.startAt || !formData.endAt}
              placeholder={formData.startAt && formData.endAt ? "Sélectionner un véhicule" : "Choisir dates d'abord"}
            />
            <Select
              label="Chauffeur disponible"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleInputChange}
              options={driverOptions}
              disabled={!formData.startAt || !formData.endAt}
              placeholder={formData.startAt && formData.endAt ? "Sélectionner un chauffeur" : "Choisir dates d'abord"}
            />
            <Select
              label="Remorque disponible"
              name="trailerRef"
              value={formData.trailerRef}
              onChange={handleInputChange}
              options={trailerOptions}
              disabled={!formData.startAt || !formData.endAt}
              placeholder={formData.startAt && formData.endAt ? "Sélectionner une remorque" : "Choisir dates d'abord"}
            />
            <Input
              label="Distance (km)"
              name="distimatedKm"
              type="number"
              value={formData.distimatedKm}
              onChange={handleInputChange}
              placeholder="150"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => navigate('/admin/trips')}>
              Annuler
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              {isEditMode ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
