import { z } from 'zod';
import { REMINDER_MINUTES_OPTIONS } from '@/lib/reminderConstants';

/**
 * Task type enum
 */
export const taskTypeSchema = z.enum(['casa', 'trabalho', 'lazer', 'saude']);

const reminderMinutesSchema = z.union([
  z.literal(REMINDER_MINUTES_OPTIONS[0]),
  z.literal(REMINDER_MINUTES_OPTIONS[1]),
  z.literal(REMINDER_MINUTES_OPTIONS[2]),
  z.literal(REMINDER_MINUTES_OPTIONS[3]),
  z.literal(REMINDER_MINUTES_OPTIONS[4]),
]);

/**
 * Task priority enum
 */
export const taskPrioritySchema = z.enum(['baixa', 'media', 'alta', 'urgente']);

export const recurrenceRuleSchema = z.enum(['daily', 'weekly', 'monthly']);

/**
 * Create task form validation schema
 */
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'O título é obrigatório')
    .max(255, 'O título deve ter no máximo 255 caracteres'),
  description: z
    .string()
    .min(1, 'A descrição é obrigatória')
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres'),
  type: taskTypeSchema,
  priority: taskPrioritySchema.optional(),
  due_date: z.string().min(1, 'A data de vencimento é obrigatória'),
  tag_ids: z.array(z.number()).optional().default([]),
  user_id: z.number().optional(),
  customReminderEnabled: z.boolean().optional().default(false),
  reminder_minutes_before: reminderMinutesSchema.optional(),
  recurrence_enabled: z.boolean().optional().default(false),
  recurrence_rule: recurrenceRuleSchema.optional(),
});

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;

/**
 * Update task form validation schema
 */
export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'O título é obrigatório')
    .max(255, 'O título deve ter no máximo 255 caracteres'),
  description: z
    .string()
    .min(1, 'A descrição é obrigatória')
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres'),
  type: taskTypeSchema,
  priority: taskPrioritySchema,
  due_date: z.string().min(1, 'A data de vencimento é obrigatória'),
  completed: z.boolean(),
  tag_ids: z.array(z.number()).optional().default([]),
  customReminderEnabled: z.boolean().optional().default(false),
  reminder_minutes_before: reminderMinutesSchema.optional(),
  recurrence_enabled: z.boolean().optional().default(false),
  recurrence_rule: recurrenceRuleSchema.optional(),
});

export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;

/**
 * Task filters schema
 */
export const taskFiltersSchema = z.object({
  type: taskTypeSchema.optional(),
  completed: z.boolean().optional(),
  search: z.string().optional(),
  period: z.enum(['overdue', 'today', 'this_week', 'this_month']).optional(),
  sort_by: z.enum(['created_at', 'due_date', 'title']).optional(),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type TaskFilters = z.infer<typeof taskFiltersSchema>;
