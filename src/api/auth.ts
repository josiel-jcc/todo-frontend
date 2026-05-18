import { apiClient, getAuthToken, removeAuthToken, setAuthToken, setStoredUser } from './apiClient';
import type { components, paths } from './types';

type LoginRequest = components['schemas']['handlers.LoginRequest'];
type RegisterRequest = components['schemas']['handlers.RegisterRequest'];
type AuthResponse = components['schemas']['handlers.AuthResponse'];

export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<
    paths['/auth/login']['post']['responses']['200']['content']['application/json']
  >('/auth/login', credentials);

  const data = response.data;
  if (data.token) {
    setAuthToken(data.token);
  }
  if (data.user) {
    setStoredUser(data.user);
  }
  return data;
};

export const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<
    paths['/auth/register']['post']['responses']['201']['content']['application/json']
  >('/auth/register', userData);

  const data = response.data;
  if (data.token) {
    setAuthToken(data.token);
  }
  if (data.user) {
    setStoredUser(data.user);
  }
  return data;
};

export const logout = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/logout');
  } finally {
    removeAuthToken();
  }
};

export const isAuthenticated = (): boolean => {
  return getStoredUser() !== null || getAuthToken() !== null;
};
