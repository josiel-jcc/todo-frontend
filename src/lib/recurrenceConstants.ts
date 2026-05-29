import type { components } from '@/api';

export type RecurrenceRule = components['schemas']['models.RecurrenceRule'];

export const RECURRENCE_RULE_OPTIONS: RecurrenceRule[] = ['daily', 'weekly', 'monthly'];

export const recurrenceRuleLabels: Record<RecurrenceRule, string> = {
  daily: 'Diária',
  weekly: 'Semanal',
  monthly: 'Mensal',
};
