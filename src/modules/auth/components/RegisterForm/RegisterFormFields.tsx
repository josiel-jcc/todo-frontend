import { motion } from 'framer-motion';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getVariants, shake } from '@/lib/animations';
import type { RegisterFormData } from '../../schemas/authSchemas';

interface RegisterFormFieldsProps {
  register: UseFormRegister<RegisterFormData>;
  errors: FieldErrors<RegisterFormData>;
}

export const RegisterFormFields = ({ register, errors }: RegisterFormFieldsProps) => {
  const fields = [
    {
      id: 'username',
      label: 'Nome de usuário',
      placeholder: 'joaosilva',
      type: 'text',
      delay: 0.1,
      error: errors.username,
    },
    {
      id: 'email',
      label: 'E-mail',
      placeholder: 'joao@exemplo.com',
      type: 'email',
      delay: 0.2,
      error: errors.email,
    },
    {
      id: 'password',
      label: 'Senha',
      placeholder: 'Mínimo de 6 caracteres',
      type: 'password',
      delay: 0.3,
      error: errors.password,
    },
    {
      id: 'confirmPassword',
      label: 'Confirmar senha',
      placeholder: 'Confirme sua senha',
      type: 'password',
      delay: 0.4,
      error: errors.confirmPassword,
    },
  ] as const;

  return (
    <>
      {fields.map((field) => (
        <motion.div
          key={field.id}
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: field.delay }}
        >
          <Label htmlFor={field.id}>{field.label}</Label>
          <motion.div animate={field.error ? 'visible' : 'hidden'} variants={getVariants(shake)}>
            <Input
              id={field.id}
              type={field.type}
              placeholder={field.placeholder}
              {...register(field.id)}
              aria-invalid={field.error ? 'true' : 'false'}
            />
          </motion.div>
          {field.error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-destructive"
              role="alert"
            >
              {field.error.message}
            </motion.p>
          )}
        </motion.div>
      ))}
    </>
  );
};
