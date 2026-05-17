import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@/test/utils';
import { TaskForm } from './TaskForm';

vi.mock('@/modules/auth/hooks/useAuth', () => ({
  useAuth: () => ({ user: { id: 999 } }),
}));

vi.mock('@/modules/tasks/hooks/useUsers', () => ({
  useUsers: () => ({
    users: [
      { id: 1, username: 'user1', email: 'user1@example.com' },
      { id: 2, username: 'user2', email: 'user2@example.com' },
    ],
    isLoadingUsers: false,
  }),
}));

vi.mock('@/modules/tasks/hooks/useTags', () => ({
  useTags: () => ({
    tags: [
      { id: 1, name: 'Tag1', color: '#ff0000' },
      { id: 2, name: 'Tag2', color: '#00ff00' },
    ],
    isLoadingTags: false,
  }),
}));

describe('TaskForm Integration', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should submit valid form data', async () => {
    const user = userEvent.setup();

    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await user.type(screen.getByLabelText(/título/i), 'New Task');
    await user.type(screen.getByLabelText(/descrição/i), 'Task Description');

    // due_date is pre-filled with a sensible default by the date picker
    await user.click(screen.getByRole('button', { name: /criar tarefa/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Task',
          description: 'Task Description',
          type: 'casa',
        })
      );
    });
  });

  it('should validate form before submission', async () => {
    const user = userEvent.setup();

    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await user.click(screen.getByRole('button', { name: /criar tarefa/i }));

    await waitFor(() => {
      expect(screen.getByText(/o título é obrigatório/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();

    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await user.click(screen.getByRole('button', { name: /cancelar/i }));

    expect(mockOnCancel).toHaveBeenCalled();
  });
});
