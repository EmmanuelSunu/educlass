import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../data/auth/context';
import Loading from './Loading';
import { UserRole } from '../data/auth/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <Loading />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If user doesn't have required role, redirect to their dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const redirectPath = 
      user.role === 'admin' ? '/admin' : 
      user.role === 'teacher' ? '/user/l/dashboard' : 
      '/user/s/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  // If all checks pass, render the protected content
  return <>{children}</>;
} 