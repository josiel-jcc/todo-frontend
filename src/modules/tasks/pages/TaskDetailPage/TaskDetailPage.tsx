import { useNavigate, useParams } from 'react-router';
import { ConfirmDialog, Loading } from '@/components';
import { PageShell } from '@/components/PageShell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { parseRouteId } from '@/utils/routeParams';
import { useTask } from '../../hooks/useTask';
import { useTaskDetailActions } from './hooks/useTaskDetailActions';
import { TaskDetailComments } from './TaskDetailComments';
import { TaskDetailCardHeader, TaskDetailHeader } from './TaskDetailHeader';
import { TaskDetailInfo } from './TaskDetailInfo';
import { TaskDetailShareSection } from './TaskDetailShareSection';

export const TaskDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const taskId = parseRouteId(id) ?? 0;

  const { data: task, isLoading, error } = useTask(taskId);

  const {
    isAnimating,
    setIsAnimating,
    handleToggleComplete,
    handleDelete,
    handleDeleteConfirm,
    handleCreateComment,
    handleEditComment,
    handleDeleteComment,
    handleDeleteCommentConfirm,
    comments,
    isLoadingComments,
    isTogglingCompletion,
    isDeletingTask,
    isCreatingComment,
    isEditingComment,
    isDeletingCommentById,
    showDeleteConfirm,
    setShowDeleteConfirm,
    showDeleteCommentConfirm,
    setShowDeleteCommentConfirm,
  } = useTaskDetailActions({ task, taskId });

  if (!taskId) {
    return (
      <PageShell size="wide">
        <div className="text-center py-12">
          <p className="text-destructive">ID de tarefa inválido</p>
          <Button variant="outline" onClick={() => navigate('/tasks')} className="mt-4">
            Voltar para tarefas
          </Button>
        </div>
      </PageShell>
    );
  }

  if (isLoading) {
    return (
      <PageShell size="wide">
        <div className="flex justify-center py-12">
          <Loading />
        </div>
      </PageShell>
    );
  }

  if (error || !task) {
    return (
      <PageShell size="wide">
        <div className="text-center py-12">
          <p className="text-destructive">Erro ao carregar a tarefa</p>
          <Button variant="outline" onClick={() => navigate('/tasks')} className="mt-4">
            Voltar para tarefas
          </Button>
        </div>
      </PageShell>
    );
  }

  const isOverdue = !task.completed && new Date(task.due_date) < new Date();
  const isTaskOwner = user?.id === task.user_id;

  return (
    <PageShell size="wide">
      {/* Dialog de confirmação de exclusão de tarefa */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        title="Excluir Tarefa"
        description={`Tem certeza que deseja excluir a tarefa "${task.title}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="destructive"
        isLoading={isDeletingTask}
      />

      {/* Dialog de confirmação de exclusão de comentário */}
      <ConfirmDialog
        isOpen={showDeleteCommentConfirm}
        onClose={() => setShowDeleteCommentConfirm(false)}
        onConfirm={handleDeleteCommentConfirm}
        title="Excluir Comentário"
        description="Tem certeza que deseja excluir este comentário? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="destructive"
        isLoading={isDeletingCommentById(0)}
      />

      <TaskDetailHeader
        task={task}
        isAnimating={isAnimating}
        isTogglingCompletion={isTogglingCompletion}
        onToggleComplete={handleToggleComplete}
        onBack={() => navigate('/tasks')}
      />

      <Card
        className={cn(
          'rounded-3xl',
          // Backgrounds sutis baseados no status
          task.completed &&
            'bg-green-50/50 dark:bg-green-950/20 border-2 border-green-500/30 opacity-60',
          !task.completed &&
            isOverdue &&
            'bg-red-50/50 dark:bg-red-950/20 border-2 border-red-500/30',
          !task.completed && !isOverdue && 'bg-card border'
        )}
      >
        <TaskDetailCardHeader
          task={task}
          isAnimating={isAnimating}
          isTogglingCompletion={isTogglingCompletion}
          onToggleComplete={handleToggleComplete}
        />
        <TaskDetailInfo
          task={task}
          isOverdue={isOverdue}
          onEdit={() => navigate(`/tasks?edit=${task.id}`)}
          onDelete={handleDelete}
          isDeleting={isDeletingTask}
        />
      </Card>

      {isTaskOwner && <TaskDetailShareSection task={task} />}

      <TaskDetailComments
        taskId={task.id}
        commentsCount={comments.length}
        onCreateComment={handleCreateComment}
        onEditComment={handleEditComment}
        onDeleteComment={handleDeleteComment}
        isLoadingComments={isLoadingComments}
        isCreatingComment={isCreatingComment}
        isEditingComment={isEditingComment}
        isDeletingCommentById={isDeletingCommentById}
        comments={comments}
      />
    </PageShell>
  );
};
