import type { ComponentProps } from 'react';
import { Input } from '@/components/ui/input';
import { sanitizeAmountInput } from '../lib/parseAmount';

type Props = Omit<ComponentProps<typeof Input>, 'type' | 'inputMode' | 'value' | 'onChange'> & {
  value: string;
  onChange: (value: string) => void;
};

export const FinanceAmountInput = ({ value, onChange, placeholder = '0,00', ...props }: Props) => (
  <Input
    type="text"
    inputMode="decimal"
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(sanitizeAmountInput(e.target.value))}
    {...props}
  />
);
