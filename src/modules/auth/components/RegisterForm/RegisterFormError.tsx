import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface RegisterFormErrorProps {
  error: Error | null;
}

export const RegisterFormError = ({ error }: RegisterFormErrorProps) => {
  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive"
        >
          <AlertCircle className="h-4 w-4" />
          <span>
            {error instanceof Error ? error.message : 'Falha no cadastro. Tente novamente.'}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
