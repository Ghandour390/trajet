import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button, Card, Input, Select } from '../../components/common';
import { createTrailer, updateTrailer, getTrailerById, selectCurrentTrailer, selectTrailersLoading, clearCurrentTrailer } from '../../store/slices/trailersSlice';
import { notify } from '../../utils/notifications';

export default function TrailerFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentTrailer = useSelector(selectCurrentTrailer);
  const loading = useSelector(selectTrailersLoading);
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    plateNumber: '',
    type: '',
    brand: '',
    model: '',
    year: '',
    capacity: '',
    currentKm: '',
    status: 'available',
    tireCount: 4,
  });

  const [tires, setTires] = useState([]);

  useEffect(() => {
    if (isEditMode && id) {
      dispatch(getTrailerById(id));
    }
    return () => {
      dispatch(clearCurrentTrailer());
    };
  }, [id, isEditMode, dispatch]);

  useEffect(() => {
    if (isEditMode && currentTrailer) {
      console.log('Current Trailer:', currentTrailer);
      const normalizeType = (type) => {
        if (!type) return '';
        const typeMap = {
          'Remorque frigorifique': 'Frigorifique',
          'Remorque bâchée': 'Bâchée',
          'Remorque plateau': 'Plateau',
          'Remorque citerne': 'Citerne',
        };
        return typeMap[type] || type;
      };
      
      setFormData({
        plateNumber: currentTrailer.plateNumber || '',
        type: normalizeType(currentTrailer.type),
        brand: currentTrailer.brand || '',
        model: currentTrailer.model || '',
        year: String(currentTrailer.year || ''),
        capacity: String(currentTrailer.capacity || ''),
        currentKm: String(currentTrailer.currentKm || ''),
        status: currentTrailer.status || 'available',
      });
    }
  }, [currentTrailer, isEditMode]);

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
        await dispatch(updateTrailer({ id, data: dataToSend })).unwrap();
        notify.success('Remorque mise à jour avec succès');
      } else {
        await dispatch(createTrailer(dataToSend)).unwrap();
        notify.success('Remorque créée avec succès');
      }
      navigate('/admin/trailers');
    } catch (error) {
      notify.error(error || 'Erreur lors de l\'opération');
    }
  };

  const statusOptions = [
    { value: 'available', label: 'Disponible' },
    { value: 'in_use', label: 'En utilisation' },
    { value: 'maintenance', label: 'En maintenance' },
    { value: 'out_of_service', label: 'Hors service' },
  ];

  const typeOptions = [
    { value: 'Frigorifique', label: 'Frigorifique' },
    { value: 'Bâchée', label: 'Bâchée' },
    { value: 'Plateau', label: 'Plateau' },
    { value: 'Citerne', label: 'Citerne' },
    { value: 'Porte-conteneur', label: 'Porte-conteneur' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/admin/trailers')}>
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {isEditMode ? 'Modifier la remorque' : 'Ajouter une remorque'}
          </h1>
          <p className="text-gray-600 dark:text-slate-400">
            {isEditMode ? 'Modifiez les informations de la remorque' : 'Ajoutez une nouvelle remorque'}
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
              placeholder="Schmitz"
            />
            <Input
              label="Modèle"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              required
              placeholder="Cargobull"
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
              label="Capacité (tonnes)"
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleInputChange}
              required
              placeholder="25"
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
              min="4"
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
            <Button type="button" variant="ghost" onClick={() => navigate('/admin/trailers')}>
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
