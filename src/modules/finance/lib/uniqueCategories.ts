import type { FinanceCategory } from '@/api/finance';

/** Removes duplicate categories (same id or same kind+name). Prefers system rows, then lowest id. */
export const uniqueFinanceCategories = (categories: FinanceCategory[]): FinanceCategory[] => {
  const byId = new Map<number, FinanceCategory>();
  for (const cat of categories) {
    if (!byId.has(cat.id)) {
      byId.set(cat.id, cat);
    }
  }

  const byKey = new Map<string, FinanceCategory>();
  for (const cat of byId.values()) {
    const key = `${cat.kind}\0${cat.name.trim().toLowerCase()}`;
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, cat);
      continue;
    }
    const keep =
      (cat.is_system && !existing.is_system) ||
      (cat.is_system === existing.is_system && cat.id < existing.id)
        ? cat
        : existing;
    byKey.set(key, keep);
  }

  return Array.from(byKey.values()).sort((a, b) => {
    if (a.is_system !== b.is_system) {
      return a.is_system ? -1 : 1;
    }
    return a.name.localeCompare(b.name, 'pt-BR');
  });
};
