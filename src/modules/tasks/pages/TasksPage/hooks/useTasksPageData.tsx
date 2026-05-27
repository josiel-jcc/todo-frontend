import { useMemo } from 'react';
import { useTaskStats } from '../../../hooks/useTaskStats';
import { useTasks } from '../../../hooks/useTasks';
import { mapTaskGroupsFromStats, mapTodayStats, taskTypeColorMap } from './taskStatsMappers';

export const useTasksPageData = () => {
  const { stats, isLoadingStats } = useTaskStats({ hide_stale_completed: true });

  const {
    tasks: previewTasks,
    isLoadingTasks: isLoadingPreviewTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    isCreatingTask,
    isUpdatingTask,
  } = useTasks({ limit: 6, hide_stale_completed: true });

  const { tasks: inProgressTasks, isLoadingTasks: isLoadingInProgressTasks } = useTasks({
    completed: false,
    limit: 10,
    sort_by: 'due_date',
    order: 'asc',
  });

  const todayStats = useMemo(() => mapTodayStats(stats), [stats]);
  const taskGroups = useMemo(() => mapTaskGroupsFromStats(stats), [stats]);

  return {
    previewTasks,
    inProgressTasks,
    todayStats,
    taskGroups,
    summaryStats: stats?.summary,
    taskTypeColors: taskTypeColorMap,
    isLoadingTasks: isLoadingStats || isLoadingPreviewTasks || isLoadingInProgressTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    isCreatingTask,
    isUpdatingTask,
  };
};
