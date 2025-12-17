import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  LayoutDashboard,
  Truck,
  MapPin,
  Fuel,
  CircleDot,
  Wrench,
  FileText,
  Users,
  User,
  LogOut
} from 'lucide-react';
import { logout } from '../../store/slices/authSlice';

/**
 * AdminSidebar Component
 * Navigation sidebar for admin panel - Fully responsive with dark mode
 */
export default function AdminSidebar({ isOpen, onToggle, isMobile }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const user = useSelector(selectUser);

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
    { path: '/admin/vehicles', icon: Truck, label: 'Véhicules' },
    { path: '/admin/trips', icon: MapPin, label: 'Trajets' },
    { path: '/admin/fuel', icon: Fuel, label: 'Carburant' },
    { path: '/admin/maintenance', icon: Wrench, label: 'Maintenance' },
    { path: '/admin/reports', icon: FileText, label: 'Rapports' },
    { path: '/admin/users', icon: Users, label: 'Utilisateurs' }
  ];

  const handleLogout = () => {
    requestAnimationFrame(async () => {
      await dispatch(logout());
      navigate('/login');
    });
  };

  const handleNavClick = (e) => {
    if (isMobile) {
      e.preventDefault();
      requestAnimationFrame(() => onToggle());
    }
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-40 transition-transform will-change-transform
        ${isOpen ? 'w-64 translate-x-0' : isMobile ? '-translate-x-full w-64' : 'w-20 translate-x-0'}
        bg-primary-700 dark:bg-slate-900 shadow-2xl`}
    >
      {/* Logo & Toggle */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-primary-500/30 dark:border-slate-700">
        {isOpen && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">TrajetCamen</span>
          </div>
        )}
        {/* <button
          onClick={onToggle}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-200 hover:scale-105"
        >
          {isMobile ? (
            <X size={20} />
          ) : isOpen ? (
            <ChevronLeft size={20} />
          ) : (
            <ChevronRight size={20} />
          )}
        </button> */}
      </div>

      {/* User Info */}
      {/* {isOpen && user && (
        <div className="px-4 py-4 border-b border-primary-500/30 dark:border-slate-700 animate-fade-in">
          <div className="flex items-center gap-3">
            {user.profileImage ? (
              <img src={user.profileImage} alt="Profile" className="w-12 h-12 rounded-full object-cover shadow-lg" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {user.firstname?.[0]}{user.lastname?.[0]}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate">
                {user.firstname} {user.lastname}
              </p>
              <p className="text-sm text-primary-200 dark:text-slate-400">Administrateur</p>
            </div>
          </div>
        </div>
      )} */}

      {/* Navigation */}
      <nav className="mt-4 px-3 flex-1 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item, index) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                ${isActive
                  ? 'bg-white/20 text-white'
                  : 'text-primary-100 dark:text-slate-300 hover:bg-white/10 hover:text-white'
                }
                ${!isOpen && !isMobile ? 'justify-center px-3' : ''}`
              }
            >
              <item.icon size={22} className="flex-shrink-0" />
              {(isOpen || isMobile) && (
                <span className="font-medium truncate">{item.label}</span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Logout */}
      <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-primary-500/30 dark:border-slate-700 bg-primary-800/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl
            text-red-200 hover:text-white hover:bg-red-500/20 transition-colors
            ${!isOpen && !isMobile ? 'justify-center px-3' : ''}`}
        >
          <LogOut size={22} className="flex-shrink-0" />
          {(isOpen || isMobile) && <span className="font-medium">Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
}
