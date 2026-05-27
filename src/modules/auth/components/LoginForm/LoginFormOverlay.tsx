import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoginFormOverlayProps {
  isLoggingIn: boolean;
}

export const LoginFormOverlay = ({ isLoggingIn }: LoginFormOverlayProps) => {
  return (
    <AnimatePresence>
      {isLoggingIn && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Fazendo login...</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
