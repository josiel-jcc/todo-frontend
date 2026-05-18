import { motion } from 'framer-motion';
import { Logo } from '@/components';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getVariants, scaleIn } from '@/lib/animations';
import { LegalFooterLinks } from '@/modules/legal/components/LegalFooterLinks';
import { LoginForm } from '../components/LoginForm/LoginForm';
import { RegisterForm } from '../components/RegisterForm/RegisterForm';

export const AuthPage = () => {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-4">
      <motion.div
        className="w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={getVariants(scaleIn)}
      >
        <div className="flex flex-col items-center mb-8">
          <Logo size={80} />
          <h1 className="text-2xl font-bold mt-4">App de Tarefas</h1>
        </div>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Cadastrar</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-6">
            <LoginForm />
          </TabsContent>
          <TabsContent value="register" className="mt-6">
            <RegisterForm />
          </TabsContent>
        </Tabs>
        <LegalFooterLinks />
      </motion.div>
    </div>
  );
};
