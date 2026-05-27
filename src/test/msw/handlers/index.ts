import { authHandlers } from './auth';
import { commentHandlers } from './comments';
import { groupHandlers } from './groups';
import { pushNotificationHandlers } from './pushNotifications';
import { tagHandlers } from './tags';
import { statsHandlers } from './stats';
import { taskHandlers } from './tasks';
import { userHandlers } from './users';

export const handlers = [
  ...authHandlers,
  ...statsHandlers,
  ...taskHandlers,
  ...tagHandlers,
  ...userHandlers,
  ...pushNotificationHandlers,
  ...commentHandlers,
  ...groupHandlers,
];
