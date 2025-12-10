import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard,
  Truck,
  MapPin,
  Wrench,
  FileText,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { logout, selectUser } from '../../store/slices/authSlice';

/**
 * AdminSidebar Component
 * Navigation sidebar for admin panel
 */
export default function AdminSidebar({ isOpen, onToggle }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
    { path: '/admin/vehicles', icon: Truck, label: 'Véhicules' },
    { path: '/admin/trips', icon: MapPin, label: 'Trajets' },
    { path: '/admin/maintenance', icon: Wrench, label: 'Maintenance' },
    { path: '/admin/reports', icon: FileText, label: 'Rapports' },
    { path: '/admin/users', icon: Users, label: 'Utilisateurs' },
  ];

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-primary-500 text-white transition-all duration-300 z-40 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-6 border-b border-primary-400">
        {isOpen && (
          <h1 className="text-xl font-bold">TrajetCamen</h1>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-primary-400 transition-colors"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* User Info */}
      {isOpen && user && (
        <div className="px-4 py-4 border-b border-primary-400">
          <p className="font-semibold">{user.firstname} {user.lastname}</p>
          <p className="text-sm text-primary-200">Administrateur</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="mt-4 px-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-primary-100 hover:bg-primary-400'
              }`
            }
          >
            <item.icon size={20} />
            {isOpen && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-4 left-0 right-0 px-2">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-primary-100 hover:bg-primary-400 transition-colors"
        >
          <LogOut size={20} />
          {isOpen && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
}
