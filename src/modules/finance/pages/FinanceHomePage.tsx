import { Wallet } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Loading } from '@/components/Loading';
import { PageShell } from '@/components/PageShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { spacing } from '@/lib/spacing';
import { useGroups } from '@/modules/groups/hooks/useGroups';
import {
  useCreateFinanceAccount,
  useCreateFinanceTransaction,
  useFinanceAccounts,
  useFinanceCategories,
  useFinanceDashboard,
  useFinanceTransactions,
} from '../hooks/useFinance';
import { formatMoneyFromCents } from '../lib/formatMoney';

const STORAGE_KEY = 'finance_selected_group_id';

export const FinanceHomePage = () => {
  const { data: groups, isLoading: loadingGroups } = useGroups();
  const [groupId, setGroupId] = useState<number | null>(null);
  const month = useMemo(() => new Date().toISOString().slice(0, 7), []);

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

  const { data: dashboard, isLoading: loadingDash } = useFinanceDashboard(groupId, month);
  const { data: accounts } = useFinanceAccounts(groupId);
  const { data: transactions, isLoading: loadingTx } = useFinanceTransactions(groupId);
  const { data: expenseCategories } = useFinanceCategories(groupId, 'expense');
  const { data: incomeCategories } = useFinanceCategories(groupId, 'income');
  const createAccount = useCreateFinanceAccount(groupId ?? 0);
  const createTx = useCreateFinanceTransaction(groupId ?? 0);

  const [newAccountName, setNewAccountName] = useState('');
  const [txType, setTxType] = useState<'expense' | 'income'>('expense');
  const [txAccountId, setTxAccountId] = useState<number | ''>('');
  const [txCategoryId, setTxCategoryId] = useState<number | ''>('');
  const [txAmount, setTxAmount] = useState('');
  const [txDescription, setTxDescription] = useState('');
  const [txVisibility, setTxVisibility] = useState<'household' | 'private'>('household');

  const categories = txType === 'expense' ? expenseCategories : incomeCategories;

  const handleCreateAccount = async () => {
    if (!groupId || !newAccountName.trim()) return;
    await createAccount.mutateAsync({ name: newAccountName.trim(), type: 'checking' });
    setNewAccountName('');
  };

  const handleCreateTransaction = async () => {
    if (!groupId || !txAccountId || !txCategoryId || !txAmount) return;
    const cents = Math.round(parseFloat(txAmount.replace(',', '.')) * 100);
    if (Number.isNaN(cents) || cents <= 0) return;
    await createTx.mutateAsync({
      type: txType,
      account_id: Number(txAccountId),
      category_id: Number(txCategoryId),
      amount_cents: cents,
      description: txDescription,
      date: new Date().toISOString().slice(0, 10),
      visibility: txVisibility,
    });
    setTxAmount('');
    setTxDescription('');
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

  return (
    <PageShell size="wide">
      <div
        className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${spacing.gapInline}`}
      >
        <div className={`flex items-center ${spacing.gapInline}`}>
          <Wallet className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Finanças</h1>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Label htmlFor="finance-group" className="sr-only">
            Grupo
          </Label>
          <select
            id="finance-group"
            className="h-10 rounded-xl border border-input bg-background px-3 text-sm"
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

      <div className={`grid gap-6 lg:grid-cols-2 ${spacing.sectionGap}`}>
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-lg">Contas</CardTitle>
          </CardHeader>
          <CardContent className={spacing.stackForm}>
            <ul className="space-y-2 text-sm">
              {(accounts ?? dashboard?.accounts ?? []).map((a) => (
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
            <CardTitle className="text-lg">Novo lançamento</CardTitle>
          </CardHeader>
          <CardContent className={spacing.stackForm}>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={txType === 'expense' ? 'default' : 'outline'}
                className="rounded-xl flex-1"
                onClick={() => {
                  setTxType('expense');
                  setTxCategoryId('');
                }}
              >
                Despesa
              </Button>
              <Button
                type="button"
                variant={txType === 'income' ? 'default' : 'outline'}
                className="rounded-xl flex-1"
                onClick={() => {
                  setTxType('income');
                  setTxCategoryId('');
                }}
              >
                Receita
              </Button>
            </div>
            <div>
              <Label>Conta</Label>
              <select
                className="mt-1 flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
                value={txAccountId}
                onChange={(e) => setTxAccountId(Number(e.target.value))}
              >
                <option value="">Selecione</option>
                {(accounts ?? []).map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Categoria</Label>
              <select
                className="mt-1 flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
                value={txCategoryId}
                onChange={(e) => setTxCategoryId(Number(e.target.value))}
              >
                <option value="">Selecione</option>
                {(categories ?? []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Valor (R$)</Label>
              <Input
                type="text"
                inputMode="decimal"
                placeholder="0,00"
                className="rounded-xl mt-1"
                value={txAmount}
                onChange={(e) => setTxAmount(e.target.value)}
              />
            </div>
            <div>
              <Label>Descrição</Label>
              <Input
                className="rounded-xl mt-1"
                value={txDescription}
                onChange={(e) => setTxDescription(e.target.value)}
              />
            </div>
            <div>
              <Label>Visibilidade</Label>
              <select
                className="mt-1 flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
                value={txVisibility}
                onChange={(e) => setTxVisibility(e.target.value as 'household' | 'private')}
              >
                <option value="household">Casa (grupo)</option>
                <option value="private">Só eu</option>
              </select>
            </div>
            <Button
              type="button"
              className="w-full rounded-xl"
              disabled={createTx.isPending || !accounts?.length}
              onClick={handleCreateTransaction}
            >
              Salvar lançamento
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-lg">Lançamentos recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingTx ? (
            <Loading />
          ) : (
            <ul className="divide-y text-sm">
              {(transactions ?? []).slice(0, 20).map((tx) => (
                <li key={tx.id} className="flex justify-between gap-2 py-3">
                  <div>
                    <p className="font-medium">{tx.description || tx.type}</p>
                    <p className="text-muted-foreground text-xs">
                      {tx.date?.slice(0, 10)} · {tx.visibility === 'private' ? 'Privado' : 'Casa'}
                    </p>
                  </div>
                  <span
                    className={
                      tx.type === 'income'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }
                  >
                    {tx.type === 'income' ? '+' : '-'}
                    {formatMoneyFromCents(tx.amount_cents)}
                  </span>
                </li>
              ))}
              {!transactions?.length && (
                <li className="py-4 text-muted-foreground">Nenhum lançamento ainda.</li>
              )}
            </ul>
          )}
        </CardContent>
      </Card>
    </PageShell>
  );
};
