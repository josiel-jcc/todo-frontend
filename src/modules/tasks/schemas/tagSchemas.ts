import { z } from 'zod';

/**
 * Create tag form validation schema
 */
export const createTagSchema = z.object({
  name: z
    .string()
    .min(1, 'O nome da tag é obrigatório')
    .max(50, 'O nome da tag deve ter no máximo 50 caracteres'),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Formato de cor inválido')
    .optional(),
});

export type CreateTagFormData = z.infer<typeof createTagSchema>;

/**
 * Update tag form validation schema
 */
export const updateTagSchema = z.object({
  name: z
    .string()
    .min(1, 'O nome da tag é obrigatório')
    .max(50, 'O nome da tag deve ter no máximo 50 caracteres'),
  color: z.string().optional(),
});

export type UpdateTagFormData = z.infer<typeof updateTagSchema>;
