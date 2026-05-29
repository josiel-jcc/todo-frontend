import { motion } from 'framer-motion';
import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getVariants, shake } from '@/lib/animations';
import { formSelectClassName } from '@/lib/formSelect';
import type { CreateTaskFormData, UpdateTaskFormData } from '../../schemas/taskSchemas';
import { TaskFormDueDateField } from './TaskFormDueDateField';

interface TaskFormFieldsProps {
  register: UseFormRegister<CreateTaskFormData | UpdateTaskFormData>;
  control: Control<CreateTaskFormData | UpdateTaskFormData>;
  errors: FieldErrors<CreateTaskFormData | UpdateTaskFormData>;
}

export const TaskFormFields = ({ register, control, errors }: TaskFormFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Título *</Label>
        <motion.div animate={errors.title ? 'visible' : 'hidden'} variants={getVariants(shake)}>
          <Input
            id="title"
            placeholder="Digite o título da tarefa"
            {...register('title')}
            aria-invalid={errors.title ? 'true' : 'false'}
          />
        </motion.div>
        {errors.title && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-destructive"
            role="alert"
          >
            {errors.title.message}
          </motion.p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição *</Label>
        <motion.textarea
          id="description"
          placeholder="Digite a descrição da tarefa"
          className="flex min-h-[100px] w-full rounded-2xl border-2 border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
          {...register('description')}
          aria-invalid={errors.description ? 'true' : 'false'}
          animate={errors.description ? 'visible' : 'hidden'}
          variants={getVariants(shake)}
        />
        {errors.description && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-destructive"
            role="alert"
          >
            {errors.description.message}
          </motion.p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Tipo *</Label>
          <select
            id="type"
            className={formSelectClassName}
            {...register('type')}
            aria-invalid={errors.type ? 'true' : 'false'}
          >
            <option value="casa">Casa</option>
            <option value="trabalho">Trabalho</option>
            <option value="lazer">Lazer</option>
            <option value="saude">Saúde</option>
          </select>
          {errors.type && (
            <p className="text-sm text-destructive" role="alert">
              {errors.type.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Prioridade</Label>
          <select
            id="priority"
            className={formSelectClassName}
            {...register('priority')}
            aria-invalid={errors.priority ? 'true' : 'false'}
          >
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
            <option value="urgente">Urgente</option>
          </select>
          {errors.priority && (
            <p className="text-sm text-destructive" role="alert">
              {errors.priority.message}
            </p>
          )}
        </div>
      </div>

      <Controller
        name="due_date"
        control={control}
        render={({ field }) => (
          <TaskFormDueDateField
            value={field.value}
            onChange={field.onChange}
            error={errors.due_date?.message}
          />
        )}
      />
    </>
  );
};
