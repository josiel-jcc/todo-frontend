import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { navigateTo } from '@/lib/navigation';
import {
  getAuthToken,
  getStoredUser,
  removeAuthToken,
  setAuthToken,
  setStoredUser,
} from './storage';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api-todo.infoos.shop/api/v1';

export { getAuthToken, getStoredUser, removeAuthToken, setAuthToken, setStoredUser };

const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 30000,
    withCredentials: true,
  });

  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getAuthToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        removeAuthToken();
        if (window.location.pathname !== '/login') {
          navigateTo('/login');
        }
      }
      return Promise.reject(error);
    }
  );

  return client;
};

export const apiClient = createApiClient();
export { API_BASE_URL };
