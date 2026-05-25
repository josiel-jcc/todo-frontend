import { apiClient } from './apiClient';
import type { components, paths } from './types';

/**
 * Tasks API Service
 * Handles task-related API calls
 */

// Type definitions
type Task = components['schemas']['models.Task'];
type CreateTaskRequest = components['schemas']['handlers.CreateTaskRequest'];
type UpdateTaskRequest = components['schemas']['handlers.UpdateTaskRequest'];
type PaginatedTasksResponse = components['schemas']['services.PaginatedTasksResponse'];
type ShareTaskRequest = components['schemas']['handlers.ShareTaskRequest'];
type Priority = components['schemas']['models.Priority'];

/** Query params for GET /tasks and GET /tasks/assigned (matches server filters). */
export type TaskListQueryParams = {
  page?: number;
  limit?: number;
  type?: 'casa' | 'trabalho' | 'lazer' | 'saude';
  completed?: boolean;
  hide_stale_completed?: boolean;
  search?: string;
  due_date_from?: string;
  due_date_to?: string;
  period?: 'overdue' | 'today' | 'this_week' | 'this_month';
  assigned_by?: number;
  priority?: Priority;
  /** Sent as comma-separated IDs (`1,2`) as required by the API. */
  tag_ids?: number[];
  sort_by?: 'created_at' | 'due_date' | 'title' | 'priority';
  order?: 'asc' | 'desc';
};

function buildTaskListParams(params?: TaskListQueryParams): Record<string, unknown> | undefined {
  if (!params) {
    return undefined;
  }
  const { tag_ids, ...rest } = params;
  const out: Record<string, unknown> = { ...rest };
  if (tag_ids?.length) {
    out.tag_ids = tag_ids.join(',');
  }
  return out;
}

/**
 * Get all tasks with pagination and filters
 * @param params - Query parameters
 * @returns Paginated tasks response
 */
export const getTasks = async (params?: TaskListQueryParams): Promise<PaginatedTasksResponse> => {
  const response = await apiClient.get<
    paths['/tasks']['get']['responses']['200']['content']['application/json']
  >('/tasks', { params: buildTaskListParams(params) });

  return response.data;
};

/**
 * Get a single task by ID
 * @param id - Task ID
 * @returns Task data
 */
export const getTask = async (id: number): Promise<Task> => {
  const response = await apiClient.get<
    paths['/tasks/{id}']['get']['responses']['200']['content']['application/json']
  >(`/tasks/${id}`);

  return response.data;
};

/**
 * Create a new task
 * @param taskData - Task creation data
 * @returns Created task
 */
export const createTask = async (taskData: CreateTaskRequest): Promise<Task> => {
  const response = await apiClient.post<
    paths['/tasks']['post']['responses']['201']['content']['application/json']
  >('/tasks', taskData);

  return response.data;
};

/**
 * Update a task
 * @param id - Task ID
 * @param taskData - Task update data
 * @returns Updated task
 */
export const updateTask = async (id: number, taskData: UpdateTaskRequest): Promise<Task> => {
  const response = await apiClient.put<
    paths['/tasks/{id}']['put']['responses']['200']['content']['application/json']
  >(`/tasks/${id}`, taskData);

  return response.data;
};

/**
 * Get tasks assigned by the authenticated user to other users
 * @param params - Query parameters
 * @returns Paginated tasks response
 */
export const getAssignedTasks = async (
  params?: TaskListQueryParams
): Promise<PaginatedTasksResponse> => {
  const response = await apiClient.get<
    paths['/tasks/assigned']['get']['responses']['200']['content']['application/json']
  >('/tasks/assigned', { params: buildTaskListParams(params) });

  return response.data;
};

/**
 * Share a task with additional users (task owner only).
 */
export const shareTask = async (taskId: number, body: ShareTaskRequest): Promise<void> => {
  await apiClient.post<
    paths['/tasks/{id}/share']['post']['responses']['200']['content']['application/json']
  >(`/tasks/${taskId}/share`, body);
};

/**
 * Remove a user from the task share list (task owner only).
 */
export const unshareTask = async (taskId: number, sharedUserId: number): Promise<void> => {
  await apiClient.delete(`/tasks/${taskId}/share/${sharedUserId}`);
};

/**
 * Delete a task
 * @param id - Task ID
 * @returns Success response
 */
export const deleteTask = async (id: number): Promise<void> => {
  await apiClient.delete(`/tasks/${id}`);
};
