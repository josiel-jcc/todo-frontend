import { useState } from 'react';
import type { FinanceGoal } from '@/api/finance';
import { FormDateField } from '@/components/FormDateField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { spacing } from '@/lib/spacing';
import { formatMoneyFromCents } from '../lib/formatMoney';
import { centsToAmountInput, parseAmountToCents } from '../lib/parseAmount';
import { FinanceAmountInput } from './FinanceAmountInput';

type Props = {
  goals: FinanceGoal[] | undefined;
  isLoading: boolean;
  isPending: boolean;
  onCreate: (body: {
    name: string;
    target_cents: number;
    current_cents?: number;
    target_date?: string;
  }) => Promise<void>;
  onUpdate: (goalId: number, body: { current_cents: number }) => Promise<void>;
  onDelete: (goalId: number) => Promise<void>;
};

const goalBarColor = (goal: FinanceGoal) => {
  if (goal.is_completed) return 'bg-green-600 dark:bg-green-500';
  if (goal.percent_complete >= 85) return 'bg-amber-500';
  return 'bg-primary';
};

export const FinanceGoalsCard = ({
  goals,
  isLoading,
  isPending,
  onCreate,
  onUpdate,
  onDelete,
}: Props) => {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [current, setCurrent] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editCurrent, setEditCurrent] = useState('');

  const handleCreate = async () => {
    const targetCents = parseAmountToCents(target);
    if (!name.trim() || targetCents == null) return;
    const currentCents = current.trim() ? parseAmountToCents(current) : 0;
    await onCreate({
      name: name.trim(),
      target_cents: targetCents,
      current_cents: currentCents ?? 0,
      target_date: targetDate || undefined,
    });
    setName('');
    setTarget('');
    setCurrent('');
    setTargetDate('');
  };

  const startEdit = (goal: FinanceGoal) => {
    setEditingId(goal.id);
    setEditCurrent(centsToAmountInput(goal.current_cents));
  };

  const saveEdit = async (goalId: number) => {
    const cents = parseAmountToCents(editCurrent);
    if (cents == null) return;
    await onUpdate(goalId, { current_cents: cents });
    setEditingId(null);
  };

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando metas…</p>;
  }

  const active = goals?.filter((g) => !g.is_archived) ?? [];

  return (
    <div className={spacing.stackForm}>
      {active.length > 0 ? (
        <ul className={spacing.stackList}>
          {active.map((goal) => (
            <li key={goal.id} className={`rounded-xl border p-3 ${spacing.stackField}`}>
              <div className="flex justify-between gap-2 text-sm">
                <span className="font-medium">{goal.name}</span>
                <span className="text-muted-foreground shrink-0">
                  {formatMoneyFromCents(goal.current_cents)} /{' '}
                  {formatMoneyFromCents(goal.target_cents)}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all ${goalBarColor(goal)}`}
                  style={{ width: `${Math.min(goal.percent_complete, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {goal.percent_complete.toFixed(0)}%{goal.is_completed ? ' — meta atingida' : ''}
                {goal.target_date ? ` · até ${goal.target_date}` : ''}
              </p>
              {editingId === goal.id ? (
                <div className={`flex gap-2 ${spacing.gapInline}`}>
                  <FinanceAmountInput
                    className="flex-1"
                    value={editCurrent}
                    onChange={setEditCurrent}
                    placeholder="Valor atual"
                  />
                  <Button
                    type="button"
                    size="sm"
                    className="rounded-xl"
                    disabled={isPending}
                    onClick={() => void saveEdit(goal.id)}
                  >
                    Salvar
                  </Button>
                </div>
              ) : (
                <div className={`flex gap-2 ${spacing.gapInline}`}>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    onClick={() => startEdit(goal)}
                  >
                    Atualizar valor
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="rounded-xl text-destructive"
                    disabled={isPending}
                    onClick={() => void onDelete(goal.id)}
                  >
                    Excluir
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">Nenhuma meta ativa.</p>
      )}

      <div className={`border-t pt-4 ${spacing.stackForm}`}>
        <p className="text-sm font-medium">Nova meta</p>
        <div className={spacing.stackField}>
          <Label htmlFor="goal-name">Nome</Label>
          <Input
            id="goal-name"
            className="rounded-xl"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex.: Viagem"
          />
        </div>
        <div className={`grid gap-3 sm:grid-cols-2 ${spacing.gapInline}`}>
          <div className={spacing.stackField}>
            <Label htmlFor="goal-target">Meta (R$)</Label>
            <FinanceAmountInput id="goal-target" value={target} onChange={setTarget} />
          </div>
          <div className={spacing.stackField}>
            <Label htmlFor="goal-current">Já guardado (R$)</Label>
            <FinanceAmountInput id="goal-current" value={current} onChange={setCurrent} />
          </div>
        </div>
        <FormDateField
          id="goal-date"
          label="Data alvo (opcional)"
          value={targetDate}
          onChange={setTargetDate}
        />
        <Button
          type="button"
          className="w-full rounded-xl"
          disabled={isPending}
          onClick={() => void handleCreate()}
        >
          Criar meta
        </Button>
      </div>
    </div>
  );
};
