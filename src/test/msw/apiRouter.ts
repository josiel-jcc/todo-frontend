import type { MockStore, MockTask } from './store';
import { getE2eUser } from './store';

export type ApiResponse = {
  status: number;
  body: unknown;
};

function filterTasks(tasks: MockTask[], searchParams: URLSearchParams): MockTask[] {
  let result = [...tasks];

  const completed = searchParams.get('completed');
  if (completed === 'true') {
    result = result.filter((t) => t.completed);
  } else if (completed === 'false') {
    result = result.filter((t) => !t.completed);
  }

  const search = searchParams.get('search');
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    );
  }

  const dueFrom = searchParams.get('due_date_from');
  const dueTo = searchParams.get('due_date_to');
  if (dueFrom && dueTo) {
    result = result.filter((t) => {
      const day = t.due_date.split('T')[0];
      return day >= dueFrom && day <= dueTo;
    });
  }

  return result;
}

function paginate(tasks: MockTask[], searchParams: URLSearchParams) {
  const page = Number(searchParams.get('page') ?? 1);
  const limit = Number(searchParams.get('limit') ?? 20);
  const start = (page - 1) * limit;
  const slice = tasks.slice(start, start + limit);
  return {
    tasks: slice,
    page,
    limit,
    total: tasks.length,
    total_pages: Math.max(1, Math.ceil(tasks.length / limit)),
  };
}

