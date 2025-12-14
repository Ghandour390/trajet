import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Menu, Bell, User, Moon, Sun, ChevronDown, Settings } from 'lucide-react';
import { selectUser } from '../../store/slices/authSlice';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * DriverHeader Component
 * Top header bar for driver panel - Fully responsive with dark mode
 */
export default function DriverHeader({ onMenuClick }) {
  const user = useSelector(selectUser);
  const { isDark, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-slate-700/50 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Menu Toggle */}
          <button
            onClick={onMenuClick}
            className="p-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 
              text-gray-600 dark:text-gray-300 transition-all duration-200 hover:scale-105"
          >
            <Menu size={22} />
          </button>

          {/* Title */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Espace Chauffeur
            </h2>
            <p className="text-xs text-gray-500 dark:text-slate-400 hidden sm:block">
              Gérez vos trajets facilement
            </p>
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
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 
                text-gray-600 dark:text-gray-300 transition-all duration-200 hover:scale-105 relative"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden animate-fade-in">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
                  <h3 className="font-semibold text-gray-800 dark:text-white">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer border-l-4 border-secondary-500">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Nouveau trajet assigné</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Casablanca → Rabat</p>
                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">Il y a 5 minutes</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Rappel de départ</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Départ dans 30 minutes</p>
                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">Il y a 1 heure</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 sm:pr-3 rounded-xl 
                bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 
                transition-all duration-200"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-secondary-500 to-secondary-700 
                flex items-center justify-center text-white font-semibold shadow-lg">
                {user?.firstname?.[0]}{user?.lastname?.[0]}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-gray-800 dark:text-white leading-tight">
                  {user?.firstname} {user?.lastname}
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400">Chauffeur</p>
              </div>
              <ChevronDown size={16} className="hidden sm:block text-gray-400 dark:text-slate-500" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden animate-fade-in">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
                  <p className="font-semibold text-gray-800 dark:text-white">{user?.firstname} {user?.lastname}</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">{user?.email}</p>
                </div>
                <div className="py-2">
                  <button className="w-full px-4 py-2.5 text-left text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors">
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
    </header>
  );
}
