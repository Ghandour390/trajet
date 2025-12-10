import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserRole } from '../store/slices/authSlice';

/**
 * ProtectedRoute Component
 * Protects routes based on authentication and role
 */
export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  const location = useLocation();

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check (if roles specified)
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    if (userRole === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (userRole === 'chauffeur') {
      return <Navigate to="/chauffeur/dashboard" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}
