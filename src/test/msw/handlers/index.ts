import { authHandlers } from './auth';
import { commentHandlers } from './comments';
import { groupHandlers } from './groups';
import { pushNotificationHandlers } from './pushNotifications';
import { statsHandlers } from './stats';
import { tagHandlers } from './tags';
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
