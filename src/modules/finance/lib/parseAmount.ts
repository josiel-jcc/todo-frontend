export const parseAmountToCents = (value: string): number | null => {
  const normalized = value.trim().replace(',', '.');
  if (!normalized) return null;
  const amount = parseFloat(normalized);
  if (Number.isNaN(amount) || amount <= 0) return null;
  return Math.round(amount * 100);
};

export const centsToAmountInput = (cents: number): string =>
  (cents / 100).toFixed(2).replace('.', ',');
