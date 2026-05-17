import { format, isValid, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const DATETIME_LOCAL_PATTERN = "yyyy-MM-dd'T'HH:mm";

export function parseDueDateValue(value: string): { date?: Date; time: string } {
  if (!value) {
    return { date: undefined, time: '09:00' };
  }

  const fromLocal = parse(value, DATETIME_LOCAL_PATTERN, new Date());
  if (isValid(fromLocal)) {
    return {
      date: fromLocal,
      time: format(fromLocal, 'HH:mm'),
    };
  }

  const parsed = new Date(value);
  if (isValid(parsed)) {
    return {
      date: parsed,
      time: format(parsed, 'HH:mm'),
    };
  }

  return { date: undefined, time: '09:00' };
}

export function buildDueDateValue(date: Date, time: string): string {
  const [hours = 9, minutes = 0] = time.split(':').map(Number);
  const combined = new Date(date);
  combined.setHours(hours, minutes, 0, 0);
  return format(combined, DATETIME_LOCAL_PATTERN);
}

export function formatDueDateLabel(value: string): string {
  const { date, time } = parseDueDateValue(value);
  if (!date) {
    return 'Selecione data e hora';
  }

  return `${format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} às ${time}`;
}

export function getDefaultDueDateValue(): string {
  const now = new Date();
  const due = new Date(now);
  due.setHours(18, 0, 0, 0);

  if (due <= now) {
    due.setDate(due.getDate() + 1);
    due.setHours(9, 0, 0, 0);
  }

  return buildDueDateValue(due, format(due, 'HH:mm'));
}

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
