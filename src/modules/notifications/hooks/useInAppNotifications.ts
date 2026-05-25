import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getInAppNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/api/inAppNotifications';

export const useInAppNotifications = (options?: { unreadOnly?: boolean; activeOnly?: boolean }) => {
  const unreadOnly = options?.unreadOnly ?? false;
  const activeOnly = options?.activeOnly ?? false;
  return useQuery({
    queryKey: ['notifications', 'in-app', { unreadOnly, activeOnly }],
    queryFn: () =>
      getInAppNotifications({
        limit: 50,
        unread_only: unreadOnly || undefined,
        active_only: activeOnly || undefined,
      }),
    refetchInterval: 60_000,
  });
};

export const useUnreadNotificationCount = () => {
  return useQuery({
    queryKey: ['notifications', 'in-app', 'unread-count'],
    queryFn: getUnreadNotificationCount,
    refetchInterval: 60_000,
  });
};

export const useInAppNotificationMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['notifications', 'in-app'] });
    void queryClient.invalidateQueries({ queryKey: ['notifications', 'in-app', 'unread-count'] });
  };

  const markReadMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: invalidate,
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: invalidate,
  });

  return { markReadMutation, markAllReadMutation };
};
