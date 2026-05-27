import { useQuery } from '@tanstack/react-query';
import { getTaskStats, type TaskStatsQueryParams } from '@/api/stats';

export const taskStatsQueryKey = (params?: TaskStatsQueryParams) =>
  ['taskStats', params?.hide_stale_completed ?? true] as const;

export const useTaskStats = (params?: TaskStatsQueryParams) => {
  const hideStale = params?.hide_stale_completed ?? true;

  const query = useQuery({
    queryKey: taskStatsQueryKey(params),
    queryFn: () => getTaskStats({ hide_stale_completed: hideStale }),
  });

  return {
    stats: query.data,
    isLoadingStats: query.isLoading,
    isErrorStats: query.isError,
    refetchStats: query.refetch,
  };
};
