import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button, Card, Input, Select } from '../../components/common';
import * as usersAPI from '../../api/users';
import { notify } from '../../utils/notifications';

export default function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    role: 'chauffeur',
  });

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await usersAPI.getUsers();
      const users = response.users || response;
      const user = users.find(u => u._id === id);
      if (user) {
        setFormData({
          firstname: user.firstname || '',
          lastname: user.lastname || '',
          email: user.email || '',
          phone: user.phone || '',
          role: user.role || 'chauffeur',
        });
      }
    } catch {
      notify.error('Erreur lors du chargement de l\'utilisateur');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await usersAPI.updateUser(id, formData);
      notify.success('Utilisateur mis à jour avec succès');
      navigate('/admin/users');
    } catch {
      notify.error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'admin', label: 'Administrateur' },
    { value: 'chauffeur', label: 'Chauffeur' },
    { value: 'manager', label: 'Manager' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/admin/users')}>
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Modifier l'utilisateur</h1>
          <p className="text-gray-600 dark:text-slate-400">Modifiez les informations de l'utilisateur</p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Prénom"
              name="firstname"
              value={formData.firstname}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Nom"
              name="lastname"
              value={formData.lastname}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Téléphone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
            <Select
              label="Rôle"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              options={roleOptions}
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => navigate('/admin/users')}>
              Annuler
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              Mettre à jour
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
