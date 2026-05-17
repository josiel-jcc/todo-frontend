import { motion } from 'framer-motion';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getVariants, shake } from '@/lib/animations';
import type { LoginFormData } from '../../schemas/authSchemas';

interface LoginFormFieldsProps {
  register: UseFormRegister<LoginFormData>;
  errors: FieldErrors<LoginFormData>;
  isLoggingIn: boolean;
}

export const LoginFormFields = ({ register, errors, isLoggingIn }: LoginFormFieldsProps) => {
  return (
    <>
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, x: -20 }}
        animate={isLoggingIn ? { opacity: 0.5 } : { opacity: 1, x: 0 }}
        transition={{ delay: isLoggingIn ? 0 : 0.1 }}
      >
        <Label htmlFor="username">Nome de usuário ou e-mail</Label>
        <motion.div
          animate={isLoggingIn ? {} : errors.username ? 'visible' : 'hidden'}
          variants={getVariants(shake)}
        >
          <Input
            id="username"
            type="text"
            placeholder="usuario ou email@exemplo.com"
            {...register('username')}
            aria-invalid={errors.username ? 'true' : 'false'}
            disabled={isLoggingIn}
          />
        </motion.div>
        {errors.username && !isLoggingIn && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-destructive"
            role="alert"
          >
            {errors.username.message}
          </motion.p>
        )}
      </motion.div>

      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, x: -20 }}
        animate={isLoggingIn ? { opacity: 0.5 } : { opacity: 1, x: 0 }}
        transition={{ delay: isLoggingIn ? 0 : 0.2 }}
      >
        <Label htmlFor="password">Senha</Label>
        <motion.div
          animate={isLoggingIn ? {} : errors.password ? 'visible' : 'hidden'}
          variants={getVariants(shake)}
        >
          <Input
            id="password"
            type="password"
            placeholder="Digite sua senha"
            {...register('password')}
            aria-invalid={errors.password ? 'true' : 'false'}
            disabled={isLoggingIn}
          />
        </motion.div>
        {errors.password && !isLoggingIn && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-destructive"
            role="alert"
          >
            {errors.password.message}
          </motion.p>
        )}
      </motion.div>
    </>
  );
};
