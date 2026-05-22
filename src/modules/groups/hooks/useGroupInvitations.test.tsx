import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as invitationsApi from '@/api/groupInvitations';
import { createTestQueryClient } from '@/test/utils';
import { useGroupInvitationMutations, useGroupInvitations } from './useGroupInvitations';

vi.mock('@/api/groupInvitations', () => ({
  getMyInvitations: vi.fn(),
  acceptInvitation: vi.fn(),
  declineInvitation: vi.fn(),
}));

describe('useGroupInvitations', () => {
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

  it('fetches pending invitations', async () => {
    const mockInvitations = [
      {
        id: 1,
        group_id: 2,
        invited_user_id: 1,
        invited_by_user_id: 3,
        status: 'pending',
        group: { id: 2, name: 'Equipe' },
      },
    ];
    vi.mocked(invitationsApi.getMyInvitations).mockResolvedValue(mockInvitations as never);

    const { result } = renderHook(() => useGroupInvitations(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockInvitations);
  });
});

describe('useGroupInvitationMutations', () => {
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

  it('accepts invitation', async () => {
    vi.mocked(invitationsApi.acceptInvitation).mockResolvedValue(undefined);

    const { result } = renderHook(() => useGroupInvitationMutations(), { wrapper });
    result.current.acceptMutation.mutate(5);

    await waitFor(() => expect(result.current.acceptMutation.isSuccess).toBe(true));
    expect(invitationsApi.acceptInvitation.mock.calls[0][0]).toBe(5);
  });

  it('declines invitation', async () => {
    vi.mocked(invitationsApi.declineInvitation).mockResolvedValue(undefined);

    const { result } = renderHook(() => useGroupInvitationMutations(), { wrapper });
    result.current.declineMutation.mutate(7);

    await waitFor(() => expect(result.current.declineMutation.isSuccess).toBe(true));
    expect(invitationsApi.declineInvitation.mock.calls[0][0]).toBe(7);
  });
});
