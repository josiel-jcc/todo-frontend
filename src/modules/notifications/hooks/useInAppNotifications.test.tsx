import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as notificationsApi from '@/api/inAppNotifications';
import { createTestQueryClient } from '@/test/utils';
import { useInAppNotifications, useUnreadNotificationCount } from './useInAppNotifications';

vi.mock('@/api/inAppNotifications', () => ({
  getInAppNotifications: vi.fn(),
  getUnreadNotificationCount: vi.fn(),
  markNotificationRead: vi.fn(),
  markAllNotificationsRead: vi.fn(),
}));

describe('useInAppNotifications', () => {
  let queryClient: ReturnType<typeof createTestQueryClient>;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.clearAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
  });

  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('fetches notifications', async () => {
    const mockResponse = {
      notifications: [
        {
          id: 1,
          user_id: 1,
          type: 'group_invite',
          payload:
            '{"invitation_id":1,"group_id":2,"group_name":"Equipe","invited_by_username":"alice"}',
          read: false,
          created_at: '2024-01-01T00:00:00Z',
        },
      ],
      total: 1,
      page: 1,
      limit: 50,
      total_pages: 1,
    };
    vi.mocked(notificationsApi.getInAppNotifications).mockResolvedValue(mockResponse as never);

    const { result } = renderHook(() => useInAppNotifications(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.notifications).toHaveLength(1);
  });
});

describe('useUnreadNotificationCount', () => {
  let queryClient: ReturnType<typeof createTestQueryClient>;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.clearAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
  });

  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('fetches unread count', async () => {
    vi.mocked(notificationsApi.getUnreadNotificationCount).mockResolvedValue({ count: 3 });

    const { result } = renderHook(() => useUnreadNotificationCount(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.count).toBe(3);
  });
});
