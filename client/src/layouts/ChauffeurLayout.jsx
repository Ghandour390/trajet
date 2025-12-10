import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DriverSidebar from '../components/chauffeur/DriverSidebar';
import DriverHeader from '../components/chauffeur/DriverHeader';

/**
 * ChauffeurLayout Component
 * Layout for driver/chauffeur pages with sidebar and header
 */
export default function ChauffeurLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <DriverSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <DriverHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
