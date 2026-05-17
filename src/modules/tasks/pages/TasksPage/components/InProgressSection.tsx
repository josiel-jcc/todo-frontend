import type { components } from '@/api';
import { InProgressCard } from '../../../components';

type Task = components['schemas']['models.Task'];

interface InProgressSectionProps {
  tasks: Task[];
  taskTypeColors: Record<string, 'pink' | 'blue' | 'orange' | 'purple'>;
  onToggleComplete: (task: Task, completed: boolean) => void;
  isLoading: boolean;
}

export const InProgressSection = ({
  tasks,
  taskTypeColors,
  onToggleComplete,
  isLoading,
}: InProgressSectionProps) => {
  if (tasks.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Em andamento</h2>
      {/* Mobile: Horizontal scroll */}
      <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4">
        <div className="flex gap-4 items-stretch h-[140px]">
          {tasks.slice(0, 5).map((task) => (
            <InProgressCard
              key={task.id}
              task={task}
              color={taskTypeColors[task.type as keyof typeof taskTypeColors] || 'pink'}
              onToggleComplete={onToggleComplete}
              isLoading={isLoading}
            />
          ))}
        </div>
      </div>
      {/* Desktop: Grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr">
        {tasks.slice(0, 8).map((task) => (
          <InProgressCard
            key={task.id}
            task={task}
            color={taskTypeColors[task.type as keyof typeof taskTypeColors] || 'pink'}
            onToggleComplete={onToggleComplete}
            isLoading={isLoading}
          />
        ))}
      </div>
    </section>
  );
};
