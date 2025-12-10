import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  MapPin,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
} from 'lucide-react';
import { logout, selectUser } from '../../store/slices/authSlice';

/**
 * DriverSidebar Component
 * Navigation sidebar for driver/chauffeur panel
 */
export default function DriverSidebar({ isOpen, onToggle }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const menuItems = [
    { path: '/chauffeur/dashboard', icon: Home, label: 'Accueil' },
    { path: '/chauffeur/my-trips', icon: MapPin, label: 'Mes Trajets' },
    { path: '/chauffeur/profile', icon: User, label: 'Mon Profil' },
  ];

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-primary-100 text-primary-900 transition-all duration-300 z-40 ${
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
          <p className="text-sm text-primary-200">Chauffeur</p>
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
                  ? 'bg-primary-500 text-primary-100'
                  : 'text-primary-700 hover:bg-primary-400 hover:text-white'
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
