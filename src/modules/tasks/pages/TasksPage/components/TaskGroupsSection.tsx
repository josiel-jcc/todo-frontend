import { TaskGroupCard } from '@/components';
import { typeLabels } from '../../../components/TaskCard/taskConstants';

interface TaskGroup {
  type: string;
  icon: React.ReactNode;
  total: number;
  progress: number;
  color: 'pink' | 'blue' | 'orange' | 'purple';
}

interface TaskGroupsSectionProps {
  taskGroups: TaskGroup[];
}

export const TaskGroupsSection = ({ taskGroups }: TaskGroupsSectionProps) => {
  if (taskGroups.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Grupos de tarefas</h2>
      {/* Mobile: Vertical list */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {taskGroups.map((group) => (
          <TaskGroupCard
            key={group.type}
            icon={group.icon}
            name={typeLabels[group.type as keyof typeof typeLabels] ?? group.type}
            taskCount={group.total}
            progress={group.progress}
            color={group.color}
          />
        ))}
      </div>
      {/* Desktop: Grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {taskGroups.map((group) => (
          <TaskGroupCard
            key={group.type}
            icon={group.icon}
            name={typeLabels[group.type as keyof typeof typeLabels] ?? group.type}
            taskCount={group.total}
            progress={group.progress}
            color={group.color}
          />
        ))}
      </div>
    </section>
  );
};
