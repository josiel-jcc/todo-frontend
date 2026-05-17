import { motion } from 'framer-motion';

export interface LoadingProps {
  /**
   * Loading variant
   * @default "spinner"
   */
  variant?: 'spinner' | 'skeleton' | 'overlay';
  /**
   * Size of the loading indicator
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Custom message to display
   */
  message?: string;
  /**
   * Whether to show as full screen overlay
   * @default false
   */
  fullScreen?: boolean;
}

const sizeStyles = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export const Loading = ({
  variant = 'spinner',
  size = 'md',
  message,
  fullScreen = false,
}: LoadingProps) => {
  const Spinner = () => (
    <motion.svg
      className={`text-blue-600 ${sizeStyles[size]}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
      aria-label="Carregando"
      role="img"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </motion.svg>
  );

  const Skeleton = () => (
    <div className="space-y-4">
      <motion.div
        className="h-4 bg-gray-200 rounded w-3/4"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="h-4 bg-gray-200 rounded"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.2,
        }}
      />
      <motion.div
        className="h-4 bg-gray-200 rounded w-5/6"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.4,
        }}
      />
    </div>
  );

  if (variant === 'overlay' || fullScreen) {
    return (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Spinner />
          {message && (
            <motion.p
              className="text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {message}
            </motion.p>
          )}
        </motion.div>
      </motion.div>
    );
  }

  if (variant === 'skeleton') {
    return (
      <div className="w-full">
        <Skeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 p-4">
      <Spinner />
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </div>
  );
};
