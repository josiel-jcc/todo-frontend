import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getVariants, scaleIn } from '@/lib/animations';
import { useAuth } from '../../hooks/useAuth';
import { type RegisterFormData, registerSchema } from '../../schemas/authSchemas';
import { RegisterFormError } from './RegisterFormError';
import { RegisterFormConsent } from './RegisterFormConsent';
import { RegisterFormFields } from './RegisterFormFields';

export const RegisterForm = () => {
  const { register: registerUser, isRegistering, registerError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptPrivacyPolicy: false,
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    const {
      confirmPassword: _confirmPassword,
      acceptPrivacyPolicy: _acceptPrivacyPolicy,
      ...registerData
    } = data;
    registerUser(registerData);
  };

  const MotionCard = motion(Card);

  return (
    <MotionCard
      className="w-full max-w-md"
      initial="hidden"
      animate="visible"
      variants={getVariants(scaleIn)}
    >
      <CardHeader>
        <CardTitle>Criar conta</CardTitle>
        <CardDescription>Informe seus dados para criar uma nova conta</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <RegisterFormError error={registerError} />

          <RegisterFormFields register={register} errors={errors} />

          <RegisterFormConsent register={register} errors={errors} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button type="submit" className="w-full" disabled={isRegistering}>
              {isRegistering ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </motion.div>
        </form>
      </CardContent>
    </MotionCard>
  );
};
