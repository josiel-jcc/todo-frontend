import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getVariants, slideDown } from '@/lib/animations';
import { spacing } from '@/lib/spacing';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import type { CreateTaskFormData, UpdateTaskFormData } from '../../schemas/taskSchemas';
import { useTaskFormLogic } from './hooks/useTaskFormLogic';
import { TaskFormActions } from './TaskFormActions';
import { TaskFormFields } from './TaskFormFields';
import { TaskFormTags } from './TaskFormTags';
import { TaskFormUserAssignment } from './TaskFormUserAssignment';
import { TaskRecurrenceField } from './TaskRecurrenceField';
import { TaskReminderField } from './TaskReminderField';

interface TaskFormProps {
  onSubmit: (data: CreateTaskFormData | UpdateTaskFormData) => void;
  onCancel?: () => void;
  initialData?: UpdateTaskFormData;
  isLoading?: boolean;
  submitLabel?: string;
  variant?: 'default' | 'bottom-sheet';
}

export const TaskForm = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
  submitLabel = 'Criar Tarefa',
  variant = 'default',
}: TaskFormProps) => {
  const { user } = useAuth();
  const {
    isEditMode,
    register,
    control,
    handleSubmit,
    errors,
    selectedTagIds,
    setValue,
    watch,
    isForAnotherUser,
    availableUsers,
    isLoadingUsers,
    handleToggleUserAssignment,
  } = useTaskFormLogic({ initialData, onSubmit });

  const MotionCard = motion(Card);

  const formContent = (
    <>
      {variant === 'default' && (
        <CardHeader className="pt-6">
          <CardTitle>{isEditMode ? 'Editar Tarefa' : 'Nova Tarefa'}</CardTitle>
          <CardDescription>
            {isEditMode
              ? 'Atualize os detalhes da tarefa'
              : 'Preencha os dados para criar uma nova tarefa'}
          </CardDescription>
        </CardHeader>
      )}
      <CardContent className={variant === 'bottom-sheet' ? 'p-0' : ''}>
        <form onSubmit={handleSubmit} className={spacing.stackForm}>
          <TaskFormFields register={register} control={control} errors={errors} />

          <TaskReminderField
            register={register}
            watch={watch}
            setValue={setValue}
            errors={errors}
            userDefaultMinutes={user?.reminder_minutes_before}
          />

          <TaskRecurrenceField
            register={register}
            watch={watch}
            setValue={setValue}
            errors={errors}
          />

          <TaskFormTags
            selectedTagIds={selectedTagIds}
            onSelectionChange={(tagIds) => setValue('tag_ids', tagIds)}
            isLoading={isLoading}
          />

          {!isEditMode && (
            <TaskFormUserAssignment
              isForAnotherUser={isForAnotherUser}
              onToggle={handleToggleUserAssignment}
              register={register}
              errors={errors}
              setValue={setValue}
              availableUsers={availableUsers}
              isLoadingUsers={isLoadingUsers}
              isLoading={isLoading}
            />
          )}

          <TaskFormActions onCancel={onCancel} isLoading={isLoading} submitLabel={submitLabel} />
        </form>
      </CardContent>
    </>
  );

  if (variant === 'bottom-sheet') {
    return <>{formContent}</>;
  }

  return (
    <AnimatePresence>
      <MotionCard initial="hidden" animate="visible" exit="exit" variants={getVariants(slideDown)}>
        {formContent}
      </MotionCard>
    </AnimatePresence>
  );
};
