import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Clock } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  addDays,
  buildDueDateValue,
  formatDueDateLabel,
  parseDueDateValue,
  startOfDay,
} from '@/lib/dueDateUtils';
import { cn } from '@/lib/utils';

interface TaskFormDueDateFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

const quickOptions = [
  { label: 'Hoje', getDate: () => startOfDay(new Date()) },
  { label: 'Amanhã', getDate: () => startOfDay(addDays(new Date(), 1)) },
  { label: 'Em 7 dias', getDate: () => startOfDay(addDays(new Date(), 7)) },
] as const;

function DueDateQuickActions({ onSelect }: { onSelect: (getDate: () => Date) => void }) {
  return (
    <div className="flex flex-wrap gap-2 border-b p-3">
      {quickOptions.map((option) => (
        <Button
          key={option.label}
          type="button"
          variant="secondary"
          size="sm"
          className="rounded-xl"
          onClick={() => onSelect(option.getDate)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}

function DueDateTimeInput({
  time,
  disabled,
  onTimeChange,
}: {
  time: string;
  disabled?: boolean;
  onTimeChange: (time: string) => void;
}) {
  return (
    <div className="relative sm:w-36">
      <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="time"
        value={time}
        disabled={disabled}
        onChange={(e) => onTimeChange(e.target.value)}
        className="rounded-2xl border-2 pl-10"
        aria-label="Horário de vencimento"
      />
    </div>
  );
}

export const TaskFormDueDateField = ({
  value,
  onChange,
  error,
  disabled,
}: TaskFormDueDateFieldProps) => {
  const [open, setOpen] = useState(false);
  const { date, time } = parseDueDateValue(value);

  const updateDate = (selected?: Date) => {
    if (!selected) return;
    onChange(buildDueDateValue(selected, time));
    setOpen(false);
  };

  const updateTime = (newTime: string) => {
    const baseDate = date ?? startOfDay(new Date());
    onChange(buildDueDateValue(baseDate, newTime));
  };

  const applyQuickDate = (getDate: () => Date) => {
    onChange(buildDueDateValue(getDate(), time));
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      <Label>Data de Vencimento *</Label>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              aria-invalid={error ? 'true' : 'false'}
              className={cn(
                'h-10 w-full justify-start rounded-2xl border-2 px-4 text-left font-normal sm:flex-1',
                !date && 'text-muted-foreground',
                error && 'border-destructive'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
              <span className="truncate">{formatDueDateLabel(value)}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <DueDateQuickActions onSelect={applyQuickDate} />
            <Calendar
              mode="single"
              selected={date}
              onSelect={updateDate}
              disabled={{ before: startOfDay(new Date()) }}
              defaultMonth={date ?? new Date()}
            />
          </PopoverContent>
        </Popover>

        <DueDateTimeInput time={time} disabled={disabled} onTimeChange={updateTime} />
      </div>

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