export function resolveApiRequest(
  store: MockStore,
  method: string,
  pathname: string,
  searchParams: URLSearchParams,
  body?: Record<string, unknown>
): ApiResponse | null {
  const e2eUser = getE2eUser();

  if (method === 'POST' && pathname === '/api/v1/auth/login') {
    if (body?.username === 'invalid' || body?.password === 'wrong') {
      return { status: 401, body: { error: 'Credenciais inválidas' } };
    }
    return { status: 200, body: { token: 'e2e-mock-token', user: e2eUser } };
  }

  if (method === 'POST' && pathname === '/api/v1/auth/register') {
    const now = new Date().toISOString();
    const newUser = {
      id: store.users.length + 1,
      username: String(body?.username ?? 'newuser'),
      email: String(body?.email ?? 'new@test.com'),
      notifications_enabled: false,
      telegram_chat_id: '',
      created_at: now,
      updated_at: now,
    };
    store.users.push(newUser);
    return { status: 201, body: { token: 'e2e-mock-token', user: newUser } };
  }

  if (method === 'POST' && pathname === '/api/v1/auth/logout') {
    return { status: 200, body: { message: 'ok' } };
  }

  if (method === 'GET' && pathname === '/api/v1/tasks') {
    const filtered = filterTasks(store.tasks, searchParams);
    return { status: 200, body: paginate(filtered, searchParams) };
  }

  if (method === 'GET' && pathname === '/api/v1/tasks/assigned') {
    const assigned = store.tasks.filter(
      (t) => t.assigned_by === e2eUser.id && t.user_id !== e2eUser.id
    );
    const filtered = filterTasks(assigned, searchParams);
    return { status: 200, body: paginate(filtered, searchParams) };
  }

  const taskMatch = pathname.match(/^\/api\/v1\/tasks\/(\d+)$/);
  if (method === 'GET' && taskMatch) {
    const id = Number(taskMatch[1]);
    const task = store.tasks.find((t) => t.id === id);
    if (!task) {
      return { status: 404, body: { error: 'not found' } };
    }
    return { status: 200, body: task };
  }

  if (method === 'POST' && pathname === '/api/v1/tasks') {
    const now = new Date().toISOString();
    const task: MockTask = {
      id: store.nextTaskId++,
      title: String(body?.title ?? 'Nova tarefa'),
      description: String(body?.description ?? ''),
      type: (body?.type as MockTask['type']) ?? 'casa',
      priority: (body?.priority as MockTask['priority']) ?? 'media',
      completed: false,
      due_date: String(body?.due_date ?? now),
      user_id: Number(body?.user_id ?? e2eUser.id),
      assigned_by: body?.user_id && body.user_id !== e2eUser.id ? e2eUser.id : 0,
      assigned_by_user: e2eUser,
      user: e2eUser,
      tags: [],
      comments: [],
      shared_with: [],
      created_at: now,
      updated_at: now,
    };
    store.tasks.unshift(task);
    return { status: 201, body: task };
  }

  if (method === 'PUT' && taskMatch) {
    const id = Number(taskMatch[1]);
    const index = store.tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      return { status: 404, body: { error: 'not found' } };
    }
    const existing = store.tasks[index];
    const updated: MockTask = {
      ...existing,
      title: String(body?.title ?? existing.title),
      description: String(body?.description ?? existing.description),
      type: (body?.type as MockTask['type']) ?? existing.type,
      priority: (body?.priority as MockTask['priority']) ?? existing.priority,
      completed: Boolean(body?.completed ?? existing.completed),
      due_date: String(body?.due_date ?? existing.due_date),
      updated_at: new Date().toISOString(),
    };
    store.tasks[index] = updated;
    return { status: 200, body: updated };
  }

  if (method === 'DELETE' && taskMatch) {
    const id = Number(taskMatch[1]);
    store.tasks = store.tasks.filter((t) => t.id !== id);
    return { status: 200, body: { message: 'deleted' } };
  }

  if (method === 'GET' && pathname === '/api/v1/tags') {
    return { status: 200, body: store.tags };
  }

  if (method === 'GET' && pathname === '/api/v1/users') {
    const limit = Number(searchParams.get('limit') ?? 100);
    const users = store.users.filter((u) => u.id !== e2eUser.id).slice(0, limit);
    return {
      status: 200,
      body: { users, page: 1, limit, total: users.length, total_pages: 1 },
    };
  }

  if (method === 'GET' && pathname === '/api/v1/users/me') {
    return { status: 200, body: e2eUser };
  }

  const commentsMatch = pathname.match(/^\/api\/v1\/tasks\/(\d+)\/comments$/);
  if (method === 'GET' && commentsMatch) {
    const taskId = Number(commentsMatch[1]);
    const comments = store.comments.filter((c) => c.task_id === taskId);
    return { status: 200, body: comments };
  }

  if (method === 'GET' && pathname === '/api/v1/groups') {
    return { status: 200, body: store.groups ?? [] };
  }

  const groupMatch = pathname.match(/^\/api\/v1\/groups\/(\d+)$/);
  if (method === 'GET' && groupMatch) {
    const id = Number(groupMatch[1]);
    const group = store.groups?.find((g) => g.id === id);
    if (!group) {
      return { status: 404, body: { message: 'not found' } };
    }
    return {
      status: 200,
      body: {
        ...group,
        members: store.users.filter((u) => u.id === e2eUser.id || u.id === 2),
        pending_invitations: (store.groupInvitations ?? []).filter((i) => i.group_id === id),
      },
    };
  }

  if (method === 'POST' && pathname === '/api/v1/groups') {
    const name = String(body?.name ?? 'Novo grupo');
    const newGroup = {
      id: (store.groups?.length ?? 0) + 10,
      name,
      is_default: false,
      member_count: 1,
      created_by: e2eUser.id,
    };
    store.groups = [...(store.groups ?? []), newGroup];
    return { status: 201, body: { id: newGroup.id, name: newGroup.name } };
  }

  const groupInviteMatch = pathname.match(/^\/api\/v1\/groups\/(\d+)\/invitations$/);
  if (method === 'POST' && groupInviteMatch) {
    const groupId = Number(groupInviteMatch[1]);
    const invitedUserId = Number(body?.user_id ?? 2);
    const inv = {
      id: store.nextInvitationId++,
      group_id: groupId,
      invited_user_id: invitedUserId,
      invited_by_user_id: e2eUser.id,
      status: 'pending',
      group: store.groups?.find((g) => g.id === groupId),
    };
    store.groupInvitations = [...(store.groupInvitations ?? []), inv];
    return { status: 201, body: inv };
  }

  if (method === 'GET' && pathname === '/api/v1/group-invitations') {
    return {
      status: 200,
      body: (store.groupInvitations ?? []).filter((i) => i.invited_user_id === e2eUser.id),
    };
  }

  const acceptMatch = pathname.match(/^\/api\/v1\/group-invitations\/(\d+)\/accept$/);
  if (method === 'POST' && acceptMatch) {
    const id = Number(acceptMatch[1]);
    store.groupInvitations = (store.groupInvitations ?? []).filter((i) => i.id !== id);
    return { status: 200, body: { message: 'Invitation accepted' } };
  }

  const declineMatch = pathname.match(/^\/api\/v1\/group-invitations\/(\d+)\/decline$/);
  if (method === 'POST' && declineMatch) {
    const id = Number(declineMatch[1]);
    store.groupInvitations = (store.groupInvitations ?? []).filter((i) => i.id !== id);
    return { status: 200, body: { message: 'Invitation declined' } };
  }

  if (method === 'GET' && pathname === '/api/v1/notifications/in-app/unread-count') {
    const count = (store.groupInvitations ?? []).filter(
      (i) => i.invited_user_id === e2eUser.id
    ).length;
    return { status: 200, body: { count } };
  }

  if (method === 'GET' && pathname === '/api/v1/notifications/in-app') {
    const notifications = (store.groupInvitations ?? [])
      .filter((i) => i.invited_user_id === e2eUser.id)
      .map((i) => ({
        id: i.id,
        user_id: e2eUser.id,
        type: 'group_invite',
        payload: JSON.stringify({
          invitation_id: i.id,
          group_id: i.group_id,
          group_name: i.group?.name ?? 'Grupo',
          invited_by_username: 'e2euser',
        }),
        read: false,
        created_at: new Date().toISOString(),
      }));
    return {
      status: 200,
      body: {
        notifications,
        total: notifications.length,
        page: 1,
        limit: 50,
        total_pages: 1,
      },
    };
  }

  const shareMatch = pathname.match(/^\/api\/v1\/tasks\/(\d+)\/share$/);
  if (method === 'POST' && shareMatch) {
    const taskId = Number(shareMatch[1]);
    const task = store.tasks.find((t) => t.id === taskId);
    if (!task) {
      return { status: 404, body: { error: 'not found' } };
    }
    const userIds = (body?.user_ids as number[]) ?? [];
    const sharedUsers = store.users.filter((u) => userIds.includes(u.id));
    task.shared_with = sharedUsers as typeof task.shared_with;
    return { status: 200, body: { message: 'Task shared successfully' } };
  }

  if (method === 'POST' && pathname === '/api/v1/comments') {
    const now = new Date().toISOString();
    const taskId = Number(body?.task_id);
    const task = store.tasks.find((t) => t.id === taskId);
    const comment = {
      id: store.nextCommentId++,
      content: String(body?.content ?? ''),
      task_id: taskId,
      user_id: e2eUser.id,
      user: e2eUser,
      task: task ?? store.tasks[0],
      created_at: now,
      updated_at: now,
    };
    store.comments.push(comment);
    return { status: 201, body: comment };
  }

  return null;
}
