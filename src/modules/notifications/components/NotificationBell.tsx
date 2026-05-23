import { useQueryClient } from '@tanstack/react-query';
import { Bell } from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import {
  parseGroupInvitePayload,
  parseTaskReminderPayload,
  type UserNotification,
} from '@/api/inAppNotifications';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatReminderMinutesLabel } from '@/lib/reminderConstants';
import { useGroupInvitationMutations } from '@/modules/groups/hooks/useGroupInvitations';
import { useInAppNotifications, useUnreadNotificationCount } from '../hooks/useInAppNotifications';

function TaskReminderNotificationItem({ notification }: { notification: UserNotification }) {
  const data = parseTaskReminderPayload(notification.payload);
  if (!data) return null;

  const minutesLabel = formatReminderMinutesLabel(data.minutes_before);

  return (
    <Link
      to={`/tasks/${data.task_id}`}
      className="block border-b px-3 py-3 text-sm last:border-0 hover:bg-muted/50 transition-colors"
    >
      <p className="font-medium">Lembrete de tarefa</p>
      <p className="mt-1 text-muted-foreground">
        <span className="text-foreground">{data.title}</span> vence em {minutesLabel}
      </p>
    </Link>
  );
}

function NotificationItem({ notification }: { notification: UserNotification }) {
  const queryClient = useQueryClient();
  const { acceptMutation, declineMutation } = useGroupInvitationMutations();

  if (notification.type === 'task_reminder') {
    return <TaskReminderNotificationItem notification={notification} />;
  }

  if (notification.type !== 'group_invite') {
    return (
      <div className="px-3 py-2 text-sm text-muted-foreground border-b last:border-0">
        Notificação
      </div>
    );
  }

  const data = parseGroupInvitePayload(notification.payload);
  if (!data) return null;

  const handleAccept = () => {
    acceptMutation.mutate(data.invitation_id, {
      onSuccess: () => {
        toast.success('Convite aceito');
        void queryClient.invalidateQueries({ queryKey: ['notifications', 'in-app'] });
        void queryClient.invalidateQueries({ queryKey: ['groups'] });
        void queryClient.invalidateQueries({ queryKey: ['users'] });
      },
      onError: () => toast.error('Não foi possível aceitar o convite'),
    });
  };

  const handleDecline = () => {
    declineMutation.mutate(data.invitation_id, {
      onSuccess: () => {
        toast.success('Convite recusado');
        void queryClient.invalidateQueries({ queryKey: ['notifications', 'in-app'] });
      },
      onError: () => toast.error('Não foi possível recusar o convite'),
    });
  };

  return (
    <div className="space-y-2 border-b px-3 py-3 last:border-0">
      <p className="text-sm">
        <span className="font-medium">{data.invited_by_username}</span> convidou você para{' '}
        <span className="font-medium">{data.group_name}</span>
      </p>
      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          className="flex-1 rounded-lg"
          disabled={acceptMutation.isPending}
          onClick={handleAccept}
        >
          Aceitar
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="flex-1 rounded-lg"
          disabled={declineMutation.isPending}
          onClick={handleDecline}
        >
          Recusar
        </Button>
      </div>
    </div>
  );
}

export const NotificationBell = () => {
  const { data: count = 0 } = useUnreadNotificationCount();
  const { data, isLoading } = useInAppNotifications(true);
  const notifications = data?.notifications ?? [];

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
        <div className="border-b px-3 py-2 font-semibold text-sm">Notificações</div>
        {isLoading ? (
          <p className="px-3 py-4 text-sm text-muted-foreground">Carregando…</p>
        ) : notifications.length === 0 ? (
          <p className="px-3 py-4 text-sm text-muted-foreground">Nenhuma notificação nova</p>
        ) : (
          notifications.map((n) => <NotificationItem key={n.id} notification={n} />)
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
