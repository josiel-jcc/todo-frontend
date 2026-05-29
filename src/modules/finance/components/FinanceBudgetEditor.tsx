import { useEffect, useState } from 'react';
import type { FinanceCategory, FinanceCategoryBudget } from '@/api/finance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { spacing } from '@/lib/spacing';
import { centsToAmountInput, parseAmountToCents } from '../lib/parseAmount';

type Props = {
  categories: FinanceCategory[];
  budgets: FinanceCategoryBudget[] | undefined;
  isPending: boolean;
  onSave: (items: { category_id: number; limit_cents: number }[]) => Promise<void>;
};

export const FinanceBudgetEditor = ({ categories, budgets, isPending, onSave }: Props) => {
  const [limits, setLimits] = useState<Record<number, string>>({});

  useEffect(() => {
    const next: Record<number, string> = {};
    for (const cat of categories) {
      const existing = budgets?.find((b) => b.category_id === cat.id);
      next[cat.id] = existing ? centsToAmountInput(existing.limit_cents) : '';
    }
    setLimits(next);
  }, [categories, budgets]);

  const handleSave = async () => {
    const items: { category_id: number; limit_cents: number }[] = [];
    for (const cat of categories) {
      const raw = limits[cat.id]?.trim();
      if (!raw) continue;
      const cents = parseAmountToCents(raw);
      if (cents == null) continue;
      items.push({ category_id: cat.id, limit_cents: cents });
    }
    await onSave(items);
  };

  if (!categories.length) {
    return <p className="text-sm text-muted-foreground">Nenhuma categoria de despesa.</p>;
  }

  return (
    <div className={spacing.stackForm}>
      <ul className={spacing.stackList}>
        {categories.map((cat) => (
          <li key={cat.id} className={spacing.stackField}>
            <Label htmlFor={`budget-${cat.id}`} className="text-sm">
              {cat.name}
            </Label>
            <Input
              id={`budget-${cat.id}`}
              type="text"
              inputMode="decimal"
              placeholder="0,00"
              className="rounded-xl"
              value={limits[cat.id] ?? ''}
              onChange={(e) => setLimits((prev) => ({ ...prev, [cat.id]: e.target.value }))}
            />
          </li>
        ))}
      </ul>
      <Button
        type="button"
        className="w-full rounded-xl"
        disabled={isPending}
        onClick={() => void handleSave()}
      >
        Salvar orçamentos
      </Button>
    </div>
  );
};
