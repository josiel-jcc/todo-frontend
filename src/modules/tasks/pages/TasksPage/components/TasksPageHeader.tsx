import { Button } from '@/components/ui/button';
import { spacing } from '@/lib/spacing';

interface TasksPageHeaderProps {
  username?: string;
  onAddTask: () => void;
  isLoading: boolean;
}

export const TasksPageHeader = ({ username, onAddTask, isLoading }: TasksPageHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Olá{username ? `, ${username}` : ''}! 👋</h1>
        <p className={`text-muted-foreground ${spacing.pageSubtitle}`}>
          Veja o que precisa de atenção hoje
        </p>
      </div>
      <Button onClick={onAddTask} disabled={isLoading} className="hidden md:flex">
        Adicionar tarefa
      </Button>
      {/* Mobile: Button handled by BottomNavigation */}
    </div>
  );
};
