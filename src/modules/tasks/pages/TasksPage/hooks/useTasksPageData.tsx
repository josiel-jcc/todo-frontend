import { Briefcase, Home, Palette, Stethoscope } from 'lucide-react';
import { useMemo } from 'react';
import type { components } from '@/api';
import { useTasks } from '../../../hooks/useTasks';

type Task = components['schemas']['models.Task'];

const taskTypeIcons = {
  casa: Home,
  trabalho: Briefcase,
  lazer: Palette,
  saude: Stethoscope,
};

const taskTypeColors = {
  casa: 'pink' as const,
  trabalho: 'blue' as const,
  lazer: 'orange' as const,
  saude: 'purple' as const,
};

export const useTasksPageData = () => {
  const today = new Date().toISOString().split('T')[0];

  // Use separate useTasks calls - React Query will handle caching and deduplication
  // The queries will share cache when possible due to query key structure
  const {
    tasks: todayTasks,
    isLoadingTasks: isLoadingTodayTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    isCreatingTask,
    isUpdatingTask,
  } = useTasks({
    due_date_from: today,
    due_date_to: today,
    limit: 100,
  });

  const { tasks: allTasks, isLoadingTasks: isLoadingAllTasks } = useTasks({
    limit: 1000,
    hide_stale_completed: true,
  });

  const { tasks: inProgressTasks, isLoadingTasks: isLoadingInProgressTasks } = useTasks({
    completed: false,
    limit: 10,
  });

  const isLoadingTasks = isLoadingTodayTasks || isLoadingAllTasks || isLoadingInProgressTasks;

  const todayStats = useMemo(() => {
    const total = todayTasks.length;
    const completed = todayTasks.filter((t) => t.completed).length;
    const progress = total > 0 ? (completed / total) * 100 : 0;
    return { total, completed, progress };
  }, [todayTasks]);

  const taskGroups = useMemo(() => {
    const groups = allTasks.reduce(
      (acc, task) => {
        if (!acc[task.type]) {
          acc[task.type] = [];
        }
        acc[task.type].push(task);
        return acc;
      },
      {} as Record<string, Task[]>
    );

    return Object.entries(groups).map(([type, tasks]) => {
      const completed = tasks.filter((t) => t.completed).length;
      const progress = tasks.length > 0 ? (completed / tasks.length) * 100 : 0;
      const Icon = taskTypeIcons[type as keyof typeof taskTypeIcons] || Home;
      const color = taskTypeColors[type as keyof typeof taskTypeColors] || 'purple';

      return {
        type,
        tasks,
        completed,
        total: tasks.length,
        progress,
        icon: <Icon className="h-6 w-6" />,
        color,
      };
    });
  }, [allTasks]);

  return {
    todayTasks,
    allTasks,
    inProgressTasks,
    todayStats,
    taskGroups,
    taskTypeColors,
    isLoadingTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    isCreatingTask,
    isUpdatingTask,
  };
};
