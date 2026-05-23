import { Modal } from '@/components/Modal';
import { useTaskForm } from '@/contexts/TaskFormContext';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useTaskMutations } from '../hooks/useTaskMutations';
import type { CreateTaskFormData, UpdateTaskFormData } from '../schemas/taskSchemas';
import { TaskForm } from './TaskForm/TaskForm';

export const TaskFormModal = () => {
  const { isOpen, editingTask, closeForm } = useTaskForm();
  const { handleError } = useErrorHandler();
  const { createTask, updateTask, isCreatingTask, isUpdatingTask } = useTaskMutations();

  const title = editingTask ? 'Editar Tarefa' : 'Nova Tarefa';

  const isLoading = isCreatingTask || isUpdatingTask;

  const initialData: UpdateTaskFormData | undefined = editingTask
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
      }
    : undefined;

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
    <Modal isOpen={isOpen} onClose={closeForm} maxWidthClassName="max-w-3xl">
      <TaskForm
        onSubmit={handleSubmit}
        onCancel={closeForm}
        initialData={initialData}
        isLoading={isLoading}
        submitLabel={editingTask ? 'Salvar Alterações' : 'Criar Tarefa'}
      />
    </Modal>
  );
};
