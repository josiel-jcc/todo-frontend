import { apiClient } from './apiClient';

export type GroupListItem = {
  id: number;
  name: string;
  is_default: boolean;
  member_count: number;
  created_by: number;
};

export type UserPublic = {
  id: number;
  username: string;
  created_at?: string;
  updated_at?: string;
};

export type GroupInvitation = {
  id: number;
  group_id: number;
  invited_user_id: number;
  invited_by_user_id: number;
  status: string;
  created_at?: string;
  group?: { id: number; name: string };
  invited_user?: UserPublic;
  invited_by_user?: UserPublic;
};

export type GroupDetail = {
  id: number;
  name: string;
  is_default: boolean;
  created_by: number;
  members: UserPublic[];
  pending_invitations: GroupInvitation[];
};

export const getGroups = async (): Promise<GroupListItem[]> => {
  const response = await apiClient.get<GroupListItem[]>('/groups');
  return response.data;
};

export const createGroup = async (name: string): Promise<{ id: number; name: string }> => {
  const response = await apiClient.post('/groups', { name });
  return response.data;
};

export const getGroup = async (id: number): Promise<GroupDetail> => {
  const response = await apiClient.get<GroupDetail>(`/groups/${id}`);
  return response.data;
};

export const updateGroup = async (
  id: number,
  name: string
): Promise<{ id: number; name: string }> => {
  const response = await apiClient.put(`/groups/${id}`, { name });
  return response.data;
};

export const deleteGroup = async (id: number): Promise<void> => {
  await apiClient.delete(`/groups/${id}`);
};

export const sendGroupInvitation = async (
  groupId: number,
  userId: number
): Promise<GroupInvitation> => {
  const response = await apiClient.post<GroupInvitation>(`/groups/${groupId}/invitations`, {
    user_id: userId,
  });
  return response.data;
};

export const cancelGroupInvitation = async (
  groupId: number,
  invitationId: number
): Promise<void> => {
  await apiClient.delete(`/groups/${groupId}/invitations/${invitationId}`);
};

export const removeGroupMember = async (groupId: number, userId: number): Promise<void> => {
  await apiClient.delete(`/groups/${groupId}/members/${userId}`);
};
