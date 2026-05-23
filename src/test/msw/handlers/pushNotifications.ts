import { HttpResponse, http } from 'msw';
import { getE2eUser, getStore } from '../store';

const api = '/api/v1';

const ALLOWED_MINUTES = [5, 10, 15, 30, 60];

export const pushNotificationHandlers = [
  http.get(`${api}/notifications/push/vapid-public-key`, () => {
    return HttpResponse.json({ public_key: 'mock-vapid-public-key' });
  }),

  http.post(`${api}/notifications/push/subscribe`, async () => {
    getStore().pushSubscribed = true;
    return HttpResponse.json({ message: 'Push subscription saved' });
  }),

  http.delete(`${api}/notifications/push/subscribe`, async () => {
    getStore().pushSubscribed = false;
    return HttpResponse.json({ message: 'Push subscription removed' });
  }),

  http.put(`${api}/users/reminder-settings`, async ({ request }) => {
    const body = (await request.json()) as { reminder_minutes_before?: number };
    const minutes = body.reminder_minutes_before;
    if (minutes === undefined || !ALLOWED_MINUTES.includes(minutes)) {
      return HttpResponse.json(
        { error: 'invalid', message: 'reminder_minutes_before must be one of: 5, 10, 15, 30, 60' },
        { status: 400 }
      );
    }
    const user = getE2eUser();
    user.reminder_minutes_before = minutes;
    return HttpResponse.json({ message: 'ok' });
  }),
];
