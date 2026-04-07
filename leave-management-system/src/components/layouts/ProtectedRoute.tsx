import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '@/store';
import { type UserRole } from '@/store/slices/authSlice';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to their default dashboard if unauthorized for this route
    switch (user.role) {
      case 'Student': return <Navigate to="/student/dashboard" replace />;
      case 'Professor': return <Navigate to="/professor/dashboard" replace />;
      case 'HOD': return <Navigate to="/hod/dashboard" replace />;
      case 'Principal': return <Navigate to="/principal/dashboard" replace />;
      default: return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />;
}
