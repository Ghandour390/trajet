import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Calendar, Edit, Shield } from 'lucide-react';
import { Button, Card, Table, PageHeader, SearchFilter, StatusBadge, Avatar } from '../../components/common';
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

  // Role options for filter
  const roleOptions = [
    { value: 'admin', label: 'Administrateur' },
    { value: 'chauffeur', label: 'Chauffeur' },
  ];

  const columns = [
    {
      header: 'Utilisateur',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar 
            src={row.profileImage} 
            name={`${row.firstname} ${row.lastname}`} 
            size="md" 
          />
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
      render: (row) => <StatusBadge status={row.role} />,
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
            <Avatar 
              src={row.profileImage} 
              name={`${row.firstname} ${row.lastname}`} 
              size="lg"
              className="border-2 border-white/30"
              gradient="from-white/30 to-white/20"
            />
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
          <StatusBadge status={row.role} />
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
      <PageHeader
        title="Utilisateurs"
        subtitle="Gérez les utilisateurs de la plateforme"
      />

      {/* Filters */}
      <SearchFilter
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Rechercher par nom ou email..."
        filterValue={roleFilter}
        onFilterChange={setRoleFilter}
        filterOptions={roleOptions}
        filterPlaceholder="Tous les rôles"
      />

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
