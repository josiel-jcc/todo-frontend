import { useState } from 'react';
import type { FinanceAccount, FinanceCategory } from '@/api/finance';
import { FormDateField } from '@/components/FormDateField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { spacing } from '@/lib/spacing';
import { parseAmountToCents } from '../lib/parseAmount';
import { FinanceAmountInput } from './FinanceAmountInput';
import { financeSelectClassName } from './financeSelectClass';

export type TransactionFormType = 'expense' | 'income' | 'transfer';

type Props = {
  accounts: FinanceAccount[];
  expenseCategories: FinanceCategory[];
  incomeCategories: FinanceCategory[];
  isPending: boolean;
  onSubmit: (payload: {
    type: TransactionFormType;
    account_id: number;
    transfer_account_id?: number;
    category_id?: number;
    amount_cents: number;
    description: string;
    date: string;
    visibility: 'household' | 'private';
  }) => Promise<void>;
};

export const FinanceTransactionForm = ({
  accounts,
  expenseCategories,
  incomeCategories,
  isPending,
  onSubmit,
}: Props) => {
  const [txType, setTxType] = useState<TransactionFormType>('expense');
  const [accountId, setAccountId] = useState<number | ''>('');
  const [transferAccountId, setTransferAccountId] = useState<number | ''>('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'household' | 'private'>('household');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const categories = txType === 'income' ? incomeCategories : expenseCategories;

  const resetTypeFields = (type: TransactionFormType) => {
    setTxType(type);
    setCategoryId('');
    if (type === 'transfer') {
      setTransferAccountId('');
    }
  };

  const handleSubmit = async () => {
    if (!accountId || !amount) return;
    const cents = parseAmountToCents(amount);
    if (cents == null) return;

    if (txType === 'transfer') {
      if (!transferAccountId || transferAccountId === accountId) return;
      await onSubmit({
        type: 'transfer',
        account_id: Number(accountId),
        transfer_account_id: Number(transferAccountId),
        amount_cents: cents,
        description,
        date,
        visibility,
      });
    } else {
      if (!categoryId) return;
      await onSubmit({
        type: txType,
        account_id: Number(accountId),
        category_id: Number(categoryId),
        amount_cents: cents,
        description,
        date,
        visibility,
      });
    }

    setAmount('');
    setDescription('');
    setCategoryId('');
    setTransferAccountId('');
  };

  return (
    <div className={spacing.stackForm}>
      <div className={`flex ${spacing.gapInline}`}>
        {(['expense', 'income', 'transfer'] as const).map((type) => (
          <Button
            key={type}
            type="button"
            variant={txType === type ? 'default' : 'outline'}
            className="rounded-xl flex-1 text-xs sm:text-sm"
            onClick={() => resetTypeFields(type)}
          >
            {type === 'expense' ? 'Despesa' : type === 'income' ? 'Receita' : 'Transfer.'}
          </Button>
        ))}
      </div>

      <FormDateField id="tx-date" label="Data" value={date} onChange={setDate} required />

      <div className={spacing.stackField}>
        <Label htmlFor="tx-account">{txType === 'transfer' ? 'Conta origem' : 'Conta'}</Label>
        <select
          id="tx-account"
          className={financeSelectClassName}
          value={accountId}
          onChange={(e) => setAccountId(Number(e.target.value))}
        >
          <option value="">Selecione</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      {txType === 'transfer' && (
        <div className={spacing.stackField}>
          <Label htmlFor="tx-transfer">Conta destino</Label>
          <select
            id="tx-transfer"
            className={financeSelectClassName}
            value={transferAccountId}
            onChange={(e) => setTransferAccountId(Number(e.target.value))}
          >
            <option value="">Selecione</option>
            {accounts
              .filter((a) => a.id !== accountId)
              .map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
          </select>
        </div>
      )}

      {txType !== 'transfer' && (
        <div className={spacing.stackField}>
          <Label htmlFor="tx-category">Categoria</Label>
          <select
            id="tx-category"
            className={financeSelectClassName}
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
          >
            <option value="">Selecione</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className={spacing.stackField}>
        <Label htmlFor="tx-amount">Valor (R$)</Label>
        <FinanceAmountInput id="tx-amount" value={amount} onChange={setAmount} />
      </div>

      <div className={spacing.stackField}>
        <Label htmlFor="tx-desc">Descrição</Label>
        <Input id="tx-desc" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className={spacing.stackField}>
        <Label htmlFor="tx-vis">Visibilidade</Label>
        <select
          id="tx-vis"
          className={financeSelectClassName}
          value={visibility}
          onChange={(e) => setVisibility(e.target.value as 'household' | 'private')}
        >
          <option value="household">Casa (grupo)</option>
          <option value="private">Só eu</option>
        </select>
      </div>

      <Button
        type="button"
        className="w-full rounded-xl"
        disabled={isPending || !accounts.length}
        onClick={handleSubmit}
      >
        Salvar lançamento
      </Button>
    </div>
  );
};
