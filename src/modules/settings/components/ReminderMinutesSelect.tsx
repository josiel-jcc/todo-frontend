import { Label } from '@/components/ui/label';
import { formSelectClassName } from '@/lib/formSelect';
import {
  DEFAULT_REMINDER_MINUTES,
  formatReminderMinutesLabel,
  isReminderMinutes,
  REMINDER_MINUTES_OPTIONS,
  type ReminderMinutes,
} from '@/lib/reminderConstants';

interface ReminderMinutesSelectProps {
  id?: string;
  value: number;
  onChange: (minutes: ReminderMinutes) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
}

export const ReminderMinutesSelect = ({
  id = 'reminder-minutes',
  value,
  onChange,
  disabled,
  label = 'Lembrar antes do vencimento',
  description,
}: ReminderMinutesSelectProps) => {
  const selected = isReminderMinutes(value) ? value : DEFAULT_REMINDER_MINUTES;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      <select
        id={id}
        className={formSelectClassName}
        value={selected}
        onChange={(e) => onChange(Number(e.target.value) as ReminderMinutes)}
        disabled={disabled}
      >
        {REMINDER_MINUTES_OPTIONS.map((minutes) => (
          <option key={minutes} value={minutes}>
            {formatReminderMinutesLabel(minutes)}
          </option>
        ))}
      </select>
    </div>
  );
};
