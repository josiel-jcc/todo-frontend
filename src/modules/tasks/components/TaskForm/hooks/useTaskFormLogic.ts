import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { buildDueDateValue, getDefaultDueDateValue, parseDueDateValue } from '@/lib/dueDateUtils';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useUsers } from '@/modules/tasks/hooks/useUsers';
import {
  type CreateTaskFormData,
  createTaskSchema,
  type UpdateTaskFormData,
  updateTaskSchema,
} from '../../../schemas/taskSchemas';

interface UseTaskFormLogicProps {
  initialData?: UpdateTaskFormData;
  onSubmit: (data: CreateTaskFormData | UpdateTaskFormData) => void;
}

export const useTaskFormLogic = ({ initialData, onSubmit }: UseTaskFormLogicProps) => {
  const isEditMode = !!initialData;
  const schema = isEditMode ? updateTaskSchema : createTaskSchema;
  const { user: currentUser } = useAuth();
  const { users, isLoadingUsers } = useUsers({ limit: 100 });
  const [isForAnotherUser, setIsForAnotherUser] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreateTaskFormData | UpdateTaskFormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData
      ? {
          ...initialData,
          due_date: initialData.due_date
            ? buildDueDateValue(
                parseDueDateValue(initialData.due_date).date ?? new Date(initialData.due_date),
                parseDueDateValue(initialData.due_date).time
              )
            : '',
        }
      : {
          title: '',
          description: '',
          type: 'casa',
          priority: 'media',
          due_date: getDefaultDueDateValue(),
          tag_ids: [],
          customReminderEnabled: false,
        },
  });

  const onSubmitForm = (data: CreateTaskFormData | UpdateTaskFormData) => {
    const { customReminderEnabled, reminder_minutes_before, ...rest } = data;
    const formattedData: CreateTaskFormData | UpdateTaskFormData = {
      ...rest,
      due_date: new Date(data.due_date).toISOString(),
      user_id: isForAnotherUser ? data.user_id : undefined,
    };

    if (customReminderEnabled && reminder_minutes_before != null) {
      (formattedData as CreateTaskFormData).reminder_minutes_before = reminder_minutes_before;
    } else if (isEditMode) {
      (
        formattedData as UpdateTaskFormData & { reminder_minutes_before?: number | null }
      ).reminder_minutes_before = null;
    }

    onSubmit(formattedData);
  };

  const selectedTagIds = watch('tag_ids') || [];
  const availableUsers = users.filter((u) => u.id !== currentUser?.id);

  const handleToggleUserAssignment = (checked: boolean) => {
    setIsForAnotherUser(checked);
    if (!checked) {
      setValue('user_id', undefined);
    }
  };

  return {
    isEditMode,
    register,
    control,
    handleSubmit: handleSubmit(onSubmitForm),
    errors,
    selectedTagIds,
    setValue,
    watch,
    isForAnotherUser,
    availableUsers,
    isLoadingUsers,
    handleToggleUserAssignment,
  };
};
