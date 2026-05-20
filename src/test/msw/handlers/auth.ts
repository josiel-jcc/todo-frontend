import { http, HttpResponse } from 'msw';
import { getE2eUser, getStore } from '../store';

const api = '/api/v1';

export const authHandlers = [
  http.post(`${api}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { username?: string; password?: string };
    const user = getE2eUser();

    if (body.username === 'invalid' || body.password === 'wrong') {
      return HttpResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    return HttpResponse.json({
      token: 'e2e-mock-token',
      user,
    });
  }),

  http.post(`${api}/auth/register`, async ({ request }) => {
    const body = (await request.json()) as {
      username?: string;
      email?: string;
      password?: string;
    };
    const store = getStore();
    const now = new Date().toISOString();
    const newUser = {
      id: store.users.length + 1,
      username: body.username ?? 'newuser',
      email: body.email ?? 'new@test.com',
      notifications_enabled: false,
      telegram_chat_id: '',
      created_at: now,
      updated_at: now,
    };
    store.users.push(newUser);

    return HttpResponse.json(
      {
        token: 'e2e-mock-token',
        user: newUser,
      },
      { status: 201 }
    );
  }),

  http.post(`${api}/auth/logout`, () => {
    return HttpResponse.json({ message: 'ok' });
  }),
];
