import { apiClient } from './apiClient';

export type TaskStatsBucket = {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completion_rate: number;
};

export type TaskStatsToday = {
  total: number;
  completed: number;
  pending: number;
  completion_rate: number;
};

export type TaskStatsByType = {
  type: 'casa' | 'trabalho' | 'lazer' | 'saude';
  total: number;
  completed: number;
  pending: number;
  completion_rate: number;
};

export type TaskStatsByPriority = {
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
  total: number;
  completed: number;
  pending: number;
  completion_rate: number;
};

export type UserTaskStats = {
  summary: TaskStatsBucket;
  today: TaskStatsToday;
  by_type: TaskStatsByType[];
  by_priority: TaskStatsByPriority[];
  in_progress: number;
};

export type TaskStatsQueryParams = {
  hide_stale_completed?: boolean;
};

export const getTaskStats = async (params?: TaskStatsQueryParams): Promise<UserTaskStats> => {
  const response = await apiClient.get<UserTaskStats>('/stats', { params });
  return response.data;
};
