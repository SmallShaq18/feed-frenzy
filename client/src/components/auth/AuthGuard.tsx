import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import type { User } from '../../types/auth';

interface AuthGuardProps {
  requiredRole?: User['role'];
}

/**
 * Wraps protected routes.
 * If unauthenticated → redirect to /login.
 * If wrong role → redirect to /.
 * Otherwise → render the child route via <Outlet />.
 */
export default function AuthGuard({ requiredRole }: AuthGuardProps) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}