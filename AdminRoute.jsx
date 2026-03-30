import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from './Spinner';

export default function AdminRoute() {
  const { user, initialized, isAdmin } = useAuth();

  if (!initialized) return <div className="flex justify-center items-center min-h-64"><Spinner /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
}
