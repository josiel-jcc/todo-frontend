import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'A senha deve ter no mínimo 8 caracteres')
  .regex(/[A-Za-z]/, 'A senha deve conter pelo menos uma letra')
  .regex(/[0-9]/, 'A senha deve conter pelo menos um número');

export const loginSchema = z.object({
  username: z.string().min(1, 'Usuário ou e-mail é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, 'O nome de usuário deve ter no mínimo 3 caracteres')
      .max(50, 'O nome de usuário deve ter no máximo 50 caracteres'),
    email: z.string().email('Informe um endereço de e-mail válido'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirme sua senha'),
    acceptPrivacyPolicy: z.boolean().refine((value) => value === true, {
      message: 'Você deve aceitar a Política de Privacidade e os Termos de Uso',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
