import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Circle } from 'lucide-react';
import type { components } from '@/api';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Task = components['schemas']['models.Task'];

interface TaskDetailHeaderProps {
  task: Task;
  isAnimating: boolean;
  isTogglingCompletion: boolean;
  onToggleComplete: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  onBack: () => void;
}

export const TaskDetailHeader = ({
  task,
  isAnimating,
  isTogglingCompletion,
  onToggleComplete,
  onBack,
}: TaskDetailHeaderProps) => {
  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="icon" onClick={onBack}>
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <h1 className="text-3xl font-bold">Detalhes da Tarefa</h1>
    </div>
  );
};

interface TaskDetailCardHeaderProps {
  task: Task;
  isAnimating: boolean;
  isTogglingCompletion: boolean;
  onToggleComplete: (e?: React.MouseEvent<HTMLButtonElement>) => void;
}

export const TaskDetailCardHeader = ({
  task,
  isAnimating,
  isTogglingCompletion,
  onToggleComplete,
}: TaskDetailCardHeaderProps) => {
  return (
    <CardHeader>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <CardTitle className={cn('text-2xl', task.completed && 'line-through opacity-60')}>
            {task.title}
          </CardTitle>
        </div>
        <motion.button
          type="button"
          onClick={onToggleComplete}
          disabled={isTogglingCompletion}
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
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          ) : (
            <Circle className="h-6 w-6 text-gray-400" />
          )}
        </motion.button>
      </div>
    </CardHeader>
  );
};
