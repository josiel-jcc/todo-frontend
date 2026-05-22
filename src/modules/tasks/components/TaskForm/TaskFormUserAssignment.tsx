import { AnimatePresence, motion } from 'framer-motion';
import type { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { Link } from 'react-router';
import type { components } from '@/api';
import { Label } from '@/components/ui/label';
import type { CreateTaskFormData, UpdateTaskFormData } from '../../schemas/taskSchemas';

type User = components['schemas']['models.User'];

interface TaskFormUserAssignmentProps {
  isForAnotherUser: boolean;
  onToggle: (checked: boolean) => void;
  register: UseFormRegister<CreateTaskFormData | UpdateTaskFormData>;
  errors: FieldErrors<CreateTaskFormData | UpdateTaskFormData>;
  setValue: UseFormSetValue<CreateTaskFormData | UpdateTaskFormData>;
  availableUsers: User[];
  isLoadingUsers: boolean;
  isLoading: boolean;
}

export const TaskFormUserAssignment = ({
  isForAnotherUser,
  onToggle,
  register,
  errors,
  setValue,
  availableUsers,
  isLoadingUsers,
  isLoading,
}: TaskFormUserAssignmentProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="assign-to-user">Atribuir tarefa</Label>
          <p className="text-sm text-muted-foreground">
            {isForAnotherUser
              ? 'A tarefa será atribuída a outro usuário'
              : 'A tarefa será criada para você'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onToggle(!isForAnotherUser)}
          disabled={isLoading}
          className={`
            relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
            ${isForAnotherUser ? 'bg-primary' : 'bg-muted'}
          `}
          role="switch"
          aria-checked={isForAnotherUser}
        >
          <span
            className={`
              pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
              ${isForAnotherUser ? 'translate-x-5' : 'translate-x-0'}
            `}
          />
        </button>
      </div>

      <AnimatePresence>
        {isForAnotherUser && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-2 overflow-hidden"
          >
            <Label htmlFor="user_id">Usuário *</Label>
            {isLoadingUsers ? (
              <div className="text-sm text-muted-foreground">Carregando usuários...</div>
            ) : availableUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Atribua tarefas apenas a membros dos seus grupos.{' '}
                <Link to="/groups" className="text-primary underline">
                  Ver grupos
                </Link>
              </p>
            ) : (
              <select
                id="user_id"
                className="flex h-10 w-full rounded-2xl border-2 border-input bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                {...register('user_id', {
                  required: isForAnotherUser ? 'Selecione um usuário' : false,
                  valueAsNumber: true,
                })}
                onChange={(e) => {
                  const value = e.target.value;
                  setValue('user_id', value ? Number.parseInt(value, 10) : undefined);
                }}
                aria-invalid={errors.user_id ? 'true' : 'false'}
              >
                <option value="">Selecione um usuário</option>
                {availableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username} ({user.email})
                  </option>
                ))}
              </select>
            )}
            {errors.user_id && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-destructive"
                role="alert"
              >
                {errors.user_id.message}
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
