import { Briefcase, Home, Palette, Stethoscope } from 'lucide-react';
import type { UserTaskStats } from '@/api/stats';

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

export const taskTypeColorMap = taskTypeColors;

export function mapTodayStats(stats?: UserTaskStats) {
  if (!stats) {
    return { total: 0, completed: 0, progress: 0 };
  }
  return {
    total: stats.today.total,
    completed: stats.today.completed,
    progress: stats.today.completion_rate,
  };
}

export function mapTaskGroupsFromStats(stats?: UserTaskStats) {
  if (!stats?.by_type?.length) {
    return [];
  }

  return stats.by_type.map((row) => {
    const Icon = taskTypeIcons[row.type as keyof typeof taskTypeIcons] || Home;
    const color = taskTypeColors[row.type as keyof typeof taskTypeColors] || 'purple';

    return {
      type: row.type,
      completed: row.completed,
      total: row.total,
      progress: row.completion_rate,
      icon: <Icon className="h-6 w-6" />,
      color,
    };
  });
}
