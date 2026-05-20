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
