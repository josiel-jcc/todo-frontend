import { useNavigate } from 'react-router';
import { DashboardCard } from '@/components';

interface TodayTasksCardProps {
  progress: number;
  totalTasks: number;
  completedTasks: number;
}

export const TodayTasksCard = ({ progress, totalTasks, completedTasks }: TodayTasksCardProps) => {
  const navigate = useNavigate();

  return (
    <DashboardCard
      title="Suas tarefas de hoje"
      progress={progress}
      totalTasks={totalTasks}
      completedTasks={completedTasks}
      onViewTasks={() => navigate('/tasks/today')}
      buttonText="Ver tarefas"
    />
  );
};
