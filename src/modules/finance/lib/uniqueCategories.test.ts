import { describe, expect, it } from 'vitest';
import type { FinanceCategory } from '@/api/finance';
import { uniqueFinanceCategories } from './uniqueCategories';

const cat = (
  id: number,
  name: string,
  kind: 'income' | 'expense',
  is_system = false
): FinanceCategory => ({
  id,
  group_id: 1,
  name,
  kind,
  is_system,
});

describe('uniqueFinanceCategories', () => {
  it('removes duplicate ids and duplicate names', () => {
    const input = [
      cat(1, 'Alimentação', 'expense', true),
      cat(1, 'Alimentação', 'expense', true),
      cat(2, 'Alimentação', 'expense', false),
      cat(3, 'Transporte', 'expense', true),
    ];
    const result = uniqueFinanceCategories(input);
    expect(result).toHaveLength(2);
    expect(result.map((c) => c.id).sort()).toEqual([1, 3]);
  });

  it('prefers system category when names collide', () => {
    const input = [cat(10, 'Moradia', 'expense', false), cat(5, 'Moradia', 'expense', true)];
    const result = uniqueFinanceCategories(input);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(5);
  });
});
