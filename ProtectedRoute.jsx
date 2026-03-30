import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from './Spinner';

export default function ProtectedRoute() {
  const { user, initialized } = useAuth();
  const location = useLocation();

  if (!initialized) return <div className="flex justify-center items-center min-h-64"><Spinner /></div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return <Outlet />;
}
