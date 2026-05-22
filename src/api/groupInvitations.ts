import { apiClient } from './apiClient';
import type { GroupInvitation } from './groups';

export const getMyInvitations = async (): Promise<GroupInvitation[]> => {
  const response = await apiClient.get<GroupInvitation[]>('/group-invitations');
  return response.data;
};

export const acceptInvitation = async (id: number): Promise<void> => {
  await apiClient.post(`/group-invitations/${id}/accept`);
};

export const declineInvitation = async (id: number): Promise<void> => {
  await apiClient.post(`/group-invitations/${id}/decline`);
};
