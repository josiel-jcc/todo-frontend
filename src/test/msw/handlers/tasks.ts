import { http, HttpResponse } from 'msw';
import type { MockTask } from '../store';
import { getE2eUser, getStore } from '../store';

const api = '/api/v1';

function filterTasks(tasks: MockTask[], url: URL): MockTask[] {
  let result = [...tasks];

  const completed = url.searchParams.get('completed');
  if (completed === 'true') {
    result = result.filter((t) => t.completed);
  } else if (completed === 'false') {
    result = result.filter((t) => !t.completed);
  }

  const search = url.searchParams.get('search');
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    );
  }

  const dueFrom = url.searchParams.get('due_date_from');
  const dueTo = url.searchParams.get('due_date_to');
  if (dueFrom && dueTo) {
    result = result.filter((t) => {
      const day = t.due_date.split('T')[0];
      return day >= dueFrom && day <= dueTo;
    });
  }

  return result;
}

function paginate(tasks: MockTask[], url: URL) {
  const page = Number(url.searchParams.get('page') ?? 1);
  const limit = Number(url.searchParams.get('limit') ?? 20);
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

export const taskHandlers = [
  http.get(`${api}/tasks`, ({ request }) => {
    const url = new URL(request.url);
    const store = getStore();
    const filtered = filterTasks(store.tasks, url);
    return HttpResponse.json(paginate(filtered, url));
  }),

  http.get(`${api}/tasks/assigned`, ({ request }) => {
    const url = new URL(request.url);
    const store = getStore();
    const e2eUser = getE2eUser();
    const assigned = store.tasks.filter((t) => t.assigned_by === e2eUser.id && t.user_id !== e2eUser.id);
    const filtered = filterTasks(assigned, url);
    return HttpResponse.json(paginate(filtered, url));
  }),

  http.get(`${api}/tasks/:id`, ({ params }) => {
    const store = getStore();
    const id = Number(params.id);
    const task = store.tasks.find((t) => t.id === id);
    if (!task) {
      return HttpResponse.json({ error: 'not found' }, { status: 404 });
    }
    return HttpResponse.json(task);
  }),

  http.post(`${api}/tasks`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const store = getStore();
    const user = getE2eUser();
    const now = new Date().toISOString();
    const task: MockTask = {
      id: store.nextTaskId++,
      title: String(body.title ?? 'Nova tarefa'),
      description: String(body.description ?? ''),
      type: (body.type as MockTask['type']) ?? 'casa',
      priority: (body.priority as MockTask['priority']) ?? 'media',
      completed: false,
      due_date: String(body.due_date ?? now),
      user_id: Number(body.user_id ?? user.id),
      assigned_by: body.user_id && body.user_id !== user.id ? user.id : 0,
      assigned_by_user: user,
      user,
      tags: [],
      comments: [],
      shared_with: [],
      created_at: now,
      updated_at: now,
    };
    store.tasks.unshift(task);
    return HttpResponse.json(task, { status: 201 });
  }),

  http.put(`${api}/tasks/:id`, async ({ params, request }) => {
    const store = getStore();
    const id = Number(params.id);
    const index = store.tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      return HttpResponse.json({ error: 'not found' }, { status: 404 });
    }
    const body = (await request.json()) as Record<string, unknown>;
    const existing = store.tasks[index];
    const updated: MockTask = {
      ...existing,
      title: String(body.title ?? existing.title),
      description: String(body.description ?? existing.description),
      type: (body.type as MockTask['type']) ?? existing.type,
      priority: (body.priority as MockTask['priority']) ?? existing.priority,
      completed: Boolean(body.completed ?? existing.completed),
      due_date: String(body.due_date ?? existing.due_date),
      updated_at: new Date().toISOString(),
    };
    store.tasks[index] = updated;
    return HttpResponse.json(updated);
  }),

  http.delete(`${api}/tasks/:id`, ({ params }) => {
    const store = getStore();
    const id = Number(params.id);
    store.tasks = store.tasks.filter((t) => t.id !== id);
    return HttpResponse.json({ message: 'deleted' });
  }),
];
