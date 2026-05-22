import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { acceptInvitation, declineInvitation, getMyInvitations } from '@/api/groupInvitations';

export const useGroupInvitations = () => {
  return useQuery({
    queryKey: ['group-invitations'],
    queryFn: getMyInvitations,
  });
};

export const useGroupInvitationMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['group-invitations'] });
    void queryClient.invalidateQueries({ queryKey: ['groups'] });
    void queryClient.invalidateQueries({ queryKey: ['users'] });
    void queryClient.invalidateQueries({ queryKey: ['notifications', 'in-app'] });
  };

  const acceptMutation = useMutation({
    mutationFn: acceptInvitation,
    onSuccess: invalidate,
  });

  const declineMutation = useMutation({
    mutationFn: declineInvitation,
    onSuccess: invalidate,
  });

  return { acceptMutation, declineMutation };
};
