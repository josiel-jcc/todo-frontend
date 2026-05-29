import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { FinanceAccount, FinanceCategory, FinanceTransaction } from '@/api/finance';
import { ConfirmDialog } from '@/components';
import { FormDateField } from '@/components/FormDateField';
import { Loading } from '@/components/Loading';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { spacing } from '@/lib/spacing';
import { formatMoneyFromCents } from '../lib/formatMoney';
import { centsToAmountInput, parseAmountToCents } from '../lib/parseAmount';
import { FinanceAmountInput } from './FinanceAmountInput';
import { financeSelectClassName } from './financeSelectClass';

type Props = {
  transactions: FinanceTransaction[] | undefined;
  accounts: FinanceAccount[];
  expenseCategories: FinanceCategory[];
  incomeCategories: FinanceCategory[];
  isLoading: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  onUpdate: (
    id: number,
    body: {
      amount_cents?: number;
      description?: string;
      date?: string;
      visibility?: 'household' | 'private';
      category_id?: number;
    }
  ) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

const typeLabel: Record<FinanceTransaction['type'], string> = {
  income: 'Receita',
  expense: 'Despesa',
  transfer: 'Transferência',
};

export const FinanceTransactionsList = ({
  transactions,
  accounts,
  expenseCategories,
  incomeCategories,
  isLoading,
  isUpdating,
  isDeleting,
  onUpdate,
  onDelete,
}: Props) => {
  const [editing, setEditing] = useState<FinanceTransaction | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState<'household' | 'private'>('household');
  const [categoryId, setCategoryId] = useState<number | ''>('');

  const accountName = (id: number) => accounts.find((a) => a.id === id)?.name ?? `#${id}`;

  const openEdit = (tx: FinanceTransaction) => {
    setEditing(tx);
    setAmount(centsToAmountInput(tx.amount_cents));
    setDescription(tx.description ?? '');
    setDate(tx.date?.slice(0, 10) ?? '');
    setVisibility(tx.visibility);
    setCategoryId(tx.category_id ?? '');
  };

  const closeEdit = () => setEditing(null);

  const handleSaveEdit = async () => {
    if (!editing) return;
    const cents = parseAmountToCents(amount);
    if (cents == null) return;
    await onUpdate(editing.id, {
      amount_cents: cents,
      description,
      date,
      visibility,
      ...(editing.type !== 'transfer' && categoryId ? { category_id: Number(categoryId) } : {}),
    });
    closeEdit();
  };

  const categories = editing?.type === 'income' ? incomeCategories : expenseCategories;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <ul className="divide-y text-sm">
        {(transactions ?? []).slice(0, 30).map((tx) => (
          <li key={tx.id} className="flex items-start justify-between gap-2 py-3">
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate">{tx.description || typeLabel[tx.type]}</p>
              <p className="text-muted-foreground text-xs">
                {typeLabel[tx.type]}
                {tx.type === 'transfer' && tx.transfer_account_id
                  ? ` · ${accountName(tx.account_id)} → ${accountName(tx.transfer_account_id)}`
                  : ''}
                {' · '}
                {tx.date?.slice(0, 10)} · {tx.visibility === 'private' ? 'Privado' : 'Casa'}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <span
                className={
                  tx.type === 'income'
                    ? 'text-green-600 dark:text-green-400 mr-1'
                    : tx.type === 'transfer'
                      ? 'text-blue-600 dark:text-blue-400 mr-1'
                      : 'text-red-600 dark:text-red-400 mr-1'
                }
              >
                {tx.type === 'income' ? '+' : tx.type === 'transfer' ? '↔' : '-'}
                {formatMoneyFromCents(tx.amount_cents)}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg"
                aria-label="Editar"
                onClick={() => openEdit(tx)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-destructive"
                aria-label="Excluir"
                onClick={() => setDeleteId(tx.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </li>
        ))}
        {!transactions?.length && (
          <li className="py-4 text-muted-foreground">Nenhum lançamento ainda.</li>
        )}
      </ul>

      <Modal isOpen={editing != null} onClose={closeEdit} title="Editar lançamento">
        {editing && (
          <div className={spacing.stackForm}>
            <p className="text-sm text-muted-foreground">{typeLabel[editing.type]}</p>
            <div className={spacing.stackField}>
              <Label htmlFor="edit-tx-amount">Valor (R$)</Label>
              <FinanceAmountInput id="edit-tx-amount" value={amount} onChange={setAmount} />
            </div>
            <div className={spacing.stackField}>
              <Label htmlFor="edit-tx-desc">Descrição</Label>
              <Input
                id="edit-tx-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <FormDateField
              id="edit-tx-date"
              label="Data"
              value={date}
              onChange={setDate}
              required
            />
            {editing.type !== 'transfer' && (
              <div className={spacing.stackField}>
                <Label htmlFor="edit-tx-category">Categoria</Label>
                <select
                  id="edit-tx-category"
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
              <Label htmlFor="edit-tx-vis">Visibilidade</Label>
              <select
                id="edit-tx-vis"
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
              disabled={isUpdating}
              onClick={handleSaveEdit}
            >
              Salvar alterações
            </Button>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={deleteId != null}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId == null) return;
          await onDelete(deleteId);
          setDeleteId(null);
        }}
        title="Excluir lançamento?"
        description="Esta ação não pode ser desfeita."
        confirmText="Excluir"
        variant="destructive"
        isLoading={isDeleting}
      />
    </>
  );
};
