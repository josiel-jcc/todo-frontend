import { HttpResponse, http } from 'msw';
import { buildUserTaskStats, visibleTasksForStats } from '../statsMock';
import { getE2eUser, getStore } from '../store';

const api = '/api/v1';

export const statsHandlers = [
  http.get(`${api}/stats`, ({ request }) => {
    const url = new URL(request.url);
    const hideStale = url.searchParams.get('hide_stale_completed') !== 'false';
    const store = getStore();
    const user = getE2eUser();
    return HttpResponse.json(
      buildUserTaskStats(visibleTasksForStats(store.tasks, user.id, hideStale))
    );
  }),
];
