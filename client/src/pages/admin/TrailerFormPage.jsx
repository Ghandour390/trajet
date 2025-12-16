import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button, Card, Input, Select } from '../../components/common';
import { createTrailer, updateTrailer, selectTrailers, selectTrailersLoading } from '../../store/slices/trailersSlice';
import { notify } from '../../utils/notifications';

export default function TrailerFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const trailers = useSelector(selectTrailers);
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
  });

  useEffect(() => {
    if (isEditMode) {
      const trailer = trailers.find(t => t._id === id);
      if (trailer) {
        setFormData({
          plateNumber: trailer.plateNumber || '',
          type: trailer.type || '',
          brand: trailer.brand || '',
          model: trailer.model || '',
          year: trailer.year || '',
          capacity: trailer.capacity || '',
          currentKm: trailer.currentKm || '',
          status: trailer.status || 'available',
        });
      }
    }
  }, [id, isEditMode, trailers]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await dispatch(updateTrailer({ id, data: formData })).unwrap();
        notify.success('Remorque mise à jour avec succès');
      } else {
        await dispatch(createTrailer(formData)).unwrap();
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
          </div>
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
