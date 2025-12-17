import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button, Card, Input, Select } from '../../components/common';
import { createFuelRecord } from '../../store/slices/fuelSlice';
import { getVehicles, selectVehicles } from '../../store/slices/vehiclesSlice';
import { getTrips, selectTrips } from '../../store/slices/tripsSlice';
import { selectUser } from '../../store/slices/authSlice';
import { notify } from '../../utils/notifications';

export default function FuelForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const vehicles = useSelector(selectVehicles);
  const trips = useSelector(selectTrips);
  const user = useSelector(selectUser);

  const [formData, setFormData] = useState({
    trip: '',
    vehicle: '',
    driver: user?.id || '',
    liters: '',
    cost: '',
    station: '',
    location: '',
    odometer: '',
    fuelType: 'diesel',
    notes: ''
  });

  useEffect(() => {
    dispatch(getVehicles());
    dispatch(getTrips());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createFuelRecord(formData)).unwrap();
      notify.success('Plein enregistré avec succès');
      navigate('/admin/fuel');
    } catch (error) {
      notify.error(error || 'Erreur lors de l\'enregistrement');
    }
  };

  const fuelTypeOptions = [
    { value: 'diesel', label: 'Diesel' },
    { value: 'essence', label: 'Essence' },
    { value: 'gpl', label: 'GPL' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/admin/fuel')}>
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Enregistrer un plein
          </h1>
          <p className="text-gray-600 dark:text-slate-400">
            Ajoutez un nouvel enregistrement de carburant
          </p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Trajet"
              name="trip"
              value={formData.trip}
              onChange={handleInputChange}
              options={trips.map(t => ({ value: t._id, label: `${t.reference} - ${t.origin} → ${t.destination}` }))}
              required
            />
            <Select
              label="Véhicule"
              name="vehicle"
              value={formData.vehicle}
              onChange={handleInputChange}
              options={vehicles.map(v => ({ value: v._id, label: v.plateNumber }))}
              required
            />
            <Input
              label="Litres"
              name="liters"
              type="number"
              step="0.01"
              value={formData.liters}
              onChange={handleInputChange}
              required
              placeholder="50.5"
            />
            <Input
              label="Coût (MAD)"
              name="cost"
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={handleInputChange}
              required
              placeholder="500"
            />
            <Input
              label="Station"
              name="station"
              value={formData.station}
              onChange={handleInputChange}
              placeholder="Total, Shell..."
            />
            <Input
              label="Localisation"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Casablanca"
            />
            <Input
              label="Kilométrage"
              name="odometer"
              type="number"
              value={formData.odometer}
              onChange={handleInputChange}
              placeholder="50000"
            />
            <Select
              label="Type de carburant"
              name="fuelType"
              value={formData.fuelType}
              onChange={handleInputChange}
              options={fuelTypeOptions}
              required
            />
          </div>
          <Input
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Remarques..."
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => navigate('/admin/fuel')}>
              Annuler
            </Button>
            <Button type="submit" variant="primary">
              Enregistrer
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
