import { Outlet } from 'react-router-dom';

/**
 * AuthLayout Component
 * Layout for authentication pages (login, register)
 */
export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700">
      <Outlet />
    </div>
  );
}
