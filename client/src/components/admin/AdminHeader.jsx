import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Menu, User, Moon, Sun, Search, Settings, ChevronDown } from 'lucide-react';
import { selectUser } from '../../store/slices/authSlice';
import { useTheme } from '../../contexts/ThemeContext';
import NotificationBell from './NotificationBell';

/**
 * AdminHeader Component
 * Top header bar for admin panel - Fully responsive with dark mode
 */
export default function AdminHeader({ onMenuClick }) {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-slate-700/50 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Menu Toggle - Always visible */}
          <button
            onClick={onMenuClick}
            className="p-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 
              text-gray-600 dark:text-gray-300 transition-all duration-200 hover:scale-105"
          >
            <Menu size={22} />
          </button>

          {/* Search - Hidden on small screens */}
          <div className="hidden sm:flex relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl
                bg-gray-100 dark:bg-slate-800 
                border border-transparent
                focus:border-primary-500 dark:focus:border-primary-400
                focus:bg-white dark:focus:bg-slate-800
                text-gray-700 dark:text-gray-200
                placeholder-gray-400 dark:placeholder-slate-500
                outline-none transition-all duration-200
                focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dark Mode Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 
              transition-all duration-200 hover:scale-105 group"
            title={isDark ? 'Mode clair' : 'Mode sombre'}
          >
            {isDark ? (
              <Sun size={20} className="text-yellow-500 group-hover:rotate-45 transition-transform duration-300" />
            ) : (
              <Moon size={20} className="text-slate-600 group-hover:-rotate-12 transition-transform duration-300" />
            )}
          </button>

          {/* Notifications */}
          <NotificationBell />

          {/* User Profile */}
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 sm:pr-3 rounded-xl 
                bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 
                transition-all duration-200"
            >
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-9 h-9 rounded-xl object-cover shadow-lg" />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 
                  flex items-center justify-center text-white font-semibold shadow-lg">
                  {user?.firstname?.[0]}{user?.lastname?.[0]}
                </div>
              )}
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-gray-800 dark:text-white leading-tight">
                  {user?.firstname} {user?.lastname}
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400">Admin</p>
              </div>
              <ChevronDown size={16} className="hidden sm:block text-gray-400 dark:text-slate-500" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden animate-fade-in">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700">
                  <p className="font-semibold text-gray-800 dark:text-white">{user?.firstname} {user?.lastname}</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">{user?.email}</p>
                </div>
                <div className="py-2">
                  <button onClick={() => navigate('/admin/profile')} className="w-full px-4 py-2.5 text-left text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors">
                    <User size={18} />
                    Mon profil 
                  </button>
                  <button className="w-full px-4 py-2.5 text-left text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors">
                    <Settings size={18} />
                    Paramètres
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search - Shows below header on small screens */}
      <div className="sm:hidden mt-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl
              bg-gray-100 dark:bg-slate-800 
              border border-transparent
              focus:border-primary-500 dark:focus:border-primary-400
              text-gray-700 dark:text-gray-200
              placeholder-gray-400 dark:placeholder-slate-500
              outline-none transition-all duration-200"
          />
        </div>
      </div>
    </header>
  );
}
