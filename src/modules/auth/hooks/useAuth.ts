import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import type { components } from '@/api';
import { getStoredUser, isAuthenticated, login, logout, register } from '@/api';
import { useErrorHandler } from '@/hooks/useErrorHandler';

type LoginRequest = components['schemas']['handlers.LoginRequest'];
type RegisterRequest = components['schemas']['handlers.RegisterRequest'];
type AuthResponse = components['schemas']['handlers.AuthResponse'];
type User = components['schemas']['models.User'];

/**
 * Hook for user authentication
 * Provides login, register, logout mutations and user query
 */
export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { handleApiError } = useErrorHandler();

  // Track authentication state reactively
  const [authState, setAuthState] = useState(() => isAuthenticated());

  // Update auth state when storage changes (for cross-tab sync)
  useEffect(() => {
    const checkAuth = () => {
      setAuthState(isAuthenticated());
    };

    // Listen for storage changes (for cross-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_user') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Query to get current authenticated user
  const { data: user, isLoading: isLoadingUser } = useQuery<User | null>({
    queryKey: ['auth', 'user'],
    queryFn: () => {
      return getStoredUser();
    },
    enabled: authState,
    staleTime: Infinity, // User data doesn't change often
  });

  // Login mutation
  const loginMutation = useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: (credentials: LoginRequest) => login(credentials),
    onSuccess: (data: AuthResponse) => {
      // Update auth state
      setAuthState(true);
      // Update user query cache
      if (data.user) {
        queryClient.setQueryData(['auth', 'user'], data.user);
      }
      // Refetch user to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
      toast.success('Login realizado com sucesso!');
      // Navigate to tasks page
      navigate('/tasks');
    },
    onError: (error) => {
      handleApiError(error as unknown as Parameters<typeof handleApiError>[0]);
    },
  });

  // Register mutation
  const registerMutation = useMutation<AuthResponse, Error, RegisterRequest>({
    mutationFn: (userData: RegisterRequest) => register(userData),
    onSuccess: (data: AuthResponse) => {
      // Update auth state
      setAuthState(true);
      // Update user query cache
      if (data.user) {
        queryClient.setQueryData(['auth', 'user'], data.user);
      }
      // Refetch user to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
      toast.success('Conta criada com sucesso!');
      // Navigate to home page
      navigate('/tasks');
    },
    onError: (error) => {
      handleApiError(error as unknown as Parameters<typeof handleApiError>[0]);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      // Update auth state
      setAuthState(false);
      // Clear all queries
      queryClient.clear();
      // Remove user from cache
      queryClient.removeQueries({ queryKey: ['auth', 'user'] });
      // Navigate to login
      navigate('/login');
    },
  });

  return {
    user,
    isLoadingUser,
    isAuthenticated: authState,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
};

/**
 * Hook to check if user is authenticated
 */
export const useIsAuthenticated = () => {
  return useQuery({
    queryKey: ['auth', 'isAuthenticated'],
    queryFn: () => isAuthenticated(),
    staleTime: Infinity,
  });
};
