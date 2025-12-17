import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button, Card, Input, Select } from '../../components/common';
import { createMaintenance, selectMaintenanceLoading } from '../../store/slices/maintenanceSlice';
import { getVehicles, selectVehicles } from '../../store/slices/vehiclesSlice';
import { notify } from '../../utils/notifications';

export default function MaintenanceForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const vehicles = useSelector(selectVehicles);
  const loading = useSelector(selectMaintenanceLoading);

  const [formData, setFormData] = useState({
    vehicleRef: '',
    type: '',
    notes: '',
    cost: '',
    date: '',
    km: '',
  });

  useEffect(() => {
    dispatch(getVehicles());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createMaintenance(formData)).unwrap();
      notify.success('Maintenance créée avec succès');
      navigate('/admin/maintenance');
    } catch (error) {
      notify.error(error || 'Erreur lors de la création');
    }
  };

  const typeOptions = [
    { value: 'Vidange', label: 'Vidange' },
    { value: 'Révision', label: 'Révision' },
    { value: 'Changement pneus', label: 'Changement pneus' },
    { value: 'Freins', label: 'Freins' },
    { value: 'Moteur', label: 'Moteur' },
    { value: 'Contrôle technique', label: 'Contrôle technique' },
    { value: 'Autre', label: 'Autre' },
  ];

  const vehicleOptions = vehicles.map((v) => ({
    value: v._id,
    label: `${v.plateNumber} - ${v.brand}`,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/admin/maintenance')}>
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Planifier une maintenance</h1>
          <p className="text-gray-600 dark:text-slate-400">Ajoutez une nouvelle maintenance</p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Véhicule"
              name="vehicleRef"
              value={formData.vehicleRef}
              onChange={handleInputChange}
              options={vehicleOptions}
              required
            />
            <Select
              label="Type de maintenance"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              options={typeOptions}
              required
            />
            <Input
              label="Kilométrage"
              name="km"
              type="number"
              value={formData.km}
              onChange={handleInputChange}
              required
              min="0"
              placeholder="45000"
            />
            <Input
              label="Coût (MAD)"
              name="cost"
              type="number"
              value={formData.cost}
              onChange={handleInputChange}
              placeholder="1500"
            />
            <Input
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>
          <Input
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Détails de la maintenance..."
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => navigate('/admin/maintenance')}>
              Annuler
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              Créer
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
