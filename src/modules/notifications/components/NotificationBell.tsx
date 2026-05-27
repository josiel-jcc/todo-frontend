import { Bell } from 'lucide-react';
import type { UserNotification } from '@/api/inAppNotifications';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { spacing } from '@/lib/spacing';
import {
  useInAppNotificationMutations,
  useInAppNotifications,
  useUnreadNotificationCount,
} from '../hooks/useInAppNotifications';
import {
  GroupInviteNotificationItem,
  TaskCommentNotificationItem,
  TaskCompletedNotificationItem,
  TaskReminderNotificationItem,
} from './NotificationBellItems';

function NotificationItem({
  notification,
  onMarkRead,
}: {
  notification: UserNotification;
  onMarkRead: (id: number) => void;
}) {
  switch (notification.type) {
    case 'task_reminder':
      return <TaskReminderNotificationItem notification={notification} onMarkRead={onMarkRead} />;
    case 'task_comment':
      return <TaskCommentNotificationItem notification={notification} onMarkRead={onMarkRead} />;
    case 'task_completed':
      return <TaskCompletedNotificationItem notification={notification} onMarkRead={onMarkRead} />;
    case 'group_invite':
      return <GroupInviteNotificationItem notification={notification} onMarkRead={onMarkRead} />;
    default:
      return (
        <div className={`border-b text-sm text-muted-foreground last:border-0 ${spacing.listRow}`}>
          Notificação
        </div>
      );
  }
}

export const NotificationBell = () => {
  const { data: count = 0 } = useUnreadNotificationCount();
  const { data, isLoading } = useInAppNotifications({ activeOnly: true });
  const { markReadMutation, markAllReadMutation } = useInAppNotificationMutations();
  const notifications = data?.notifications ?? [];

  const handleMarkRead = (id: number) => {
    if (!markReadMutation.isPending) {
      markReadMutation.mutate(id);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative rounded-xl"
          aria-label="Notificações"
        >
          <Bell className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              {count > 9 ? '9+' : count}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 rounded-2xl p-0">
        <div className={`flex items-center justify-between border-b ${spacing.listRow}`}>
          <span className="font-semibold text-sm">Notificações</span>
          {count > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-auto px-2 py-1 text-xs"
              disabled={markAllReadMutation.isPending}
              onClick={() => markAllReadMutation.mutate()}
            >
              Marcar todas como lidas
            </Button>
          )}
        </div>
        {isLoading ? (
          <p className={`px-4 py-4 text-sm text-muted-foreground`}>Carregando…</p>
        ) : notifications.length === 0 ? (
          <p className={`px-4 py-4 text-sm text-muted-foreground`}>Nenhuma notificação nova</p>
        ) : (
          notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} onMarkRead={handleMarkRead} />
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
