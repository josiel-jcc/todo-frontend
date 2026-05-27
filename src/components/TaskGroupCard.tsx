import type * as React from 'react';
import { cn } from '@/lib/utils';
import { CircularProgress } from './CircularProgress';

interface TaskGroupCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  name: string;
  taskCount: number;
  progress: number;
  color?: 'pink' | 'orange' | 'blue' | 'purple';
}

const colorClasses = {
  pink: 'bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400',
  orange: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
  blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
};

export const TaskGroupCard = ({
  icon,
  name,
  taskCount,
  progress,
  color = 'purple',
  className,
  ...props
}: TaskGroupCardProps) => {
  return (
    <div
      className={cn(
        'rounded-3xl border bg-card p-6 shadow-md hover:shadow-lg transition-shadow',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={cn(
            'w-12 h-12 rounded-2xl flex items-center justify-center',
            colorClasses[color]
          )}
        >
          {icon}
        </div>
        <CircularProgress
          value={progress}
          size={60}
          strokeWidth={6}
          className={cn(
            color === 'pink' && 'text-pink-600 dark:text-pink-400',
            color === 'orange' && 'text-orange-600 dark:text-orange-400',
            color === 'blue' && 'text-blue-600 dark:text-blue-400',
            color === 'purple' && 'text-purple-600 dark:text-purple-400'
          )}
        />
      </div>
      <h4 className="font-semibold text-lg mb-2">{name}</h4>
      <p className="text-sm text-muted-foreground">
        {taskCount} {taskCount === 1 ? 'tarefa' : 'tarefas'}
      </p>
    </div>
  );
};
