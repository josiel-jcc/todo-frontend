import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getVariants, scaleIn } from '@/lib/animations';
import { useAuth } from '../../hooks/useAuth';
import { type LoginFormData, loginSchema } from '../../schemas/authSchemas';
import { LoginFormFields } from './LoginFormFields';
import { LoginFormOverlay } from './LoginFormOverlay';

export const LoginForm = () => {
  const { login, isLoggingIn, loginError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  const MotionCard = motion(Card);

  return (
    <MotionCard
      className="w-full max-w-md relative"
      initial="hidden"
      animate="visible"
      variants={getVariants(scaleIn)}
    >
      <LoginFormOverlay isLoggingIn={isLoggingIn} />

      <CardHeader>
        <CardTitle>Entrar</CardTitle>
        <CardDescription>
          Informe seu nome de usuário ou e-mail e senha para acessar sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <AnimatePresence>
            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive"
              >
                <AlertCircle className="h-4 w-4" />
                <span>
                  {loginError instanceof Error
                    ? loginError.message
                    : 'Credenciais inválidas. Tente novamente.'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <LoginFormFields register={register} errors={errors} isLoggingIn={isLoggingIn} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoggingIn ? { opacity: 0.5 } : { opacity: 1, y: 0 }}
            transition={{ delay: isLoggingIn ? 0 : 0.3 }}
          >
            <Button type="submit" className="w-full" disabled={isLoggingIn}>
              {isLoggingIn ? 'Entrando...' : 'Entrar'}
            </Button>
          </motion.div>
        </form>
      </CardContent>
    </MotionCard>
  );
};
