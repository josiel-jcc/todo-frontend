import { z } from 'zod';

/**
 * Create comment form validation schema
 */
export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'O comentário é obrigatório')
    .max(1000, 'O comentário deve ter no máximo 1000 caracteres'),
  task_id: z.number().min(1, 'ID da tarefa é obrigatório'),
});

export type CreateCommentFormData = z.infer<typeof createCommentSchema>;

/**
 * Update comment form validation schema
 */
export const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'O comentário é obrigatório')
    .max(1000, 'O comentário deve ter no máximo 1000 caracteres'),
});

export type UpdateCommentFormData = z.infer<typeof updateCommentSchema>;
