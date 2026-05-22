import { useQuery } from '@tanstack/react-query';
import type { components } from '@/api';
import { getUsers } from '@/api/users';

type PaginatedUsersResponse = components['schemas']['handlers.PaginatedUsersResponse'];

/**
 * Hook for fetching users list
 * Provides query for getting paginated list of users
 */
export const useUsers = (params?: {
  page?: number;
  limit?: number;
  scope?: 'invite';
  group_id?: number;
}) => {
  const usersQuery = useQuery<PaginatedUsersResponse, Error>({
    queryKey: ['users', params],
    queryFn: () => getUsers(params),
  });

  return {
    users: usersQuery.data?.users ?? [],
    pagination: usersQuery.data
      ? {
          page: usersQuery.data.page,
          limit: usersQuery.data.limit,
          total: usersQuery.data.total,
          totalPages: usersQuery.data.total_pages,
        }
      : undefined,
    isLoadingUsers: usersQuery.isLoading,
    usersError: usersQuery.error,
  };
};
