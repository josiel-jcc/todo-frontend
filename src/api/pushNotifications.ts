import { apiClient } from './apiClient';

export type VapidPublicKeyResponse = {
  public_key: string;
};

export type PushSubscribeRequest = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  user_agent?: string;
};

export type PushUnsubscribeRequest = {
  endpoint: string;
};

export const getVapidPublicKey = async (): Promise<string> => {
  const response = await apiClient.get<VapidPublicKeyResponse>(
    '/notifications/push/vapid-public-key'
  );
  return response.data.public_key;
};

export const subscribePush = async (data: PushSubscribeRequest): Promise<void> => {
  await apiClient.post('/notifications/push/subscribe', data);
};

export const unsubscribePush = async (data: PushUnsubscribeRequest): Promise<void> => {
  await apiClient.delete('/notifications/push/subscribe', { data });
};
