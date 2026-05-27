import { Calendar, User } from 'lucide-react';
import type { components } from '@/api';
import { CardContent } from '@/components/ui/card';
import { spacing } from '@/lib/spacing';
import { cn } from '@/lib/utils';
import { formatTaskDate, priorityColors, priorityLabels } from './taskConstants';

type Task = components['schemas']['models.Task'];

interface TaskCardContentProps {
  task: Task;
  isOverdue: boolean;
}

export const TaskCardContent = ({ task, isOverdue }: TaskCardContentProps) => {
  return (
    <CardContent className="flex-1 flex flex-col pt-0 px-6 pb-4 min-h-0 gap-4">
      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap flex-shrink-0">
        <div className={`flex items-center ${spacing.gapInline}`}>
          <Calendar className="h-3.5 w-3.5 shrink-0" />
          <span
            className={cn('font-medium', isOverdue && !task.completed && 'text-red-600')}
            title={formatTaskDate(task.due_date)}
          >
            {formatTaskDate(task.due_date)}
          </span>
        </div>
        {task.priority && (
          <span
            className={cn(
              'px-2.5 py-1 rounded-xl font-medium capitalize border',
              priorityColors[task.priority]
            )}
          >
            {priorityLabels[task.priority]}
          </span>
        )}
        {task.assigned_by_user && (
          <div className={`flex items-center ml-auto ${spacing.gapInline}`}>
            <User className="h-3.5 w-3.5 shrink-0" />
            <span
              className="font-medium truncate max-w-[120px]"
              title={task.assigned_by_user.username}
            >
              {task.assigned_by_user.username}
            </span>
          </div>
        )}
      </div>
      {task.tags && task.tags.length > 0 && (
        <div className={`flex flex-wrap flex-shrink-0 ${spacing.gapInline}`}>
          {task.tags.slice(0, 3).map((tag) => (
            <span
              key={tag.id}
              className="text-xs px-2 py-0.5 rounded-lg truncate max-w-[110px] font-medium"
              style={{
                backgroundColor: `${tag.color}15`,
                color: tag.color,
                border: `1px solid ${tag.color}30`,
              }}
              title={tag.name}
            >
              {tag.name}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="text-xs text-muted-foreground font-medium">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </CardContent>
  );
};
