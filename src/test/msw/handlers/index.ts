import { authHandlers } from './auth';
import { commentHandlers } from './comments';
import { groupHandlers } from './groups';
import { tagHandlers } from './tags';
import { taskHandlers } from './tasks';
import { userHandlers } from './users';

export const handlers = [
  ...authHandlers,
  ...taskHandlers,
  ...tagHandlers,
  ...userHandlers,
  ...commentHandlers,
  ...groupHandlers,
];
