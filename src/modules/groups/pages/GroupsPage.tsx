import { Users } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGroupMutations, useGroups } from '../hooks/useGroups';

export const GroupsPage = () => {
  const { data: groups, isLoading } = useGroups();
  const { createMutation } = useGroupMutations();
  const [name, setName] = useState('');

  const handleCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    createMutation.mutate(trimmed, {
      onSuccess: () => {
        toast.success('Grupo criado');
        setName('');
      },
      onError: () => toast.error('Não foi possível criar o grupo'),
    });
  };

  return (
    <div className="container mx-auto max-w-2xl space-y-6 p-4 md:p-6">
      <div className="flex items-center gap-2">
        <Users className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Grupos</h1>
      </div>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-lg">Criar grupo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="group-name">Nome do grupo</Label>
            <Input
              id="group-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex.: Equipe do trabalho"
              className="rounded-xl"
            />
          </div>
          <Button
            type="button"
            className="w-full rounded-xl"
            disabled={!name.trim() || createMutation.isPending}
            onClick={handleCreate}
          >
            {createMutation.isPending ? 'Criando…' : 'Criar grupo'}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Meus grupos</h2>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando…</p>
        ) : !groups?.length ? (
          <p className="text-sm text-muted-foreground">Você ainda não participa de nenhum grupo.</p>
        ) : (
          <ul className="space-y-2">
            {groups.map((g) => (
              <li key={g.id}>
                <Link
                  to={`/groups/${g.id}`}
                  className="flex items-center justify-between rounded-2xl border px-4 py-3 transition-colors hover:bg-accent"
                >
                  <span className="font-medium">{g.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {g.member_count} {g.member_count === 1 ? 'membro' : 'membros'}
                    {g.is_default ? ' · padrão' : ''}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
