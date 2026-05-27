import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserMinus, UserPlus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import type { components } from '@/api';
import { shareTask, unshareTask } from '@/api/tasks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { spacing } from '@/lib/spacing';
import { useUsers } from '../../hooks/useUsers';

type Task = components['schemas']['models.Task'];

interface TaskDetailShareSectionProps {
  task: Task;
}

export const TaskDetailShareSection = ({ task }: TaskDetailShareSectionProps) => {
  const queryClient = useQueryClient();
  const { users, isLoadingUsers } = useUsers({ limit: 200 });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const sharedWith = task.shared_with ?? [];

  const eligibleUserIds = useMemo(() => {
    const sharedIds = new Set(sharedWith.map((u) => u.id));
    return users.filter((u) => u.id !== task.user_id && !sharedIds.has(u.id)).map((u) => u.id);
  }, [users, task.user_id, sharedWith]);

  const shareMutation = useMutation({
    mutationFn: (userIds: number[]) => shareTask(task.id, { user_ids: userIds }),
    onSuccess: () => {
      toast.success('Tarefa compartilhada');
      setSelectedIds([]);
      void queryClient.invalidateQueries({ queryKey: ['tasks', task.id] });
      void queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (err: Error & { response?: { data?: { message?: string } } }) => {
      const msg = err.response?.data?.message ?? 'Não foi possível compartilhar a tarefa';
      toast.error(msg);
    },
  });

  const unshareMutation = useMutation({
    mutationFn: (userId: number) => unshareTask(task.id, userId),
    onSuccess: () => {
      toast.success('Compartilhamento removido');
      void queryClient.invalidateQueries({ queryKey: ['tasks', task.id] });
      void queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: () => {
      toast.error('Não foi possível remover o compartilhamento');
    },
  });

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleShare = () => {
    if (selectedIds.length === 0) {
      return;
    }
    shareMutation.mutate(selectedIds);
  };

  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Compartilhar com outros
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sharedWith.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-2">Pessoas com acesso</h3>
            <ul className="space-y-2">
              {sharedWith.map((u) => (
                <li
                  key={u.id}
                  className={`flex items-center justify-between rounded-xl border ${spacing.listRow}`}
                >
                  <span className="text-sm">{u.username}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    disabled={unshareMutation.isPending}
                    onClick={() => unshareMutation.mutate(u.id)}
                    aria-label={`Remover ${u.username}`}
                  >
                    <UserMinus className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-2">
          <Label>Adicionar pessoas</Label>
          {isLoadingUsers ? (
            <p className="text-sm text-muted-foreground">Carregando usuários…</p>
          ) : eligibleUserIds.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Para compartilhar tarefas, participe de um grupo com outros usuários.{' '}
              <Link to="/groups" className="text-primary underline">
                Gerenciar grupos
              </Link>
            </p>
          ) : (
            <div className={`flex flex-wrap rounded-2xl border p-4 ${spacing.gapInline}`}>
              {users
                .filter((u) => eligibleUserIds.includes(u.id))
                .map((u) => {
                  const checked = selectedIds.includes(u.id);
                  return (
                    <label
                      key={u.id}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-1.5 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/10"
                    >
                      <input
                        type="checkbox"
                        className="rounded border-input"
                        checked={checked}
                        onChange={() => toggleSelect(u.id)}
                      />
                      {u.username}
                    </label>
                  );
                })}
            </div>
          )}
        </div>

        <Button
          type="button"
          className="w-full rounded-xl"
          disabled={selectedIds.length === 0 || shareMutation.isPending}
          onClick={handleShare}
        >
          {shareMutation.isPending ? 'Compartilhando…' : 'Compartilhar selecionados'}
        </Button>
      </CardContent>
    </Card>
  );
};
