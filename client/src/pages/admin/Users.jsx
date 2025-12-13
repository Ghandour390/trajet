import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, Mail, Phone, Calendar, Edit, Shield } from 'lucide-react';
import { Button, Card, Table } from '../../components/common';
import * as usersAPI from '../../api/users';
import { notify } from '../../utils/notifications';

/**
 * AdminUsers Page
 * User management for admin
 */
export default function AdminUsers() {
  // Local state
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await usersAPI.getUsers();
      setUsers(response.users || response);
    } catch (_error) {
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



  const getRoleBadge = (role) => {
    const roleStyles = {
      admin: {
        bg: 'bg-purple-100 dark:bg-purple-900/30',
        text: 'text-purple-700 dark:text-purple-400',
        dot: 'bg-purple-500'
      },
      chauffeur: {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-700 dark:text-blue-400',
        dot: 'bg-blue-500'
      },
      manager: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-400',
        dot: 'bg-green-500'
      },
    };

    const roleLabels = {
      admin: 'Administrateur',
      chauffeur: 'Chauffeur',
      manager: 'Manager',
    };

    const style = roleStyles[role] || { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400', dot: 'bg-gray-400' };

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
        {roleLabels[role] || role}
      </span>
    );
  };

  const columns = [
    {
      header: 'Utilisateur',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
            <User size={20} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {row.firstname} {row.lastname}
            </p>
            <p className="text-sm text-gray-500 dark:text-slate-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Téléphone',
      accessor: 'phone',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-300">{row.phone || '-'}</span>
      ),
    },
    {
      header: 'Rôle',
      render: (row) => getRoleBadge(row.role),
    },
    {
      header: 'Inscrit le',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-300">
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString('fr-FR') : '-'}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <Button size="sm" variant="ghost" onClick={() => navigate(`/admin/users/edit/${row._id}`)}>
          <Edit size={16} className="mr-1" />
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

  // Mobile Card Renderer for Users
  const renderMobileCard = (row, index) => (
    <div
      key={row._id || index}
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden"
    >
      {/* Card Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <User size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">{row.firstname} {row.lastname}</h3>
              <p className="text-white/80 text-sm">{row.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-3">
        {/* Role Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-gray-400 dark:text-slate-500" />
            <span className="text-sm text-gray-500 dark:text-slate-400">Rôle</span>
          </div>
          {getRoleBadge(row.role)}
        </div>

        {/* Phone */}
        {row.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone size={16} className="text-gray-400 dark:text-slate-500" />
            <span className="text-gray-500 dark:text-slate-400">Téléphone:</span>
            <span className="font-medium text-gray-900 dark:text-white">{row.phone}</span>
          </div>
        )}

        {/* Created Date */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar size={16} className="text-gray-400 dark:text-slate-500" />
          <span className="text-gray-500 dark:text-slate-400">Inscrit le:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {row.createdAt ? new Date(row.createdAt).toLocaleDateString('fr-FR') : '-'}
          </span>
        </div>

        {/* Actions */}
        <div className="pt-2 border-t border-gray-100 dark:border-slate-700">
          <button
            onClick={() => navigate(`/admin/users/edit/${row._id}`)}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-xl font-medium text-sm hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors"
          >
            <Edit size={16} />
            Modifier l'utilisateur
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Utilisateurs</h1>
        <p className="text-gray-600 dark:text-slate-400">Gérez les utilisateurs de la plateforme</p>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
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
          mobileCard={renderMobileCard}
        />
      </Card>


    </div>
  );
}
