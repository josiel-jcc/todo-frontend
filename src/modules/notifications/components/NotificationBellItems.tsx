import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router';
import { toast } from 'sonner';
import {
  parseGroupInvitePayload,
  parseTaskCommentPayload,
  parseTaskCompletedPayload,
  parseTaskReminderPayload,
  type UserNotification,
} from '@/api/inAppNotifications';
import { Button } from '@/components/ui/button';
import { formatReminderMinutesLabel } from '@/lib/reminderConstants';
import { useGroupInvitationMutations } from '@/modules/groups/hooks/useGroupInvitations';

function NotificationLinkItem({
  notification,
  title,
  body,
  onMarkRead,
}: {
  notification: UserNotification;
  title: string;
  body: React.ReactNode;
  onMarkRead: (id: number) => void;
}) {
  const data = parseTaskReminderPayload(notification.payload);
  const taskId =
    data?.task_id ??
    parseTaskCommentPayload(notification.payload)?.task_id ??
    parseTaskCompletedPayload(notification.payload)?.task_id;

  if (!taskId) return null;

  return (
    <Link
      to={`/tasks/${taskId}`}
      onClick={() => onMarkRead(notification.id)}
      className={`block border-b px-3 py-3 text-sm last:border-0 hover:bg-muted/50 transition-colors ${
        notification.read ? 'opacity-60' : ''
      }`}
    >
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-muted-foreground">{body}</p>
    </Link>
  );
}

export function TaskReminderNotificationItem({
  notification,
  onMarkRead,
}: {
  notification: UserNotification;
  onMarkRead: (id: number) => void;
}) {
  const data = parseTaskReminderPayload(notification.payload);
  if (!data) return null;

  return (
    <NotificationLinkItem
      notification={notification}
      title="Lembrete de tarefa"
      body={
        <>
          <span className="text-foreground">{data.title}</span> vence em{' '}
          {formatReminderMinutesLabel(data.minutes_before)}
        </>
      }
      onMarkRead={onMarkRead}
    />
  );
}

export function TaskCommentNotificationItem({
  notification,
  onMarkRead,
}: {
  notification: UserNotification;
  onMarkRead: (id: number) => void;
}) {
  const data = parseTaskCommentPayload(notification.payload);
  if (!data) return null;

  return (
    <NotificationLinkItem
      notification={notification}
      title="Novo comentário"
      body={
        <>
          <span className="font-medium text-foreground">{data.author_username}</span> comentou em{' '}
          <span className="text-foreground">{data.task_title}</span>
          {data.comment_preview ? `: "${data.comment_preview}"` : ''}
        </>
      }
      onMarkRead={onMarkRead}
    />
  );
}

export function TaskCompletedNotificationItem({
  notification,
  onMarkRead,
}: {
  notification: UserNotification;
  onMarkRead: (id: number) => void;
}) {
  const data = parseTaskCompletedPayload(notification.payload);
  if (!data) return null;

  return (
    <NotificationLinkItem
      notification={notification}
      title="Tarefa concluída"
      body={
        <>
          <span className="font-medium text-foreground">{data.completed_by_username}</span> concluiu
          a tarefa <span className="text-foreground">{data.task_title}</span> que você delegou
        </>
      }
      onMarkRead={onMarkRead}
    />
  );
}

export function GroupInviteNotificationItem({
  notification,
  onMarkRead,
}: {
  notification: UserNotification;
  onMarkRead: (id: number) => void;
}) {
  const queryClient = useQueryClient();
  const { acceptMutation, declineMutation } = useGroupInvitationMutations();
  const data = parseGroupInvitePayload(notification.payload);
  if (!data) return null;

  const handleAccept = () => {
    acceptMutation.mutate(data.invitation_id, {
      onSuccess: () => {
        toast.success('Convite aceito');
        void queryClient.invalidateQueries({ queryKey: ['notifications', 'in-app'] });
        void queryClient.invalidateQueries({ queryKey: ['groups'] });
        void queryClient.invalidateQueries({ queryKey: ['users'] });
        onMarkRead(notification.id);
      },
      onError: () => toast.error('Não foi possível aceitar o convite'),
    });
  };

  const handleDecline = () => {
    declineMutation.mutate(data.invitation_id, {
      onSuccess: () => {
        toast.success('Convite recusado');
        void queryClient.invalidateQueries({ queryKey: ['notifications', 'in-app'] });
        onMarkRead(notification.id);
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
