import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/components/common/LoadingScreen';

interface Props { children: React.ReactNode; }

export const AdminRoute = ({ children }: Props) => {
  const { isAuthenticated, isInitialized, user } = useAuth();

  if (!isInitialized) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default AdminRoute;
