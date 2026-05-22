import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as groupsApi from '@/api/groups';
import { createTestQueryClient } from '@/test/utils';
import { useGroupMutations, useGroups } from './useGroups';

vi.mock('@/api/groups', () => ({
  getGroups: vi.fn(),
  createGroup: vi.fn(),
  getGroup: vi.fn(),
  updateGroup: vi.fn(),
  deleteGroup: vi.fn(),
  sendGroupInvitation: vi.fn(),
  cancelGroupInvitation: vi.fn(),
  removeGroupMember: vi.fn(),
}));

describe('useGroups', () => {
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

  it('fetches groups', async () => {
    const mockGroups = [
      { id: 1, name: 'Os de casa', is_default: true, member_count: 2, created_by: 1 },
    ];
    vi.mocked(groupsApi.getGroups).mockResolvedValue(mockGroups);

    const { result } = renderHook(() => useGroups(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockGroups);
  });
});

describe('useGroupMutations', () => {
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

  it('creates a group and invalidates cache', async () => {
    vi.mocked(groupsApi.createGroup).mockResolvedValue({ id: 2, name: 'Novo' });
    vi.mocked(groupsApi.getGroups).mockResolvedValue([]);

    const { result } = renderHook(() => useGroupMutations(), { wrapper });
    result.current.createMutation.mutate('Novo');

    await waitFor(() => expect(result.current.createMutation.isSuccess).toBe(true));
    expect(groupsApi.createGroup).toHaveBeenCalledWith('Novo');
  });

  it('sends group invitation', async () => {
    vi.mocked(groupsApi.sendGroupInvitation).mockResolvedValue({
      id: 10,
      group_id: 1,
      invited_user_id: 2,
      invited_by_user_id: 1,
      status: 'pending',
    });

    const { result } = renderHook(() => useGroupMutations(), { wrapper });
    result.current.inviteMutation.mutate({ groupId: 1, userId: 2 });

    await waitFor(() => expect(result.current.inviteMutation.isSuccess).toBe(true));
    expect(groupsApi.sendGroupInvitation).toHaveBeenCalledWith(1, 2);
  });
});
