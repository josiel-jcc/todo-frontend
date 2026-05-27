import type { UserTaskStats } from '@/api/stats';
import type { MockTask } from './store';

function completionRate(completed: number, total: number): number {
  return total > 0 ? (completed / total) * 100 : 0;
}

export function visibleTasksForStats(
  tasks: MockTask[],
  userId: number,
  hideStale: boolean
): MockTask[] {
  let result = tasks.filter((t) => t.user_id === userId);
  if (hideStale) {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    result = result.filter((t) => {
      if (!t.completed) return true;
      const completedAt = (t as { completed_at?: string }).completed_at;
      if (!completedAt) return true;
      return new Date(completedAt).getTime() >= cutoff;
    });
  }
  return result;
}

export function buildUserTaskStats(tasks: MockTask[]): UserTaskStats {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const completed = tasks.filter((t) => t.completed).length;
  const total = tasks.length;
  const todayTasks = tasks.filter((t) => t.due_date?.split('T')[0] === todayStr);
  const todayCompleted = todayTasks.filter((t) => t.completed).length;

  const types = [...new Set(tasks.map((t) => t.type))];
  const priorities = [...new Set(tasks.map((t) => (t.priority ?? 'media') as string))];

  return {
    summary: {
      total,
      completed,
      pending: total - completed,
      overdue: tasks.filter((t) => !t.completed && t.due_date && new Date(t.due_date) < now)
        .length,
      completion_rate: completionRate(completed, total),
    },
    today: {
      total: todayTasks.length,
      completed: todayCompleted,
      pending: todayTasks.length - todayCompleted,
      completion_rate: completionRate(todayCompleted, todayTasks.length),
    },
    by_type: types.map((type) => {
      const subset = tasks.filter((t) => t.type === type);
      const done = subset.filter((t) => t.completed).length;
      return {
        type: type as UserTaskStats['by_type'][0]['type'],
        total: subset.length,
        completed: done,
        pending: subset.length - done,
        completion_rate: completionRate(done, subset.length),
      };
    }),
    by_priority: priorities.map((priority) => {
      const subset = tasks.filter((t) => (t.priority ?? 'media') === priority);
      const done = subset.filter((t) => t.completed).length;
      return {
        priority: priority as UserTaskStats['by_priority'][0]['priority'],
        total: subset.length,
        completed: done,
        pending: subset.length - done,
        completion_rate: completionRate(done, subset.length),
      };
    }),
    in_progress: tasks.filter((t) => !t.completed).length,
  };
}
