import { format, isValid, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { addDays, startOfDay } from '@/lib/dueDateUtils';
import { spacing } from '@/lib/spacing';
import { cn } from '@/lib/utils';

const DATE_PATTERN = 'yyyy-MM-dd';

function parseDateValue(value: string): Date | undefined {
  if (!value) return undefined;
  const parsed = parse(value, DATE_PATTERN, new Date());
  if (isValid(parsed)) return startOfDay(parsed);
  const fallback = new Date(value);
  return isValid(fallback) ? startOfDay(fallback) : undefined;
}

function formatDateValue(date: Date): string {
  return format(startOfDay(date), DATE_PATTERN);
}

function formatDateLabel(value: string): string {
  const date = parseDateValue(value);
  if (!date) return 'Selecione uma data';
  return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
}

const quickOptions = [
  { label: 'Hoje', getDate: () => startOfDay(new Date()) },
  { label: 'Ontem', getDate: () => startOfDay(addDays(new Date(), -1)) },
  { label: 'Amanhã', getDate: () => startOfDay(addDays(new Date(), 1)) },
] as const;

interface FormDateFieldProps {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export const FormDateField = ({
  id,
  label,
  value,
  onChange,
  error,
  disabled,
  required,
}: FormDateFieldProps) => {
  const [open, setOpen] = useState(false);
  const date = parseDateValue(value);

  const updateDate = (selected?: Date) => {
    if (!selected) return;
    onChange(formatDateValue(selected));
    setOpen(false);
  };

  const applyQuickDate = (getDate: () => Date) => {
    onChange(formatDateValue(getDate()));
    setOpen(false);
  };

  return (
    <div className={spacing.stackField}>
      <Label htmlFor={id}>
        {label}
        {required ? ' *' : ''}
      </Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            aria-invalid={error ? 'true' : 'false'}
            className={cn(
              'h-10 w-full justify-start rounded-2xl border-2 px-4 text-left font-normal',
              !date && 'text-muted-foreground',
              error && 'border-destructive'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
            <span className="truncate">{formatDateLabel(value)}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex flex-wrap gap-2 border-b p-3">
            {quickOptions.map((option) => (
              <Button
                key={option.label}
                type="button"
                variant="secondary"
                size="sm"
                className="rounded-xl"
                onClick={() => applyQuickDate(option.getDate)}
              >
                {option.label}
              </Button>
            ))}
          </div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={updateDate}
            defaultMonth={date ?? new Date()}
          />
        </PopoverContent>
      </Popover>

      {date && (
        <p className="text-xs text-muted-foreground">
          {format(date, "EEEE, dd 'de' MMMM", { locale: ptBR })}
        </p>
      )}

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
