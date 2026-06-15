import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { initAuth, loginUser, registerUser, logoutUser, clearError, forceLogout } from '@/store/slices/authSlice';
import type { LoginCredentials, RegisterData } from '@/types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, isInitialized, error } = useAppSelector((s) => s.auth);

  useEffect(() => {
    const handleForceLogout = () => dispatch(forceLogout());
    window.addEventListener('auth:logout', handleForceLogout);
    return () => window.removeEventListener('auth:logout', handleForceLogout);
  }, [dispatch]);

  const init = useCallback(() => dispatch(initAuth()), [dispatch]);
  const login = useCallback((credentials: LoginCredentials) => dispatch(loginUser(credentials)), [dispatch]);
  const register = useCallback((data: RegisterData) => dispatch(registerUser(data)), [dispatch]);
  const logout = useCallback(() => dispatch(logoutUser()), [dispatch]);
  const clearAuthError = useCallback(() => dispatch(clearError()), [dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    error,
    isAdmin: user?.role === 'admin',
    isStaff: user?.role === 'staff' || user?.role === 'admin',
    isCustomer: user?.role === 'customer',
    init,
    login,
    register,
    logout,
    clearError: clearAuthError,
  };
};
