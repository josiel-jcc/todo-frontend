import { ArrowLeft, UserMinus, UserPlus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { PageShell } from '@/components/PageShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formSelectClassName } from '@/lib/formSelect';
import { spacing } from '@/lib/spacing';
import { useUsers } from '@/modules/tasks/hooks/useUsers';
import { useGroup, useGroupMutations } from '../hooks/useGroups';

export const GroupDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const groupId = Number(id);
  const navigate = useNavigate();
  const { data: group, isLoading, isError } = useGroup(groupId);
  const {
    updateMutation,
    deleteMutation,
    inviteMutation,
    cancelInviteMutation,
    removeMemberMutation,
  } = useGroupMutations();
  const [editName, setEditName] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const { users, isLoadingUsers } = useUsers({ limit: 200, scope: 'invite', group_id: groupId });

  const eligibleUsers = useMemo(() => users, [users]);

  if (isLoading) {
    return (
      <PageShell size="narrow">
        <p className="text-muted-foreground">Carregando…</p>
      </PageShell>
    );
  }

  if (isError || !group) {
    return (
      <PageShell size="narrow" className={spacing.stackSection}>
        <p className="text-muted-foreground">
          {isError ? 'Você não tem acesso a este grupo ou ele não existe.' : 'Grupo não encontrado'}
        </p>
        <Link to="/groups" className="text-primary underline text-sm">
          Voltar aos grupos
        </Link>
      </PageShell>
    );
  }

  const displayName = editName || group.name;

  const handleSaveName = () => {
    const trimmed = editName.trim();
    if (!trimmed || trimmed === group.name) return;
    updateMutation.mutate(
      { id: groupId, name: trimmed },
      {
        onSuccess: () => toast.success('Grupo atualizado'),
        onError: () => toast.error('Não foi possível atualizar'),
      }
    );
  };

  const handleDelete = () => {
    if (group.is_default) {
      toast.error('O grupo padrão não pode ser excluído');
      return;
    }
    if (!window.confirm('Excluir este grupo?')) return;
    deleteMutation.mutate(groupId, {
      onSuccess: () => {
        toast.success('Grupo excluído');
        navigate('/groups');
      },
      onError: () => toast.error('Não foi possível excluir'),
    });
  };

  const handleInvite = () => {
    if (!selectedUserId) return;
    inviteMutation.mutate(
      { groupId, userId: selectedUserId },
      {
        onSuccess: () => {
          toast.success('Convite enviado');
          setSelectedUserId(null);
        },
        onError: () => toast.error('Não foi possível enviar o convite'),
      }
    );
  };

  return (
    <PageShell size="narrow">
      <Link
        to="/groups"
        className={`inline-flex items-center text-sm text-muted-foreground hover:text-foreground ${spacing.gapInline}`}
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar aos grupos
      </Link>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>{group.name}</CardTitle>
        </CardHeader>
        <CardContent className={spacing.stackForm}>
          <div className="space-y-2">
            <Label htmlFor="edit-name">Renomear</Label>
            <div className="flex gap-2">
              <Input
                id="edit-name"
                defaultValue={group.name}
                placeholder={displayName}
                onChange={(e) => setEditName(e.target.value)}
                className="rounded-xl"
              />
              <Button
                type="button"
                variant="secondary"
                className="rounded-xl"
                onClick={handleSaveName}
              >
                Salvar
              </Button>
            </div>
          </div>
          {!group.is_default && (
            <Button
              type="button"
              variant="destructive"
              className="rounded-xl"
              onClick={handleDelete}
            >
              Excluir grupo
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Membros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {group.members.map((m) => (
              <li
                key={m.id}
                className={`flex items-center justify-between rounded-xl border ${spacing.listRow}`}
              >
                <span className="text-sm">{m.username}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  disabled={removeMemberMutation.isPending}
                  onClick={() =>
                    removeMemberMutation.mutate(
                      { groupId, userId: m.id },
                      {
                        onSuccess: () => toast.success('Membro removido'),
                        onError: () => toast.error('Não foi possível remover'),
                      }
                    )
                  }
                  aria-label={`Remover ${m.username}`}
                >
                  <UserMinus className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {group.pending_invitations.length > 0 && (
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-lg">Convites pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {group.pending_invitations.map((inv) => (
                <li
                  key={inv.id}
                  className={`flex items-center justify-between rounded-xl border ${spacing.listRow}`}
                >
                  <span className="text-sm">
                    {inv.invited_user?.username ?? `Usuário #${inv.invited_user_id}`}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    onClick={() =>
                      cancelInviteMutation.mutate(
                        { groupId, invitationId: inv.id },
                        {
                          onSuccess: () => toast.success('Convite cancelado'),
                          onError: () => toast.error('Erro ao cancelar'),
                        }
                      )
                    }
                  >
                    Cancelar
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-lg">Convidar usuário</CardTitle>
        </CardHeader>
        <CardContent className={spacing.stackForm}>
          {isLoadingUsers ? (
            <p className="text-sm text-muted-foreground">Carregando usuários…</p>
          ) : eligibleUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Não há usuários disponíveis para convidar.
            </p>
          ) : (
            <select
              className={formSelectClassName}
              value={selectedUserId ?? ''}
              onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">Selecione um usuário</option>
              {eligibleUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.username}
                </option>
              ))}
            </select>
          )}
          <Button
            type="button"
            className="w-full rounded-xl"
            disabled={!selectedUserId || inviteMutation.isPending}
            onClick={handleInvite}
          >
            Enviar convite
          </Button>
        </CardContent>
      </Card>
    </PageShell>
  );
};
