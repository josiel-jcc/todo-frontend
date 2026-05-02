import { useState } from 'react';
import { useNavigate } from 'react-router';
import type { components } from '@/api';
import { triggerTaskCompleteConfetti } from '@/lib/confetti';
import { useComments } from '../../../hooks/useComments';
import { useTasks } from '../../../hooks/useTasks';

type Task = components['schemas']['models.Task'];

interface UseTaskDetailActionsProps {
  task: Task | undefined;
  taskId: number;
}

export const useTaskDetailActions = ({ task, taskId }: UseTaskDetailActionsProps) => {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteCommentConfirm, setShowDeleteCommentConfirm] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);

  const { toggleTaskCompletion, isTogglingCompletion, deleteTask, isDeletingTask } = useTasks(
    undefined,
    { queryEnabled: false }
  );

  const {
    comments,
    isLoadingComments,
    createComment,
    updateComment,
    deleteComment,
    isCreatingComment,
    isUpdatingComment,
    isDeletingComment,
  } = useComments(taskId);

  const handleToggleComplete = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (task) {
      const newCompletedState = !task.completed;

      if (newCompletedState && !task.completed && e) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        triggerTaskCompleteConfetti(x, y);
        setIsAnimating(true);
      } else {
        setIsAnimating(false);
      }

      toggleTaskCompletion(task, newCompletedState);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    if (task) {
      deleteTask(task.id, {
        onSuccess: () => {
          navigate('/tasks');
        },
      });
    }
    setShowDeleteConfirm(false);
  };

  const handleCreateComment = (content: string) => {
    if (!task) return;
    createComment(
      { content, task_id: task.id },
      {
        onSuccess: () => {
          // Comment list will auto-refresh via query invalidation
        },
      }
    );
  };

  const handleEditComment = (id: number, content: string) => {
    updateComment({ id, data: { content } });
  };

  const handleDeleteComment = (id: number) => {
    setCommentToDelete(id);
    setShowDeleteCommentConfirm(true);
  };

  const handleDeleteCommentConfirm = () => {
    if (commentToDelete !== null) {
      deleteComment(commentToDelete);
      setCommentToDelete(null);
    }
    setShowDeleteCommentConfirm(false);
  };

  const isEditingComment = (_id: number) => isUpdatingComment;
  const isDeletingCommentById = (_id: number) => isDeletingComment;

  return {
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
    commentToDelete,
    setCommentToDelete,
  };
};
