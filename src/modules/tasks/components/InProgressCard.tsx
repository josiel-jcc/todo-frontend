import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Circle } from 'lucide-react';
import { useNavigate } from 'react-router';
import type { components } from '@/api';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Task = components['schemas']['models.Task'];

interface InProgressCardProps {
  task: Task;
  color?: 'pink' | 'orange' | 'blue';
  onToggleComplete?: (task: Task, completed: boolean) => void;
  isLoading?: boolean;
}

const colorClasses = {
  pink: 'bg-pink-100 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800',
  orange: 'bg-orange-100 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
  blue: 'bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
};

export const InProgressCard = ({
  task,
  color = 'pink',
  onToggleComplete,
  isLoading = false,
}: InProgressCardProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    });
  };

  const handleCardClick = () => {
    navigate(`/tasks/${task.id}`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="min-w-[280px] h-full self-stretch"
    >
      <Card
        className={cn(
          'cursor-pointer transition-all hover:shadow-lg rounded-3xl flex flex-col h-full min-h-[140px]',
          colorClasses[color]
        )}
        onClick={handleCardClick}
      >
        <CardContent className="p-4 flex flex-col flex-1 min-h-0">
          <div className="flex items-start justify-between gap-4 mb-2 flex-shrink-0">
            <h4
              className={cn(
                'font-semibold text-sm flex-1 min-w-0 line-clamp-2',
                task.completed && 'line-through'
              )}
              title={task.title}
            >
              {task.title}
            </h4>
            <motion.button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleComplete?.(task, !task.completed);
              }}
              disabled={isLoading}
              className="shrink-0"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {task.completed ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <Circle className="h-4 w-4 text-gray-400" />
              )}
            </motion.button>
          </div>
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {task.description ? (
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2 break-words flex-shrink-0 overflow-hidden">
                {task.description}
              </p>
            ) : (
              <div className="mb-2 flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-auto flex-shrink-0">
            <Calendar className="h-3 w-3 shrink-0" />
            <span className="truncate" title={formatDate(task.due_date)}>
              {formatDate(task.due_date)}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
