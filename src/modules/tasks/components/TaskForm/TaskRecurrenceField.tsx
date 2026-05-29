import type { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { formSelectClassName } from '@/lib/formSelect';
import {
  RECURRENCE_RULE_OPTIONS,
  type RecurrenceRule,
  recurrenceRuleLabels,
} from '@/lib/recurrenceConstants';
import { spacing } from '@/lib/spacing';
import type { CreateTaskFormData, UpdateTaskFormData } from '../../schemas/taskSchemas';

interface TaskRecurrenceFieldProps {
  register: UseFormRegister<CreateTaskFormData | UpdateTaskFormData>;
  watch: UseFormWatch<CreateTaskFormData | UpdateTaskFormData>;
  setValue: UseFormSetValue<CreateTaskFormData | UpdateTaskFormData>;
  errors: FieldErrors<CreateTaskFormData | UpdateTaskFormData>;
}

export const TaskRecurrenceField = ({
  register,
  watch,
  setValue,
  errors,
}: TaskRecurrenceFieldProps) => {
  const recurrenceEnabled = watch('recurrence_enabled') ?? false;
  const recurrenceRule = watch('recurrence_rule');

  const handleToggle = (checked: boolean) => {
    setValue('recurrence_enabled', checked, { shouldDirty: true });
    if (checked && !recurrenceRule) {
      setValue('recurrence_rule', 'weekly', { shouldDirty: true });
    }
    if (!checked) {
      setValue('recurrence_rule', undefined, { shouldDirty: true });
    }
  };

  return (
    <div className={`rounded-2xl border-2 border-input p-4 ${spacing.stackForm}`}>
      <div className={`flex items-center justify-between ${spacing.gapInlineLoose}`}>
        <div className={spacing.stackFieldHint}>
          <Label htmlFor="recurrence-enabled">Repetir tarefa</Label>
          <p className="text-sm text-muted-foreground">
            Ao concluir, a tarefa reabre com a próxima data automaticamente
          </p>
        </div>
        <button
          type="button"
          id="recurrence-enabled"
          onClick={() => handleToggle(!recurrenceEnabled)}
          className={`
            relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
            ${recurrenceEnabled ? 'bg-primary' : 'bg-muted'}
          `}
          role="switch"
          aria-checked={recurrenceEnabled}
        >
          <span
            className={`
              pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
              ${recurrenceEnabled ? 'translate-x-5' : 'translate-x-0'}
            `}
          />
        </button>
      </div>

      {recurrenceEnabled ? (
        <div className={spacing.stackField}>
          <Label htmlFor="recurrence-rule">Frequência</Label>
          <select
            id="recurrence-rule"
            className={formSelectClassName}
            value={recurrenceRule ?? 'weekly'}
            onChange={(e) =>
              setValue('recurrence_rule', e.target.value as RecurrenceRule, { shouldDirty: true })
            }
            aria-invalid={errors.recurrence_rule ? 'true' : 'false'}
          >
            {RECURRENCE_RULE_OPTIONS.map((rule) => (
              <option key={rule} value={rule}>
                {recurrenceRuleLabels[rule]}
              </option>
            ))}
          </select>
          <input type="hidden" {...register('recurrence_rule')} />
          {errors.recurrence_rule ? (
            <p className="text-sm text-destructive" role="alert">
              {errors.recurrence_rule.message}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
