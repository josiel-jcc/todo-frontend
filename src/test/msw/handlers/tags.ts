import { http, HttpResponse } from 'msw';
import { getStore } from '../store';

const api = '/api/v1';

export const tagHandlers = [
  http.get(`${api}/tags`, () => {
    const store = getStore();
    return HttpResponse.json(store.tags);
  }),
];
