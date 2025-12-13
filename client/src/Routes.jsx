import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserRole } from './store/slices/authSlice';

// Layouts
import { AuthLayout, AdminLayout, ChauffeurLayout } from './layouts';

// Protected Route
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminVehicles from './pages/admin/Vehicles';
import AdminTrips from './pages/admin/Trips';
import AdminMaintenance from './pages/admin/Maintenance';
import AdminReports from './pages/admin/Reports';
import AdminUsers from './pages/admin/Users';
import TripForm from './pages/admin/TripForm';
import TripView from './pages/admin/TripView';
import VehicleForm from './pages/admin/VehicleForm';
import MaintenanceForm from './pages/admin/MaintenanceForm';
import UserForm from './pages/admin/UserForm';

// Chauffeur Pages
import ChauffeurDashboard from './pages/chauffeur/Dashboard';
import MyTrips from './pages/chauffeur/MyTrips';
import TripDetails from './pages/chauffeur/TripDetails';
import Profile from './pages/chauffeur/Profile';

// Home Page
import Home from './pages/Home';

/**
 * AppRoutes Component
 * Main routing configuration with role-based access
 */
export default function AppRoutes() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);

  // Redirect authenticated users to their dashboard
  const getDefaultRedirect = () => {
    if (!isAuthenticated) return '/login';
    if (userRole === 'admin') return '/admin/dashboard';
    if (userRole === 'chauffeur') return '/chauffeur/dashboard';
    return '/login';
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={getDefaultRedirect()} replace />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to={getDefaultRedirect()} replace />
            ) : (
              <Register />
            )
          }
        />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="vehicles" element={<AdminVehicles />} />
        <Route path="vehicles/create" element={<VehicleForm />} />
        <Route path="vehicles/edit/:id" element={<VehicleForm />} />
        <Route path="trips" element={<AdminTrips />} />
        <Route path="trips/create" element={<TripForm />} />
        <Route path="trips/edit/:id" element={<TripForm />} />
        <Route path="trips/view/:id" element={<TripView />} />
        <Route path="maintenance" element={<AdminMaintenance />} />
        <Route path="maintenance/create" element={<MaintenanceForm />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="users/edit/:id" element={<UserForm />} />
      </Route>

      {/* Chauffeur Routes */}
      <Route
        path="/chauffeur"
        element={
          <ProtectedRoute allowedRoles={['chauffeur']}>
            <ChauffeurLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<ChauffeurDashboard />} />
        <Route path="my-trips" element={<MyTrips />} />
        <Route path="trips/:id" element={<TripDetails />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Catch all - 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
