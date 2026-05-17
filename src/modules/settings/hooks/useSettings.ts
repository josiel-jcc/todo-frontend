import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { components } from '@/api';
import { getStoredUser, mergeStoredUser, setStoredUser } from '@/api/storage';
import { getCurrentUser, updateNotificationsEnabled, updateTelegramChatID } from '@/api/users';

type User = components['schemas']['models.User'];
type UpdateNotificationsRequest =
  components['schemas']['handlers.UpdateNotificationsEnabledRequest'];
type UpdateTelegramRequest = components['schemas']['handlers.UpdateTelegramChatIDRequest'];
type SuccessResponse = components['schemas']['handlers.SuccessResponse'];

const syncUserToCache = (queryClient: ReturnType<typeof useQueryClient>, user: User): void => {
  setStoredUser(user);
  queryClient.setQueryData(['auth', 'user'], user);
};

/**
 * Hook for managing user settings
 */
export const useSettings = () => {
  const queryClient = useQueryClient();

  const { isLoading: isLoadingProfile } = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: async () => {
      const profile = await getCurrentUser();
      const stored = getStoredUser();

      if (stored) {
        const updated: User = { ...stored, ...profile };
        syncUserToCache(queryClient, updated);
        return updated;
      }

      return profile;
    },
  });

  const updateNotificationsMutation = useMutation<
    SuccessResponse,
    Error,
    UpdateNotificationsRequest,
    { previous: User | null | undefined }
  >({
    mutationFn: (data) => updateNotificationsEnabled(data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ['auth', 'user'] });
      const previous = queryClient.getQueryData<User | null>(['auth', 'user']);

      if (previous && data.notifications_enabled !== undefined) {
        const updated = { ...previous, notifications_enabled: data.notifications_enabled };
        syncUserToCache(queryClient, updated);
      }

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        syncUserToCache(queryClient, context.previous);
      }
    },
    onSuccess: (_data, variables) => {
      if (variables.notifications_enabled !== undefined) {
        mergeStoredUser({ notifications_enabled: variables.notifications_enabled });
        queryClient.setQueryData<User | null>(['auth', 'user'], (current) =>
          current ? { ...current, notifications_enabled: variables.notifications_enabled } : current
        );
      }
    },
  });

  const updateTelegramMutation = useMutation<SuccessResponse, Error, UpdateTelegramRequest>({
    mutationFn: (data) => updateTelegramChatID(data),
    onSuccess: (_data, variables) => {
      const chatId = variables.telegram_chat_id ?? '';
      mergeStoredUser({ telegram_chat_id: chatId });
      queryClient.setQueryData<User | null>(['auth', 'user'], (current) =>
        current ? { ...current, telegram_chat_id: chatId } : current
      );
    },
  });

  return {
    isLoadingProfile,

    // Notifications
    updateNotifications: updateNotificationsMutation.mutate,
    updateNotificationsAsync: updateNotificationsMutation.mutateAsync,
    isUpdatingNotifications: updateNotificationsMutation.isPending,
    updateNotificationsError: updateNotificationsMutation.error,

    // Telegram
    updateTelegramChatId: (data: { telegram_chat_id: string }) =>
      updateTelegramMutation.mutate({
        telegram_chat_id: data.telegram_chat_id,
      }),
    updateTelegramChatIdAsync: (data: { telegram_chat_id: string }) =>
      updateTelegramMutation.mutateAsync({
        telegram_chat_id: data.telegram_chat_id,
      }),
    isUpdatingTelegram: updateTelegramMutation.isPending,
    updateTelegramError: updateTelegramMutation.error,
  };
};
