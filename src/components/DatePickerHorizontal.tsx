import * as React from 'react';
import { cn } from '@/lib/utils';

interface DatePickerHorizontalProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  className?: string;
}

export const DatePickerHorizontal = ({
  selectedDate,
  onDateChange,
  className,
}: DatePickerHorizontalProps) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Generate dates: 3 days before today, today, and 7 days after
  const dates = React.useMemo(() => {
    const datesArray: Date[] = [];
    for (let i = -3; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      datesArray.push(date);
    }
    return datesArray;
  }, [today]);

  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleDateString('pt-BR', { month: 'short' });
    const weekday = date.toLocaleDateString('pt-BR', { weekday: 'short' });
    return { day, month, weekday };
  };

  const isToday = (date: Date) => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <div className={cn('flex gap-4 overflow-x-auto pb-4', className)}>
      {dates.map((date) => {
        const { day, month, weekday } = formatDate(date);
        const selected = isSelected(date);
        const todayDate = isToday(date);
        const dateKey = date.toISOString();

        return (
          <button
            key={dateKey}
            type="button"
            onClick={() => onDateChange(date)}
            className={cn(
              'flex flex-col items-center justify-center min-w-[70px] px-4 py-3 rounded-2xl transition-all shrink-0',
              selected
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-card border border-input hover:bg-accent',
              todayDate && !selected && 'border-primary/50'
            )}
          >
            <span
              className={cn(
                'text-xs font-medium mb-1',
                selected ? 'text-primary-foreground/80' : 'text-muted-foreground'
              )}
            >
              {weekday}
            </span>
            <span
              className={cn(
                'text-lg font-bold',
                selected ? 'text-primary-foreground' : 'text-foreground'
              )}
            >
              {day}
            </span>
            <span
              className={cn(
                'text-xs mt-1',
                selected ? 'text-primary-foreground/80' : 'text-muted-foreground'
              )}
            >
              {month}
            </span>
          </button>
        );
      })}
    </div>
  );
};
