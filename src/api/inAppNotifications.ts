import { apiClient } from './apiClient';

export type UserNotification = {
  id: number;
  user_id: number;
  type: string;
  payload: string;
  read: boolean;
  read_at?: string;
  created_at: string;
};

export type GroupInvitePayload = {
  invitation_id: number;
  group_id: number;
  group_name: string;
  invited_by_username: string;
};

export type TaskReminderPayload = {
  task_id: number;
  title: string;
  due_date: string;
  minutes_before: number;
};

export type PaginatedNotificationsResponse = {
  notifications: UserNotification[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
};

export const getInAppNotifications = async (params?: {
  page?: number;
  limit?: number;
  unread_only?: boolean;
  active_only?: boolean;
}): Promise<PaginatedNotificationsResponse> => {
  const response = await apiClient.get<PaginatedNotificationsResponse>('/notifications/in-app', {
    params,
  });
  return response.data;
};

export const getUnreadNotificationCount = async (): Promise<number> => {
  const response = await apiClient.get<{ count: number }>('/notifications/in-app/unread-count');
  return response.data.count;
};

export const markNotificationRead = async (id: number): Promise<void> => {
  await apiClient.patch(`/notifications/in-app/${id}/read`);
};

export const markAllNotificationsRead = async (): Promise<void> => {
  await apiClient.post('/notifications/in-app/read-all');
};

export function parseGroupInvitePayload(payload: string): GroupInvitePayload | null {
  try {
    return JSON.parse(payload) as GroupInvitePayload;
  } catch {
    return null;
  }
}

export function parseTaskReminderPayload(payload: string): TaskReminderPayload | null {
  try {
    const data = JSON.parse(payload) as TaskReminderPayload;
    if (typeof data.task_id !== 'number' || !data.title) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}
