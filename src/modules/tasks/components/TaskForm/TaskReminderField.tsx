import type { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import {
  DEFAULT_REMINDER_MINUTES,
  formatReminderMinutesLabel,
  isReminderMinutes,
  REMINDER_MINUTES_OPTIONS,
  type ReminderMinutes,
} from '@/lib/reminderConstants';
import type { CreateTaskFormData, UpdateTaskFormData } from '../../schemas/taskSchemas';

interface TaskReminderFieldProps {
  register: UseFormRegister<CreateTaskFormData | UpdateTaskFormData>;
  watch: UseFormWatch<CreateTaskFormData | UpdateTaskFormData>;
  setValue: UseFormSetValue<CreateTaskFormData | UpdateTaskFormData>;
  errors: FieldErrors<CreateTaskFormData | UpdateTaskFormData>;
  userDefaultMinutes?: number;
}

export const TaskReminderField = ({
  register,
  watch,
  setValue,
  errors,
  userDefaultMinutes = DEFAULT_REMINDER_MINUTES,
}: TaskReminderFieldProps) => {
  const customEnabled = watch('customReminderEnabled') ?? false;
  const selectedMinutes = watch('reminder_minutes_before');
  const defaultLabel = isReminderMinutes(userDefaultMinutes)
    ? formatReminderMinutesLabel(userDefaultMinutes)
    : formatReminderMinutesLabel(DEFAULT_REMINDER_MINUTES);

  const handleToggle = (checked: boolean) => {
    setValue('customReminderEnabled', checked, { shouldDirty: true });
    if (checked && selectedMinutes === undefined) {
      setValue(
        'reminder_minutes_before',
        isReminderMinutes(userDefaultMinutes) ? userDefaultMinutes : DEFAULT_REMINDER_MINUTES,
        { shouldDirty: true }
      );
    }
  };

  return (
    <div className="space-y-3 rounded-2xl border-2 border-input p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <Label htmlFor="custom-reminder">Lembrete personalizado</Label>
          <p className="text-sm text-muted-foreground">
            {customEnabled
              ? 'Antecedência específica para esta tarefa'
              : `Usar padrão da conta (${defaultLabel} antes)`}
          </p>
        </div>
        <button
          type="button"
          id="custom-reminder"
          onClick={() => handleToggle(!customEnabled)}
          className={`
            relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
            ${customEnabled ? 'bg-primary' : 'bg-muted'}
          `}
          role="switch"
          aria-checked={customEnabled}
        >
          <span
            className={`
              pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
              ${customEnabled ? 'translate-x-5' : 'translate-x-0'}
            `}
          />
        </button>
      </div>

      {customEnabled ? (
        <div className="space-y-2">
          <Label htmlFor="task-reminder-minutes">Antecedência do lembrete</Label>
          <select
            id="task-reminder-minutes"
            className="flex h-10 w-full rounded-2xl border-2 border-input bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all"
            {...register('reminder_minutes_before', { valueAsNumber: true })}
            aria-invalid={errors.reminder_minutes_before ? 'true' : 'false'}
          >
            {REMINDER_MINUTES_OPTIONS.map((minutes) => (
              <option key={minutes} value={minutes}>
                {formatReminderMinutesLabel(minutes)}
              </option>
            ))}
          </select>
          {errors.reminder_minutes_before ? (
            <p className="text-sm text-destructive" role="alert">
              {errors.reminder_minutes_before.message}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
