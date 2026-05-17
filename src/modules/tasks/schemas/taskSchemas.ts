import { z } from 'zod';

/**
 * Task type enum
 */
export const taskTypeSchema = z.enum(['casa', 'trabalho', 'lazer', 'saude']);

/**
 * Task priority enum
 */
export const taskPrioritySchema = z.enum(['baixa', 'media', 'alta', 'urgente']);

/**
 * Create task form validation schema
 */
export const createTaskSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório').max(255, 'O título deve ter no máximo 255 caracteres'),
  description: z
    .string()
    .min(1, 'A descrição é obrigatória')
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres'),
  type: taskTypeSchema,
  priority: taskPrioritySchema.optional(),
  due_date: z.string().min(1, 'A data de vencimento é obrigatória'),
  tag_ids: z.array(z.number()).optional().default([]),
  user_id: z.number().optional(),
});

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;

/**
 * Update task form validation schema
 */
export const updateTaskSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório').max(255, 'O título deve ter no máximo 255 caracteres'),
  description: z
    .string()
    .min(1, 'A descrição é obrigatória')
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres'),
  type: taskTypeSchema,
  priority: taskPrioritySchema,
  due_date: z.string().min(1, 'A data de vencimento é obrigatória'),
  completed: z.boolean(),
  tag_ids: z.array(z.number()).optional().default([]),
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
