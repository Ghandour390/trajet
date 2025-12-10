import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Lock, Save } from 'lucide-react';
import { Button, Card, Input } from '../../components/common';
import { selectUser } from '../../store/slices/authSlice';
import * as usersAPI from '../../api/users';
import { notify } from '../../utils/notifications';

/**
 * Profile Page
 * User profile management for drivers
 */
export default function Profile() {
  const user = useSelector(selectUser);

  // Local state
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);


  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle password input change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const userId = user?.id;
    try {
      await usersAPI.updateProfile(userId, formData);
      notify.success('Profil mis à jour avec succès');
    } catch (error) {
      notify.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      notify.error('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    try {
      await usersAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      notify.success('Mot de passe modifié avec succès');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
    } catch (error) {
      notify.error(error.response?.data?.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Mon Profil</h1>
        <p className="text-gray-600">Gérez vos informations personnelles</p>
      </div>

      {/* Profile Card */}
      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user?.firstname?.[0]}{user?.lastname?.[0]}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {user?.firstname} {user?.lastname}
            </h2>
            <p className="text-gray-500">{user?.email}</p>
            <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              Chauffeur
            </span>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleProfileSubmit} className="space-y-4">
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
          </div>
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
          <div className="flex justify-end">
            <Button type="submit" variant="primary" loading={loading}>
              <Save size={20} className="mr-2" />
              Enregistrer
            </Button>
          </div>
        </form>
      </Card>

      {/* Password Section */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Sécurité</h3>
            <p className="text-sm text-gray-500">Modifier votre mot de passe</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowPasswordForm(!showPasswordForm)}
          >
            <Lock size={20} className="mr-2" />
            {showPasswordForm ? 'Annuler' : 'Changer le mot de passe'}
          </Button>
        </div>

        {showPasswordForm && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4 mt-4 pt-4 border-t border-gray-100">
            <Input
              label="Mot de passe actuel"
              name="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nouveau mot de passe"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
              />
              <Input
                label="Confirmer le mot de passe"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="primary" loading={loading}>
                Modifier le mot de passe
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
