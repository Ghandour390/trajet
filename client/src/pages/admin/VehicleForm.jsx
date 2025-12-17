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
    tireCount: 4,
  });

  const [tires, setTires] = useState([]);

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
    
    if (name === 'tireCount') {
      const count = parseInt(value) || 0;
      setTires(Array(count).fill(null).map((_, i) => ({
        serial: '',
        position: `Position ${i + 1}`,
        brand: '',
        pressure: '',
        depth: ''
      })));
    }
  };

  const handleTireChange = (index, field, value) => {
    setTires(prev => prev.map((tire, i) => 
      i === index ? { ...tire, [field]: value } : tire
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...formData, tires };
      if (isEditMode) {
        await dispatch(updateVehicle({ id, data: dataToSend })).unwrap();
        notify.success('Véhicule mis à jour avec succès');
      } else {
        await dispatch(createVehicle(dataToSend)).unwrap();
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
    { value: 'Camionnette', label: 'Camionnette' },
    { value: 'Tracteur', label: 'Tracteur' },
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
            <Input
              label="Nombre de pneus"
              name="tireCount"
              type="number"
              value={formData.tireCount}
              onChange={handleInputChange}
              required
              min="2"
              max="12"
              placeholder="4"
            />
          </div>

          {tires.length > 0 && (
            <div className="border-t border-gray-200 dark:border-slate-700 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Pneus ({tires.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tires.map((tire, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl space-y-3">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300">Pneu {index + 1}</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Numéro série"
                        value={tire.serial}
                        onChange={(e) => handleTireChange(index, 'serial', e.target.value)}
                        placeholder="TIRE001"
                        required
                      />
                      <Input
                        label="Position"
                        value={tire.position}
                        onChange={(e) => handleTireChange(index, 'position', e.target.value)}
                        placeholder="Avant Gauche"
                      />
                      <Input
                        label="Marque"
                        value={tire.brand}
                        onChange={(e) => handleTireChange(index, 'brand', e.target.value)}
                        placeholder="Michelin"
                      />
                      <Input
                        label="Pression (bar)"
                        type="number"
                        step="0.1"
                        value={tire.pressure}
                        onChange={(e) => handleTireChange(index, 'pressure', e.target.value)}
                        placeholder="8.5"
                      />
                      <Input
                        label="Profondeur (mm)"
                        type="number"
                        step="0.1"
                        value={tire.depth}
                        onChange={(e) => handleTireChange(index, 'depth', e.target.value)}
                        placeholder="7.5"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
