import { Send } from 'lucide-react';
import { useState } from 'react';
import { PageShell } from '@/components/PageShell';
import { Card, CardContent } from '@/components/ui/card';
import { spacing } from '@/lib/spacing';
import { useAssignedTasks } from '../hooks/useAssignedTasks';
import { useTasks } from '../hooks/useTasks';
import { SearchPagination, SearchResults } from './search/components';

export const AssignedTasksPage = () => {
  const [page, setPage] = useState(1);
  const { tasks, pagination, isLoadingTasks } = useAssignedTasks({ page, limit: 20 });
  const { toggleTaskCompletion, deleteTask, isTogglingCompletion, isDeletingTask } = useTasks(
    undefined,
    { queryEnabled: false }
  );

  const isLoading = isLoadingTasks || isTogglingCompletion || isDeletingTask;

  return (
    <PageShell size="wide">
      <div className={`flex items-center ${spacing.gapInlineLoose}`}>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Send className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Tarefas que deleguei</h1>
          <p className="text-sm text-muted-foreground">
            Tarefas que você criou ou atribuiu a outras pessoas.
          </p>
        </div>
      </div>

      <Card className="rounded-3xl border-dashed">
        <CardContent className="p-4 text-sm text-muted-foreground">
          Aqui aparecem as tarefas em que você é quem atribuiu para outro usuário. Edite ou
          acompanhe o andamento pelo card ou abra os detalhes.
        </CardContent>
      </Card>

      <SearchResults
        tasks={tasks}
        isLoading={isLoading}
        hasActiveFilters={false}
        onResetFilters={() => {}}
        pagination={pagination ? { total: pagination.total } : undefined}
        onToggleComplete={toggleTaskCompletion}
        onDelete={deleteTask}
      />

      {pagination && (
        <SearchPagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          isLoading={isLoading}
          onPageChange={setPage}
        />
      )}
    </PageShell>
  );
};
