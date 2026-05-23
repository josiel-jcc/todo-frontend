import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { components } from '@/api';
import { getStoredUser, mergeStoredUser, setStoredUser } from '@/api/storage';
import {
  deleteAccount,
  exportAccountData,
  getCurrentUser,
  updateNotificationsEnabled,
  updateReminderSettings,
  updateTelegramChatID,
} from '@/api/users';
import { DEFAULT_REMINDER_MINUTES } from '@/lib/reminderConstants';

type User = components['schemas']['models.User'];
type UpdateNotificationsRequest =
  components['schemas']['handlers.UpdateNotificationsEnabledRequest'];
type UpdateTelegramRequest = components['schemas']['handlers.UpdateTelegramChatIDRequest'];
type SuccessResponse = components['schemas']['handlers.SuccessResponse'];

const syncUserToCache = (queryClient: ReturnType<typeof useQueryClient>, user: User): void => {
  setStoredUser(user);
  queryClient.setQueryData(['auth', 'user'], user);
};

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

  const updateReminderMutation = useMutation<
    SuccessResponse,
    Error,
    { reminder_minutes_before: number },
    { previous: User | null | undefined }
  >({
    mutationFn: (data) => updateReminderSettings(data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ['auth', 'user'] });
      const previous = queryClient.getQueryData<User | null>(['auth', 'user']);

      if (previous) {
        const updated = {
          ...previous,
          reminder_minutes_before: data.reminder_minutes_before,
        };
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
      mergeStoredUser({ reminder_minutes_before: variables.reminder_minutes_before });
      queryClient.setQueryData<User | null>(['auth', 'user'], (current) =>
        current
          ? { ...current, reminder_minutes_before: variables.reminder_minutes_before }
          : current
      );
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

  const exportDataMutation = useMutation({
    mutationFn: exportAccountData,
    onSuccess: (data) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `meus-dados-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: (password: string) => deleteAccount(password),
  });

  return {
    isLoadingProfile,
    updateNotifications: updateNotificationsMutation.mutate,
    isUpdatingNotifications: updateNotificationsMutation.isPending,
    updateReminderMinutes: (minutes: number) =>
      updateReminderMutation.mutate({ reminder_minutes_before: minutes }),
    isUpdatingReminder: updateReminderMutation.isPending,
    defaultReminderMinutes:
      queryClient.getQueryData<User | null>(['auth', 'user'])?.reminder_minutes_before ??
      DEFAULT_REMINDER_MINUTES,
    updateTelegramChatId: (data: { telegram_chat_id: string }) =>
      updateTelegramMutation.mutate({ telegram_chat_id: data.telegram_chat_id }),
    isUpdatingTelegram: updateTelegramMutation.isPending,
    exportData: exportDataMutation.mutate,
    isExportingData: exportDataMutation.isPending,
    deleteAccount: deleteAccountMutation.mutateAsync,
    isDeletingAccount: deleteAccountMutation.isPending,
  };
};
