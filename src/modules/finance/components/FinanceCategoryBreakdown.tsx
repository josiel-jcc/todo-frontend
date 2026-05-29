import type { FinanceCategoryBreakdown as BreakdownRow } from '@/api/finance';
import { spacing } from '@/lib/spacing';
import { formatMoneyFromCents } from '../lib/formatMoney';

type Props = {
  rows: BreakdownRow[];
};

const barColor = (percent?: number) => {
  if (percent == null) return 'bg-primary';
  if (percent > 100) return 'bg-red-600 dark:bg-red-500';
  if (percent >= 85) return 'bg-amber-500';
  return 'bg-primary';
};

export const FinanceCategoryBreakdown = ({ rows }: Props) => {
  const expenses = rows.filter((r) => r.kind === 'expense');
  if (!expenses.length) {
    return <p className="text-sm text-muted-foreground">Nenhuma despesa neste mês.</p>;
  }

  return (
    <ul className={spacing.stackList}>
      {expenses.map((row) => {
        const percent = row.percent_used ?? 0;
        const width = row.budget_cents != null ? Math.min(percent, 100) : 0;
        return (
          <li key={row.category_id} className={spacing.stackField}>
            <div className="flex justify-between gap-2 text-sm">
              <span className="font-medium">{row.name}</span>
              <span className="text-muted-foreground shrink-0">
                {formatMoneyFromCents(row.total_cents)}
                {row.budget_cents != null && (
                  <span> / {formatMoneyFromCents(row.budget_cents)}</span>
                )}
              </span>
            </div>
            {row.budget_cents != null && row.budget_cents > 0 ? (
              <>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all ${barColor(row.percent_used)}`}
                    style={{ width: `${width}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {percent.toFixed(0)}% do orçamento
                  {percent > 100 && ' — acima do limite'}
                </p>
              </>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
};
