import { useSelector } from 'react-redux';
import { Menu, Bell, User } from 'lucide-react';
import { selectUser } from '../../store/slices/authSlice';

/**
 * AdminHeader Component
 * Top header bar for admin panel
 */
export default function AdminHeader({ onMenuClick }) {
  const user = useSelector(selectUser);

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      {/* Menu Toggle */}
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
      >
        <Menu size={24} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md mx-4">
        <input
          type="text"
          placeholder="Rechercher..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white">
            <User size={20} />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">
              {user?.firstname} {user?.lastname}
            </p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
