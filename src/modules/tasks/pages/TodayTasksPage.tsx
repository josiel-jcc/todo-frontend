import { ArrowLeft, Bell } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { DatePickerHorizontal, Loading } from '@/components';
import { PageShell } from '@/components/PageShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { spacing } from '@/lib/spacing';
import { TaskCard } from '../components';
import { useTasks } from '../hooks/useTasks';

type FilterType = 'all' | 'todo' | 'in-progress' | 'completed';

export const TodayTasksPage = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filter, setFilter] = useState<FilterType>('all');

  const dateString = selectedDate.toISOString().split('T')[0];

  const { tasks, isLoadingTasks, toggleTaskCompletion, isTogglingCompletion } = useTasks({
    due_date_from: dateString,
    due_date_to: dateString,
    limit: 100,
    hide_stale_completed: true,
  });

  // Filter tasks based on selected filter
  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'todo':
        return tasks.filter((t) => !t.completed);
      case 'in-progress':
        return tasks.filter((t) => !t.completed);
      case 'completed':
        return tasks.filter((t) => t.completed);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  const filters: { label: string; value: FilterType }[] = [
    { label: 'Todas', value: 'all' },
    { label: 'A fazer', value: 'todo' },
    { label: 'Em andamento', value: 'in-progress' },
    { label: 'Concluídas', value: 'completed' },
  ];

  const isLoading = isLoadingTasks || isTogglingCompletion;

  return (
    <PageShell size="wide">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/tasks')}
            className="rounded-2xl"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Tarefas de hoje</h1>
            <p className={`text-muted-foreground text-sm ${spacing.pageSubtitle}`}>
              {selectedDate.toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-2xl">
          <Bell className="h-5 w-5" />
        </Button>
      </div>

      {/* Date Picker */}
      <section>
        <DatePickerHorizontal selectedDate={selectedDate} onDateChange={setSelectedDate} />
      </section>

      {/* Filters */}
      <section>
        {/* Mobile: Horizontal scroll */}
        <div className={spacing.horizontalBleed}>
          <div className={spacing.horizontalBleedInner}>
            {filters.map((f) => (
              <Button
                key={f.value}
                variant={filter === f.value ? 'filterActive' : 'filter'}
                size="sm"
                onClick={() => setFilter(f.value)}
                className="shrink-0 rounded-xl"
              >
                {f.label}
              </Button>
            ))}
          </div>
        </div>
        {/* Desktop: Inline */}
        <div className={`hidden md:flex ${spacing.gapInline}`}>
          {filters.map((f) => (
            <Button
              key={f.value}
              variant={filter === f.value ? 'filterActive' : 'filter'}
              size="sm"
              onClick={() => setFilter(f.value)}
              className="rounded-xl"
            >
              {f.label}
            </Button>
          ))}
        </div>
      </section>

      {/* Tasks List */}
      <section>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loading />
          </div>
        ) : filteredTasks.length === 0 ? (
          <Card className="rounded-3xl">
            <CardContent className={spacing.emptyState}>
              <p className="text-muted-foreground">Nenhuma tarefa encontrada para esta data.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={toggleTaskCompletion}
                isLoading={isLoading}
              />
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
};
