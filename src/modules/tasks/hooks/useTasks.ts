import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { components } from '@/api';
import { createTask, deleteTask, getTasks, updateTask } from '@/api/tasks';

type Task = components['schemas']['models.Task'];
type CreateTaskRequest = components['schemas']['handlers.CreateTaskRequest'];
type UpdateTaskRequest = components['schemas']['handlers.UpdateTaskRequest'];

/**
 * Query parameters for fetching tasks
 */
export type TasksQueryParams = {
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
  priority?: components['schemas']['models.Priority'];
  tag_ids?: number[];
  sort_by?: 'created_at' | 'due_date' | 'title' | 'priority';
  order?: 'asc' | 'desc';
};

export type UseTasksOptions = {
  /** When false, skips the list query (mutations-only usage). Default true. */
  queryEnabled?: boolean;
};

/**
 * Hook for managing tasks
 * Provides queries and mutations for task CRUD operations
 */
export const useTasks = (params?: TasksQueryParams, options?: UseTasksOptions) => {
  const queryClient = useQueryClient();

  // Query to get paginated tasks
  const tasksQuery = useQuery({
    queryKey: ['tasks', params],
    queryFn: () => getTasks(params),
    enabled: options?.queryEnabled !== false,
  });

  // Create task mutation
  const createTaskMutation = useMutation<Task, Error, CreateTaskRequest>({
    mutationFn: (taskData) => createTask(taskData),
    onSuccess: () => {
      // Invalidate and refetch tasks list
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Update task mutation
  const updateTaskMutation = useMutation<Task, Error, { id: number; data: UpdateTaskRequest }>({
    mutationFn: ({ id, data }) => updateTask(id, data),
    onSuccess: (data) => {
      // Invalidate tasks list and update single task cache
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.setQueryData(['tasks', data.id], data);
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation<void, Error, number>({
    mutationFn: (id) => deleteTask(id),
    onSuccess: () => {
      // Invalidate and refetch tasks list
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Toggle task completion mutation (optimistic update)
  const toggleTaskCompletionMutation = useMutation<Task, Error, { task: Task; completed: boolean }>(
    {
      mutationFn: async ({ task, completed }) => {
        return updateTask(task.id, {
          title: task.title,
          description: task.description,
          type: task.type,
          priority: task.priority,
          due_date: task.due_date,
          completed,
          tag_ids: task.tags?.map((tag) => tag.id) ?? [],
        });
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        queryClient.setQueryData(['tasks', data.id], data);
      },
    }
  );

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

    // Mutations
    createTask: createTaskMutation.mutate,
    createTaskAsync: createTaskMutation.mutateAsync,
    isCreatingTask: createTaskMutation.isPending,
    createTaskError: createTaskMutation.error,

    updateTask: updateTaskMutation.mutate,
    updateTaskAsync: updateTaskMutation.mutateAsync,
    isUpdatingTask: updateTaskMutation.isPending,
    updateTaskError: updateTaskMutation.error,

    deleteTask: deleteTaskMutation.mutate,
    deleteTaskAsync: deleteTaskMutation.mutateAsync,
    isDeletingTask: deleteTaskMutation.isPending,
    deleteTaskError: deleteTaskMutation.error,

    toggleTaskCompletion: (task: Task, completed: boolean) =>
      toggleTaskCompletionMutation.mutate({ task, completed }),
    toggleTaskCompletionAsync: (task: Task, completed: boolean) =>
      toggleTaskCompletionMutation.mutateAsync({ task, completed }),
    isTogglingCompletion: toggleTaskCompletionMutation.isPending,
    toggleCompletionError: toggleTaskCompletionMutation.error,
  };
};
