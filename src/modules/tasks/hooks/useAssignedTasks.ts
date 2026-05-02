import { useQuery } from '@tanstack/react-query';
import type { components } from '@/api';
import { getAssignedTasks, type TaskListQueryParams } from '@/api/tasks';

type PaginatedTasksResponse = components['schemas']['services.PaginatedTasksResponse'];

/** Query parameters for GET /tasks/assigned (same filters as the main task list). */
export type AssignedTasksQueryParams = TaskListQueryParams;

/**
 * Hook for managing tasks assigned by the authenticated user to other users
 * Provides query for fetching tasks that were created/assigned by the user
 */
export const useAssignedTasks = (params?: AssignedTasksQueryParams) => {
  // Query to get paginated assigned tasks
  const tasksQuery = useQuery<PaginatedTasksResponse, Error>({
    queryKey: ['tasks', 'assigned', params],
    queryFn: () => getAssignedTasks(params),
  });

  return {
    // Queries
    tasks: tasksQuery.data?.tasks ?? [],
    pagination: tasksQuery.data
      ? {
          page: tasksQuery.data.page,
          limit: tasksQuery.data.limit,
          total: tasksQuery.data.total,
          totalPages: tasksQuery.data.total_pages,
        }
      : undefined,
    isLoadingTasks: tasksQuery.isLoading,
    tasksError: tasksQuery.error,
  };
};
