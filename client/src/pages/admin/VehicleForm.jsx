import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button, Card, Input, Select } from '../../components/common';
import { createVehicle, updateVehicle, selectVehicles, selectVehiclesLoading } from '../../store/slices/vehiclesSlice';
import { notify } from '../../utils/notifications';

export default function VehicleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const vehicles = useSelector(selectVehicles);
  const loading = useSelector(selectVehiclesLoading);
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    plateNumber: '',
    type: '',
    brand: '',
    year: '',
    currentKm: '',
    status: 'active',
  });

  useEffect(() => {
    if (isEditMode) {
      const vehicle = vehicles.find(v => v._id === id);
      if (vehicle) {
        setFormData({
          plateNumber: vehicle.plateNumber || '',
          type: vehicle.type || '',
          brand: vehicle.brand || '',
          year: vehicle.year || '',
          currentKm: vehicle.currentKm || '',
          status: vehicle.status || 'active',
        });
      }
    }
  }, [id, isEditMode, vehicles]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await dispatch(updateVehicle({ id, data: formData })).unwrap();
        notify.success('Véhicule mis à jour avec succès');
      } else {
        await dispatch(createVehicle(formData)).unwrap();
        notify.success('Véhicule créé avec succès');
      }
      navigate('/admin/vehicles');
    } catch (error) {
      notify.error(error || 'Erreur lors de l\'opération');
    }
  };

  const statusOptions = [
    { value: 'active', label: 'Actif' },
    { value: 'in_use', label: 'En utilisation' },
    { value: 'maintenance', label: 'En maintenance' },
    { value: 'inactive', label: 'Inactif' },
  ];

  const typeOptions = [
    { value: 'Camion', label: 'Camion' },
    { value: 'Remorque', label: 'Remorque' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/admin/vehicles')}>
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {isEditMode ? 'Modifier le véhicule' : 'Ajouter un véhicule'}
          </h1>
          <p className="text-gray-600 dark:text-slate-400">
            {isEditMode ? 'Modifiez les informations du véhicule' : 'Ajoutez un nouveau véhicule'}
          </p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Matricule"
              name="plateNumber"
              value={formData.plateNumber}
              onChange={handleInputChange}
              required
              placeholder="AA-123-BB"
            />
            <Select
              label="Type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              options={typeOptions}
              required
            />
            <Input
              label="Marque"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              required
              placeholder="Mercedes"
            />
            <Input
              label="Année"
              name="year"
              type="number"
              value={formData.year}
              onChange={handleInputChange}
              required
              placeholder="2023"
            />
            <Input
              label="Kilométrage actuel"
              name="currentKm"
              type="number"
              value={formData.currentKm}
              onChange={handleInputChange}
              required
              placeholder="50000"
            />
            <Select
              label="Statut"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              options={statusOptions}
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => navigate('/admin/vehicles')}>
              Annuler
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              {isEditMode ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
