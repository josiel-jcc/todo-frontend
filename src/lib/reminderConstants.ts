export const REMINDER_MINUTES_OPTIONS = [5, 10, 15, 30, 60] as const;

export type ReminderMinutes = (typeof REMINDER_MINUTES_OPTIONS)[number];

export const DEFAULT_REMINDER_MINUTES: ReminderMinutes = 10;

export function isReminderMinutes(value: number): value is ReminderMinutes {
  return (REMINDER_MINUTES_OPTIONS as readonly number[]).includes(value);
}

export function formatReminderMinutesLabel(minutes: number): string {
  if (minutes === 1) return '1 minuto';
  return `${minutes} minutos`;
}
