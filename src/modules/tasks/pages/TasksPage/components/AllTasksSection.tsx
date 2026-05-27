import type { components } from '@/api';
import { Loading } from '@/components';
import { Card, CardContent } from '@/components/ui/card';
import { spacing } from '@/lib/spacing';
import { TaskCard } from '../../../components';

type Task = components['schemas']['models.Task'];

interface AllTasksSectionProps {
  tasks: Task[];
  isLoading: boolean;
  onToggleComplete: (task: Task, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export const AllTasksSection = ({
  tasks,
  isLoading,
  onToggleComplete,
  onEdit,
  onDelete,
}: AllTasksSectionProps) => {
  return (
    <section>
      <div className={`flex items-center justify-between ${spacing.sectionTitle}`}>
        <h2 className="text-xl font-semibold">Todas as tarefas</h2>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loading />
        </div>
      ) : tasks.length === 0 ? (
        <Card className="rounded-3xl">
          <CardContent className={spacing.emptyState}>
            <p className="text-muted-foreground">Nenhuma tarefa ainda. Crie sua primeira tarefa!</p>
          </CardContent>
        </Card>
      ) : (
        <div className={`grid md:grid-cols-2 lg:grid-cols-3 ${spacing.gapGrid}`}>
          {tasks.slice(0, 6).map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
              onDelete={onDelete}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}
    </section>
  );
};
