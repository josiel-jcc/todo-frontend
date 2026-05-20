import { HttpResponse, http } from 'msw';
import { getE2eUser, getStore } from '../store';

const api = '/api/v1';

export const commentHandlers = [
  http.get(`${api}/tasks/:taskId/comments`, ({ params }) => {
    const taskId = Number(params.taskId);
    const store = getStore();
    const comments = store.comments.filter((c) => c.task?.id === taskId || c.task_id === taskId);
    return HttpResponse.json(comments);
  }),

  http.post(`${api}/comments`, async ({ request }) => {
    const body = (await request.json()) as { content?: string; task_id?: number };
    const store = getStore();
    const user = getE2eUser();
    const now = new Date().toISOString();
    const task = store.tasks.find((t) => t.id === body.task_id);
    const comment = {
      id: store.nextCommentId++,
      content: String(body.content ?? ''),
      task_id: Number(body.task_id),
      user_id: user.id,
      user,
      task: task ?? store.tasks[0],
      created_at: now,
      updated_at: now,
    };
    store.comments.push(comment);
    return HttpResponse.json(comment, { status: 201 });
  }),
];
