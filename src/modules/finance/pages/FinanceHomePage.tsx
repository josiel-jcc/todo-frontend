import { Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { Loading } from '@/components/Loading';
import { PageShell } from '@/components/PageShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { formSelectClassName } from '@/lib/formSelect';
import { spacing } from '@/lib/spacing';
import { useGroups } from '@/modules/groups/hooks/useGroups';
import { FinanceBudgetEditor } from '../components/FinanceBudgetEditor';
import { FinanceCategoryBreakdown } from '../components/FinanceCategoryBreakdown';
import { FinanceGoalsCard } from '../components/FinanceGoalsCard';
import { FinanceTransactionForm } from '../components/FinanceTransactionForm';
import { FinanceTransactionsList } from '../components/FinanceTransactionsList';
import {
  useCreateFinanceAccount,
  useCreateFinanceGoal,
  useCreateFinanceTransaction,
  useDeleteFinanceGoal,
  useDeleteFinanceTransaction,
  useFinanceAccounts,
  useFinanceCategories,
  useFinanceCategoryBudgets,
  useFinanceDashboard,
  useFinanceGoals,
  useFinanceTransactions,
  useSetFinanceCategoryBudgets,
  useUpdateFinanceGoal,
  useUpdateFinanceTransaction,
} from '../hooks/useFinance';
import { formatMoneyFromCents } from '../lib/formatMoney';

const STORAGE_KEY = 'finance_selected_group_id';

export const FinanceHomePage = () => {
  const { handleApiError } = useErrorHandler();
  const { data: groups, isLoading: loadingGroups } = useGroups();
  const [groupId, setGroupId] = useState<number | null>(null);
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));

  useEffect(() => {
    if (!groups?.length) return;
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? Number(stored) : NaN;
    const valid = groups.find((g) => g.id === parsed);
    setGroupId(valid ? valid.id : groups[0].id);
  }, [groups]);

  useEffect(() => {
    if (groupId) localStorage.setItem(STORAGE_KEY, String(groupId));
  }, [groupId]);

  const gid = groupId ?? 0;
  const { data: dashboard, isLoading: loadingDash } = useFinanceDashboard(groupId, month);
  const { data: accounts } = useFinanceAccounts(groupId);
  const { data: transactions, isLoading: loadingTx } = useFinanceTransactions(groupId);
  const { data: expenseCategories } = useFinanceCategories(groupId, 'expense');
  const { data: incomeCategories } = useFinanceCategories(groupId, 'income');
  const { data: categoryBudgets } = useFinanceCategoryBudgets(groupId, month);
  const { data: goals, isLoading: loadingGoals } = useFinanceGoals(groupId);
  const createAccount = useCreateFinanceAccount(gid);
  const setBudgets = useSetFinanceCategoryBudgets(gid, month);
  const createGoal = useCreateFinanceGoal(gid);
  const updateGoal = useUpdateFinanceGoal(gid);
  const deleteGoal = useDeleteFinanceGoal(gid);
  const createTx = useCreateFinanceTransaction(gid, month);
  const updateTx = useUpdateFinanceTransaction(gid, month);
  const deleteTx = useDeleteFinanceTransaction(gid, month);

  const [newAccountName, setNewAccountName] = useState('');

  const handleCreateAccount = async () => {
    if (!groupId || !newAccountName.trim()) return;
    try {
      await createAccount.mutateAsync({ name: newAccountName.trim(), type: 'checking' });
      setNewAccountName('');
      toast.success('Conta criada');
    } catch (e) {
      handleApiError(e);
    }
  };

  if (loadingGroups) {
    return (
      <PageShell size="narrow">
        <Loading />
      </PageShell>
    );
  }

  if (!groups?.length) {
    return (
      <PageShell size="narrow">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Finanças</CardTitle>
            <CardDescription>
              Participe de um grupo para usar finanças compartilhadas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full rounded-xl">
              <Link to="/groups">Ir para Grupos</Link>
            </Button>
          </CardContent>
        </Card>
      </PageShell>
    );
  }

  const accountList = accounts ?? dashboard?.accounts ?? [];

  return (
    <PageShell size="wide">
      <div
        className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${spacing.gapInline}`}
      >
        <div className={`flex items-center ${spacing.gapInline}`}>
          <Wallet className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Finanças</h1>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div>
            <Label htmlFor="finance-month" className="text-xs text-muted-foreground">
              Mês
            </Label>
            <Input
              id="finance-month"
              type="month"
              className="rounded-xl mt-1"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="finance-group" className="text-xs text-muted-foreground">
              Grupo
            </Label>
            <select
              id="finance-group"
              className={`${formSelectClassName} mt-1 min-w-[10rem]`}
              value={groupId ?? ''}
              onChange={(e) => setGroupId(Number(e.target.value))}
            >
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loadingDash ? (
        <Loading />
      ) : dashboard ? (
        <div className={`grid gap-4 sm:grid-cols-3 ${spacing.sectionGap}`}>
          <Card className="rounded-3xl">
            <CardHeader className="pb-2">
              <CardDescription>Receitas</CardDescription>
              <CardTitle className="text-xl text-green-600 dark:text-green-400">
                {formatMoneyFromCents(dashboard.totals.income_cents)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="rounded-3xl">
            <CardHeader className="pb-2">
              <CardDescription>Despesas</CardDescription>
              <CardTitle className="text-xl text-red-600 dark:text-red-400">
                {formatMoneyFromCents(dashboard.totals.expense_cents)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="rounded-3xl">
            <CardHeader className="pb-2">
              <CardDescription>Saldo do mês</CardDescription>
              <CardTitle className="text-xl">
                {formatMoneyFromCents(dashboard.totals.net_cents)}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      ) : null}

      {dashboard?.by_category?.length ? (
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-lg">Despesas por categoria</CardTitle>
            <CardDescription>Comparado ao orçamento do mês selecionado</CardDescription>
          </CardHeader>
          <CardContent>
            <FinanceCategoryBreakdown rows={dashboard.by_category} />
          </CardContent>
        </Card>
      ) : null}

      <div className={`grid gap-6 lg:grid-cols-2 ${spacing.sectionGap}`}>
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-lg">Contas</CardTitle>
          </CardHeader>
          <CardContent className={spacing.stackForm}>
            <ul className="space-y-2 text-sm">
              {accountList.map((a) => (
                <li key={a.id} className="flex justify-between gap-2">
                  <span>{a.name}</span>
                  <span className="font-medium">{formatMoneyFromCents(a.balance_cents)}</span>
                </li>
              ))}
            </ul>
            <div className={`flex gap-2 ${spacing.gapInline}`}>
              <Input
                placeholder="Nova conta"
                value={newAccountName}
                onChange={(e) => setNewAccountName(e.target.value)}
                className="rounded-xl"
              />
              <Button
                type="button"
                className="rounded-xl shrink-0"
                disabled={createAccount.isPending}
                onClick={handleCreateAccount}
              >
                Adicionar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-lg">Metas de economia</CardTitle>
            <CardDescription>Acompanhe quanto já guardou para cada objetivo</CardDescription>
          </CardHeader>
          <CardContent>
            <FinanceGoalsCard
              goals={goals}
              isLoading={loadingGoals}
              isPending={createGoal.isPending || updateGoal.isPending || deleteGoal.isPending}
              onCreate={async (body) => {
                try {
                  await createGoal.mutateAsync(body);
                  toast.success('Meta criada');
                } catch (e) {
                  handleApiError(e);
                }
              }}
              onUpdate={async (goalId, body) => {
                try {
                  await updateGoal.mutateAsync({ goalId, body });
                  toast.success('Meta atualizada');
                } catch (e) {
                  handleApiError(e);
                }
              }}
              onDelete={async (goalId) => {
                try {
                  await deleteGoal.mutateAsync(goalId);
                  toast.success('Meta excluída');
                } catch (e) {
                  handleApiError(e);
                }
              }}
            />
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-lg">Orçamento mensal</CardTitle>
            <CardDescription>Limites por categoria de despesa</CardDescription>
          </CardHeader>
          <CardContent>
            <FinanceBudgetEditor
              categories={expenseCategories ?? []}
              budgets={categoryBudgets}
              isPending={setBudgets.isPending}
              onSave={async (items) => {
                try {
                  await setBudgets.mutateAsync(items);
                  toast.success('Orçamentos salvos');
                } catch (e) {
                  handleApiError(e);
                }
              }}
            />
          </CardContent>
        </Card>

        <Card className="rounded-3xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Novo lançamento</CardTitle>
          </CardHeader>
          <CardContent>
            <FinanceTransactionForm
              accounts={accountList}
              expenseCategories={expenseCategories ?? []}
              incomeCategories={incomeCategories ?? []}
              isPending={createTx.isPending}
              onSubmit={async (payload) => {
                try {
                  await createTx.mutateAsync(payload);
                  toast.success('Lançamento salvo');
                } catch (e) {
                  handleApiError(e);
                }
              }}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-lg">Lançamentos recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <FinanceTransactionsList
            transactions={transactions}
            accounts={accountList}
            expenseCategories={expenseCategories ?? []}
            incomeCategories={incomeCategories ?? []}
            isLoading={loadingTx}
            isUpdating={updateTx.isPending}
            isDeleting={deleteTx.isPending}
            onUpdate={async (id, body) => {
              try {
                await updateTx.mutateAsync({ transactionId: id, body });
                toast.success('Lançamento atualizado');
              } catch (e) {
                handleApiError(e);
              }
            }}
            onDelete={async (id) => {
              try {
                await deleteTx.mutateAsync(id);
                toast.success('Lançamento excluído');
              } catch (e) {
                handleApiError(e);
              }
            }}
          />
        </CardContent>
      </Card>
    </PageShell>
  );
};
