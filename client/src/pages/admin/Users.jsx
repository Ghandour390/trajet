import { useState, useEffect } from 'react';
import { Search, User } from 'lucide-react';
import { Button, Card, Table, Modal, Input, Select } from '../../components/common';
import * as usersAPI from '../../api/users';
import { notify } from '../../utils/notifications';

/**
 * AdminUsers Page
 * User management for admin
 */
export default function AdminUsers() {
  // Local state
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    role: 'chauffeur',
  });

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await usersAPI.getUsers();
      setUsers(response.users || response);
    } catch {
      notify.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open modal for edit
  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'chauffeur',
    });
    setIsModalOpen(true);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await usersAPI.updateUser(selectedUser._id, formData);
      notify.success('Utilisateur mis à jour avec succès');
      setIsModalOpen(false);
      fetchUsers();
    } catch {
      notify.error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    const roleStyles = {
      admin: 'bg-purple-100 text-purple-800',
      chauffeur: 'bg-blue-100 text-blue-800',
      manager: 'bg-green-100 text-green-800',
    };

    const roleLabels = {
      admin: 'Administrateur',
      chauffeur: 'Chauffeur',
      manager: 'Manager',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleStyles[role] || 'bg-gray-100'}`}>
        {roleLabels[role] || role}
      </span>
    );
  };

  const columns = [
    {
      header: 'Utilisateur',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <User size={20} className="text-primary-500" />
          </div>
          <div>
            <p className="font-medium text-gray-800">
              {row.firstname} {row.lastname}
            </p>
            <p className="text-sm text-gray-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Téléphone',
      accessor: 'phone',
      render: (row) => row.phone || '-',
    },
    {
      header: 'Rôle',
      render: (row) => getRoleBadge(row.role),
    },
    {
      header: 'Inscrit le',
      render: (row) =>
        row.createdAt
          ? new Date(row.createdAt).toLocaleDateString('fr-FR')
          : '-',
    },
    {
      header: 'Actions',
      render: (row) => (
        <Button size="sm" variant="ghost" onClick={() => openEditModal(row)}>
          Modifier
        </Button>
      ),
    },
  ];

  const roleOptions = [
    { value: 'admin', label: 'Administrateur' },
    { value: 'chauffeur', label: 'Chauffeur' },
    { value: 'manager', label: 'Manager' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Utilisateurs</h1>
        <p className="text-gray-600">Gérez les utilisateurs de la plateforme</p>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="">Tous les rôles</option>
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card padding={false}>
        <Table
          columns={columns}
          data={filteredUsers}
          loading={loading}
          emptyMessage="Aucun utilisateur trouvé"
        />
      </Card>

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Modifier l'utilisateur"
        size="lg"
      >
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
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              Mettre à jour
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
