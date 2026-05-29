/** Keeps only digits and a single comma with up to 2 decimal places (pt-BR). */
export const sanitizeAmountInput = (value: string): string => {
  const cleaned = value.replace(/[^\d,]/g, '');
  const commaIndex = cleaned.indexOf(',');
  if (commaIndex === -1) {
    return cleaned;
  }
  const intPart = cleaned.slice(0, commaIndex);
  const decPart = cleaned
    .slice(commaIndex + 1)
    .replace(/,/g, '')
    .slice(0, 2);
  return `${intPart},${decPart}`;
};

export const parseAmountToCents = (value: string): number | null => {
  const normalized = value.trim().replace(',', '.');
  if (!normalized) return null;
  const amount = parseFloat(normalized);
  if (Number.isNaN(amount) || amount <= 0) return null;
  return Math.round(amount * 100);
};

export const centsToAmountInput = (cents: number): string =>
  (cents / 100).toFixed(2).replace('.', ',');
