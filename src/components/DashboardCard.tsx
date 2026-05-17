import type * as React from 'react';
import { cn } from '@/lib/utils';
import { CircularProgress } from './CircularProgress';
import { Button } from './ui/button';

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  onViewTasks?: () => void;
  buttonText?: string;
}

export const DashboardCard = ({
  title,
  progress,
  totalTasks,
  completedTasks,
  className,
  onViewTasks,
  buttonText = 'Ver tarefas',
  ...props
}: DashboardCardProps) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-6 text-white shadow-xl',
        className
      )}
      {...props}
    >
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-sm opacity-90 mb-4">
            {completedTasks} de {totalTasks} tarefas concluídas
          </p>
          {onViewTasks && (
            <Button
              onClick={onViewTasks}
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
            >
              {buttonText}
            </Button>
          )}
        </div>
        <CircularProgress value={progress} size={100} strokeWidth={8} className="text-white" />
      </div>
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
    </div>
  );
};
