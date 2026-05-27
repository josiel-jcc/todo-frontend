import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';
import type { components } from '@/api';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { spacing } from '@/lib/spacing';
import { cn } from '@/lib/utils';
import { typeBadgeColors, typeLabels } from './taskConstants';

type Task = components['schemas']['models.Task'];

interface TaskCardHeaderProps {
  task: Task;
  isAnimating: boolean;
  isLoading: boolean;
  onToggleComplete: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const TaskCardHeader = ({
  task,
  isAnimating,
  isLoading,
  onToggleComplete,
}: TaskCardHeaderProps) => {
  return (
    <CardHeader className="flex-shrink-0 pb-4">
      <div className={`flex flex-col ${spacing.stackForm}`}>
        <div className={`flex items-center justify-between ${spacing.gapInline}`}>
          <div className={`flex items-center flex-1 min-w-0 ${spacing.gapInline}`}>
            <span
              className={cn(
                'text-xs font-medium px-2.5 py-1 rounded-xl border shrink-0',
                typeBadgeColors[task.type as keyof typeof typeBadgeColors] ||
                  'bg-gray-100 text-gray-700 border-gray-200'
              )}
            >
              {typeLabels[task.type as keyof typeof typeLabels] || task.type}
            </span>
            <CardTitle
              className={cn(
                'text-lg font-semibold line-clamp-1 flex-1 min-w-0',
                task.completed && 'line-through opacity-60'
              )}
            >
              {task.title}
            </CardTitle>
          </div>
          <motion.button
            type="button"
            onClick={onToggleComplete}
            disabled={isLoading}
            className="shrink-0"
            aria-label={task.completed ? 'Marcar como pendente' : 'Marcar como concluída'}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={
              isAnimating
                ? {
                    scale: [1, 1.2, 1],
                  }
                : false
            }
            transition={{
              duration: 0.3,
              ease: [0.68, -0.55, 0.265, 1.55],
            }}
          >
            {task.completed ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <Circle className="h-5 w-5 text-gray-400" />
            )}
          </motion.button>
        </div>
        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 break-words leading-relaxed">
            {task.description}
          </p>
        )}
      </div>
    </CardHeader>
  );
};
