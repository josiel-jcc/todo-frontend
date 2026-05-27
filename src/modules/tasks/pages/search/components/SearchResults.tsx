import { Search } from 'lucide-react';
import type { components } from '@/api';
import { Loading } from '@/components';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { spacing } from '@/lib/spacing';
import { TaskCard } from '../../../components';

type Task = components['schemas']['models.Task'];

interface SearchResultsProps {
  tasks: Task[];
  isLoading: boolean;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  pagination?: {
    total: number;
  };
  onToggleComplete: (task: Task, completed: boolean) => void;
  onDelete: (id: number) => void;
}

export const SearchResults = ({
  tasks,
  isLoading,
  hasActiveFilters,
  onResetFilters,
  pagination,
  onToggleComplete,
  onDelete,
}: SearchResultsProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loading />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card className="rounded-3xl">
        <CardContent className={spacing.emptyState}>
          <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            Nenhuma tarefa encontrada com os filtros selecionados.
          </p>
          {hasActiveFilters && (
            <Button variant="outline" onClick={onResetFilters} className="mt-4 rounded-xl">
              Limpar Filtros
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className={`flex items-center justify-between ${spacing.sectionTitle}`}>
        <h2 className="text-xl font-semibold">
          Resultados
          {pagination && (
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({pagination.total} tarefas)
            </span>
          )}
        </h2>
      </div>

      <div className={`grid md:grid-cols-2 lg:grid-cols-3 ${spacing.gapGrid}`}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggleComplete={onToggleComplete}
            onDelete={onDelete}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
};
