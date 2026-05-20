import { HttpResponse, http } from 'msw';
import { getE2eUser, getStore } from '../store';

const api = '/api/v1';

export const userHandlers = [
  http.get(`${api}/users`, ({ request }) => {
    const url = new URL(request.url);
    const store = getStore();
    const e2eUser = getE2eUser();
    const limit = Number(url.searchParams.get('limit') ?? 100);
    const users = store.users.filter((u) => u.id !== e2eUser.id).slice(0, limit);
    return HttpResponse.json({
      users,
      page: 1,
      limit,
      total: users.length,
      total_pages: 1,
    });
  }),

  http.get(`${api}/users/me`, () => {
    return HttpResponse.json(getE2eUser());
  }),

  http.put(`${api}/users/notifications-enabled`, async ({ request }) => {
    const body = (await request.json()) as { notifications_enabled?: boolean };
    const user = getE2eUser();
    user.notifications_enabled = Boolean(body.notifications_enabled);
    return HttpResponse.json(user);
  }),

  http.put(`${api}/users/telegram-chat-id`, async ({ request }) => {
    const body = (await request.json()) as { telegram_chat_id?: string };
    const user = getE2eUser();
    user.telegram_chat_id = body.telegram_chat_id ?? '';
    return HttpResponse.json(user);
  }),
];
