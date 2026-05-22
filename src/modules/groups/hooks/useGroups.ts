import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  cancelGroupInvitation,
  createGroup,
  deleteGroup,
  getGroup,
  getGroups,
  removeGroupMember,
  sendGroupInvitation,
  updateGroup,
} from '@/api/groups';

export const useGroups = () => {
  return useQuery({
    queryKey: ['groups'],
    queryFn: getGroups,
  });
};

export const useGroup = (id: number) => {
  return useQuery({
    queryKey: ['groups', id],
    queryFn: () => getGroup(id),
    enabled: id > 0,
  });
};

export const useGroupMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['groups'] });
    void queryClient.invalidateQueries({ queryKey: ['users'] });
  };

  const createMutation = useMutation({
    mutationFn: (name: string) => createGroup(name),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) => updateGroup(id, name),
    onSuccess: (_, { id }) => {
      invalidate();
      void queryClient.invalidateQueries({ queryKey: ['groups', id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteGroup(id),
    onSuccess: invalidate,
  });

  const inviteMutation = useMutation({
    mutationFn: ({ groupId, userId }: { groupId: number; userId: number }) =>
      sendGroupInvitation(groupId, userId),
    onSuccess: (_, { groupId }) => {
      void queryClient.invalidateQueries({ queryKey: ['groups', groupId] });
      void queryClient.invalidateQueries({ queryKey: ['notifications', 'in-app'] });
    },
  });

  const cancelInviteMutation = useMutation({
    mutationFn: ({ groupId, invitationId }: { groupId: number; invitationId: number }) =>
      cancelGroupInvitation(groupId, invitationId),
    onSuccess: (_, { groupId }) => {
      void queryClient.invalidateQueries({ queryKey: ['groups', groupId] });
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: ({ groupId, userId }: { groupId: number; userId: number }) =>
      removeGroupMember(groupId, userId),
    onSuccess: (_, { groupId }) => {
      invalidate();
      void queryClient.invalidateQueries({ queryKey: ['groups', groupId] });
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    inviteMutation,
    cancelInviteMutation,
    removeMemberMutation,
  };
};
