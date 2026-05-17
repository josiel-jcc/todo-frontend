import { z } from 'zod';

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'Nome de usuário ou e-mail é obrigatório')
    .max(255, 'Nome de usuário ou e-mail é muito longo'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Register form validation schema
 */
export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, 'O nome de usuário deve ter pelo menos 3 caracteres')
      .max(50, 'O nome de usuário deve ter no máximo 50 caracteres'),
    email: z.string().email('Informe um endereço de e-mail válido'),
    password: z
      .string()
      .min(6, 'A senha deve ter pelo menos 6 caracteres')
      .max(255, 'A senha é muito longa'),
    confirmPassword: z.string().min(1, 'Confirme sua senha'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
