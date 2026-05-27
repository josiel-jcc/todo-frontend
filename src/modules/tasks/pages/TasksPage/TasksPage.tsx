import { useTaskForm } from '@/contexts/TaskFormContext';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import {
  AllTasksSection,
  InProgressSection,
  TaskGroupsSection,
  TasksPageHeader,
  TodayTasksCard,
} from './components';
import { useTasksPageData } from './hooks/useTasksPageData';

export const TasksPage = () => {
  const { user } = useAuth();
  const { openForm } = useTaskForm();

  const {
    todayStats,
    taskGroups,
    previewTasks,
    inProgressTasks,
    taskTypeColors,
    isLoadingTasks,
    deleteTask,
    toggleTaskCompletion,
    isCreatingTask,
    isUpdatingTask,
  } = useTasksPageData();

  const isLoading = isLoadingTasks || isCreatingTask || isUpdatingTask;

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
      <TasksPageHeader
        username={user?.username}
        onAddTask={() => {
          openForm();
        }}
        isLoading={isLoading}
      />

      <TodayTasksCard
        progress={todayStats.progress}
        totalTasks={todayStats.total}
        completedTasks={todayStats.completed}
      />

      <InProgressSection
        tasks={inProgressTasks}
        taskTypeColors={taskTypeColors}
        onToggleComplete={toggleTaskCompletion}
        isLoading={isLoading}
      />

      <TaskGroupsSection taskGroups={taskGroups} />

      <AllTasksSection
        tasks={previewTasks}
        isLoading={isLoading}
        onToggleComplete={toggleTaskCompletion}
        onEdit={openForm}
        onDelete={deleteTask}
      />
    </div>
  );
};
