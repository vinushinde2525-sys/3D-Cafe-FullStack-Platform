import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/components/common/LoadingScreen';

interface Props { children: React.ReactNode; }

export const StaffRoute = ({ children }: Props) => {
  const { isAuthenticated, isInitialized, user } = useAuth();

  if (!isInitialized) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!['admin', 'staff'].includes(user?.role ?? '')) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default StaffRoute;
