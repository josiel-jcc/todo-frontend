import { Button } from '@/components/ui/button';
import { spacing } from '@/lib/spacing';

interface TaskFormActionsProps {
  onCancel?: () => void;
  isLoading: boolean;
  submitLabel: string;
}

export const TaskFormActions = ({ onCancel, isLoading, submitLabel }: TaskFormActionsProps) => {
  return (
    <div className={`flex pt-4 ${spacing.gapInline}`}>
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 rounded-xl"
        >
          Cancelar
        </Button>
      )}
      <Button
        type="submit"
        disabled={isLoading}
        className="flex-1 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
      >
        {isLoading ? 'Salvando...' : submitLabel}
      </Button>
    </div>
  );
};
