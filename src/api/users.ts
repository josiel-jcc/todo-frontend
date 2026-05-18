import { apiClient } from './apiClient';
import type { components } from './types';

type User = components['schemas']['models.User'];

export type UsersQueryParams = {
  page?: number;
  limit?: number;
};

export type PaginatedUsersResponse = {
  users: Array<Pick<User, 'id' | 'username' | 'created_at' | 'updated_at'>>;
  total: number;
  page: number;
  limit: number;
  total_pages: number;
};

export const getUsers = async (params?: UsersQueryParams): Promise<PaginatedUsersResponse> => {
  const response = await apiClient.get<PaginatedUsersResponse>('/users', { params });
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<User>('/users/me');
  return response.data;
};

export const exportAccountData = async (): Promise<Record<string, unknown>> => {
  const response = await apiClient.get<Record<string, unknown>>('/users/me/export');
  return response.data;
};

export const deleteAccount = async (password: string): Promise<void> => {
  await apiClient.delete('/users/me', { data: { password } });
};

export const updateTelegramChatID = async (data: {
  telegram_chat_id?: string | null;
}): Promise<void> => {
  await apiClient.put('/users/telegram-chat-id', data);
};

export const updateNotificationsEnabled = async (data: {
  notifications_enabled: boolean;
}): Promise<void> => {
  await apiClient.put('/users/notifications-enabled', data);
};
