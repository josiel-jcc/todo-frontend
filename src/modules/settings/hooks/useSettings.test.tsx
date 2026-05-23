import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as usersApi from '@/api/users';
import { createTestQueryClient } from '@/test/utils';
import { useSettings } from './useSettings';

vi.mock('@/api/users', () => ({
  getCurrentUser: vi.fn(),
  updateNotificationsEnabled: vi.fn(),
  updateReminderSettings: vi.fn(),
  updateTelegramChatID: vi.fn(),
  exportAccountData: vi.fn(),
  deleteAccount: vi.fn(),
}));

describe('useSettings', () => {
  let queryClient: ReturnType<typeof createTestQueryClient>;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.clearAllMocks();
    vi.mocked(usersApi.getCurrentUser).mockResolvedValue({
      id: 1,
      username: 'user',
      email: 'u@test.com',
      notifications_enabled: true,
      reminder_minutes_before: 10,
      telegram_chat_id: '',
      created_at: '',
      updated_at: '',
    } as never);
    queryClient.setQueryData(['auth', 'user'], {
      id: 1,
      username: 'user',
      email: 'u@test.com',
      notifications_enabled: true,
      reminder_minutes_before: 10,
      telegram_chat_id: '',
      created_at: '',
      updated_at: '',
    });
  });

  afterEach(() => {
    queryClient.clear();
  });

  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('updates reminder minutes optimistically', async () => {
    vi.mocked(usersApi.updateReminderSettings).mockResolvedValue(undefined as never);

    const { result } = renderHook(() => useSettings(), { wrapper });

    result.current.updateReminderMinutes(30);

    await waitFor(() => expect(usersApi.updateReminderSettings).toHaveBeenCalledWith({
      reminder_minutes_before: 30,
    }));

    await waitFor(() => {
      const user = queryClient.getQueryData<{ reminder_minutes_before: number }>(['auth', 'user']);
      expect(user?.reminder_minutes_before).toBe(30);
    });
  });
});
