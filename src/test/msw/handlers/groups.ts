import { HttpResponse, http } from 'msw';
import { getE2eUser, getStore } from '../store';

const api = '/api/v1';

export const groupHandlers = [
  http.get(`${api}/groups`, () => {
    const store = getStore();
    return HttpResponse.json(store.groups ?? []);
  }),

  http.get(`${api}/group-invitations`, () => {
    const store = getStore();
    return HttpResponse.json(store.groupInvitations ?? []);
  }),

  http.post(`${api}/groups/:id/invitations`, async ({ params, request }) => {
    const store = getStore();
    const groupId = Number(params.id);
    const body = (await request.json()) as { user_id: number };
    const inv = {
      id: store.nextInvitationId ?? 1,
      group_id: groupId,
      invited_user_id: body.user_id,
      invited_by_user_id: getE2eUser().id,
      status: 'pending',
      group: store.groups?.find((g) => g.id === groupId),
    };
    store.nextInvitationId = (store.nextInvitationId ?? 1) + 1;
    store.groupInvitations = [...(store.groupInvitations ?? []), inv];
    return HttpResponse.json(inv, { status: 201 });
  }),

  http.post(`${api}/group-invitations/:id/accept`, ({ params }) => {
    const store = getStore();
    const id = Number(params.id);
    store.groupInvitations = (store.groupInvitations ?? []).filter((i) => i.id !== id);
    return HttpResponse.json({ message: 'Invitation accepted' });
  }),

  http.post(`${api}/group-invitations/:id/decline`, ({ params }) => {
    const store = getStore();
    const id = Number(params.id);
    store.groupInvitations = (store.groupInvitations ?? []).filter((i) => i.id !== id);
    return HttpResponse.json({ message: 'Invitation declined' });
  }),

  http.post(`${api}/groups`, async ({ request }) => {
    const store = getStore();
    const body = (await request.json()) as { name: string };
    const group = {
      id: (store.groups?.length ?? 0) + 10,
      name: body.name,
      is_default: false,
      member_count: 1,
      created_by: getE2eUser().id,
    };
    store.groups = [...(store.groups ?? []), group];
    return HttpResponse.json({ id: group.id, name: group.name }, { status: 201 });
  }),

  http.get(`${api}/notifications/in-app/unread-count`, () => {
    return HttpResponse.json({ count: 0 });
  }),

  http.get(`${api}/notifications/in-app`, () => {
    return HttpResponse.json({
      notifications: [],
      total: 0,
      page: 1,
      limit: 20,
      total_pages: 1,
    });
  }),

  http.patch(`${api}/notifications/in-app/:id/read`, () => {
    return HttpResponse.json({ message: 'Notification marked as read' });
  }),

  http.post(`${api}/notifications/in-app/read-all`, () => {
    return HttpResponse.json({ message: 'All notifications marked as read' });
  }),

  http.get(`${api}/groups/:id`, ({ params }) => {
    const id = Number(params.id);
    const store = getStore();
    const group = store.groups?.find((g) => g.id === id);
    if (!group) {
      return HttpResponse.json({ message: 'not found' }, { status: 404 });
    }
    const e2e = getE2eUser();
    return HttpResponse.json({
      ...group,
      members: [{ id: e2e.id, username: e2e.username }],
      pending_invitations: [],
    });
  }),
];
