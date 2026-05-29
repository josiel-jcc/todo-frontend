import { BottomSheet } from '@/components/BottomSheet';
import { useTaskForm } from '@/contexts/TaskFormContext';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useTaskMutations } from '../hooks/useTaskMutations';
import type { CreateTaskFormData, UpdateTaskFormData } from '../schemas/taskSchemas';
import { TaskForm } from './TaskForm/TaskForm';

export const TaskFormBottomSheet = () => {
  const { isOpen, editingTask, closeForm } = useTaskForm();
  const { handleError } = useErrorHandler();
  const { createTask, updateTask, isCreatingTask, isUpdatingTask } = useTaskMutations();

  const isLoading = isCreatingTask || isUpdatingTask;

  const handleSubmit = (data: CreateTaskFormData | UpdateTaskFormData) => {
    if (editingTask) {
      updateTask(
        { id: editingTask.id, data: data as unknown as Parameters<typeof updateTask>[0]['data'] },
        {
          onSuccess: () => closeForm(),
          onError: (error) => handleError(error),
        }
      );
      return;
    }

    createTask(data as unknown as Parameters<typeof createTask>[0], {
      onSuccess: () => closeForm(),
      onError: (error) => handleError(error),
    });
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={closeForm}
      title={editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
    >
      <TaskForm
        variant="bottom-sheet"
        onSubmit={handleSubmit}
        onCancel={closeForm}
        initialData={
          editingTask
            ? {
                title: editingTask.title,
                description: editingTask.description,
                type: editingTask.type,
                priority: editingTask.priority,
                due_date: editingTask.due_date,
                completed: editingTask.completed,
                tag_ids: editingTask.tags?.map((tag) => tag.id) ?? [],
                customReminderEnabled:
                  editingTask.reminder_minutes_before != null &&
                  editingTask.reminder_minutes_before !== undefined,
                reminder_minutes_before: editingTask.reminder_minutes_before ?? undefined,
                recurrence_enabled: !!editingTask.recurrence_rule,
                recurrence_rule: editingTask.recurrence_rule ?? undefined,
              }
            : undefined
        }
        isLoading={isLoading}
        submitLabel={editingTask ? 'Salvar Alterações' : 'Criar Tarefa'}
      />
    </BottomSheet>
  );
};
