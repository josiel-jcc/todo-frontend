import { Calendar, Repeat, Tag, User } from 'lucide-react';
import type { components } from '@/api';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { recurrenceRuleLabels } from '@/lib/recurrenceConstants';
import { cn } from '@/lib/utils';
import { priorityLabels, typeLabels } from '../../components/TaskCard/taskConstants';

type Task = components['schemas']['models.Task'];

const priorityColors = {
  baixa: 'bg-blue-100 text-blue-800 border-blue-200',
  media: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  alta: 'bg-orange-100 text-orange-800 border-orange-200',
  urgente: 'bg-red-100 text-red-800 border-red-200',
};

interface TaskDetailInfoProps {
  task: Task;
  isOverdue: boolean;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleDateString('pt-BR', { month: 'short' });
  const year = (date.getFullYear() % 100).toString().padStart(2, '0');
  const time = date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${day} de ${month} de ${year}, ${time}`;
};

export const TaskDetailInfo = ({
  task,
  isOverdue,
  onEdit,
  onDelete,
  isDeleting,
}: TaskDetailInfoProps) => {
  return (
    <CardContent className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-2">Descrição</h3>
        <p className="text-muted-foreground whitespace-pre-wrap">{task.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Data de Vencimento
          </h3>
          <p className={cn('text-muted-foreground', isOverdue && 'text-red-600 font-medium')}>
            {formatDate(task.due_date)}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2">Tipo</h3>
          <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1 text-sm font-medium">
            {typeLabels[task.type]}
          </span>
        </div>

        {task.recurrence_rule && (
          <div>
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Repeat className="h-4 w-4" />
              Recorrência
            </h3>
            <p className="text-muted-foreground">{recurrenceRuleLabels[task.recurrence_rule]}</p>
            {task.recurrence_next_due && (
              <p className="text-xs text-muted-foreground mt-1">
                Próxima: {formatDate(task.recurrence_next_due)}
              </p>
            )}
          </div>
        )}

        {task.priority && (
          <div>
            <h3 className="text-sm font-semibold mb-2">Prioridade</h3>
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-md border px-3 py-1 text-sm font-medium capitalize',
                priorityColors[task.priority]
              )}
            >
              {priorityLabels[task.priority]}
            </span>
          </div>
        )}

        {task.assigned_by_user && (
          <div>
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <User className="h-4 w-4" />
              Atribuído por
            </h3>
            <p className="text-muted-foreground">{task.assigned_by_user.username}</p>
          </div>
        )}
      </div>

      {task.tags && task.tags.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {task.tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1 rounded-md px-3 py-1 text-sm font-medium"
                style={{
                  backgroundColor: `${tag.color}20`,
                  color: tag.color,
                  border: `1px solid ${tag.color}40`,
                }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onEdit} className="flex-1 rounded-xl">
          Editar
        </Button>
        <Button
          variant="outline"
          onClick={onDelete}
          disabled={isDeleting}
          className="flex-1 rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50 dark:text-red-400 dark:border-red-500/50 dark:hover:bg-red-950/30 dark:hover:border-red-500/70"
        >
          {isDeleting ? 'Excluindo...' : 'Excluir'}
        </Button>
      </div>
    </CardContent>
  );
};
