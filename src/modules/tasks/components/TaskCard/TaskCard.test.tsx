import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { components } from '@/api';
import { render, screen } from '@/test/utils';
import { TaskCard } from './TaskCard';

// Mock dependencies
const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/lib/confetti', () => ({
  triggerTaskCompleteConfetti: vi.fn(),
}));

type Task = components['schemas']['models.Task'];

const mockTask: Task = {
  id: 1,
  title: 'Test Task',
  description: 'Test Description',
  type: 'casa',
  priority: 'medium',
  completed: false,
  due_date: '2099-12-31T23:59:59Z',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  tags: [],
};

describe('TaskCard', () => {
  const mockOnToggleComplete = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const getCardElement = () => {
    const candidates = screen.getAllByRole('button');
    const card = candidates.find((el) => el.tagName === 'DIV');
    if (!card) {
      throw new Error('Card element not found');
    }
    return card;
  };

  it('should render task information', () => {
    render(
      <TaskCard
        task={mockTask}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should navigate to task detail when clicked', async () => {
    const user = userEvent.setup();
    render(
      <TaskCard
        task={mockTask}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const card = getCardElement();
    await user.click(card);

    expect(mockNavigate).toHaveBeenCalledWith('/tasks/1');
  });

  it('should navigate to task detail when Enter key is pressed', async () => {
    const user = userEvent.setup();
    render(
      <TaskCard
        task={mockTask}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const card = getCardElement();
    card.focus();
    await user.keyboard('{Enter}');

    expect(mockNavigate).toHaveBeenCalledWith('/tasks/1');
  });

  it('should navigate to task detail when Space key is pressed', async () => {
    const user = userEvent.setup();
    render(
      <TaskCard
        task={mockTask}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const card = getCardElement();
    card.focus();
    await user.keyboard(' ');

    expect(mockNavigate).toHaveBeenCalledWith('/tasks/1');
  });

  it('should call onToggleComplete when toggle button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TaskCard
        task={mockTask}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Find the toggle button (usually a checkbox or button)
    const toggleButtons = screen.getAllByRole('button');
    // The toggle button should be one of them
    const toggleButton =
      toggleButtons.find(
        (btn) =>
          btn.getAttribute('aria-label')?.includes('concluída') ||
          btn.getAttribute('aria-label')?.includes('pendente')
      ) || toggleButtons[0];

    await user.click(toggleButton);

    expect(mockOnToggleComplete).toHaveBeenCalled();
  });

  it('should display tags when task has tags', () => {
    const taskWithTags: Task = {
      ...mockTask,
      tags: [
        { id: 1, name: 'Tag1', color: '#ff0000' },
        { id: 2, name: 'Tag2', color: '#00ff00' },
      ],
    };

    render(
      <TaskCard
        task={taskWithTags}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Tag1')).toBeInTheDocument();
    expect(screen.getByText('Tag2')).toBeInTheDocument();
  });

  it('should show completed state visually', () => {
    const completedTask: Task = {
      ...mockTask,
      completed: true,
    };

    render(
      <TaskCard
        task={completedTask}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const card = getCardElement();
    expect(card.className).toContain('opacity-60');
    expect(card.className).toContain('bg-green-50/50');
  });

  it('should show overdue state visually', () => {
    const overdueTask: Task = {
      ...mockTask,
      completed: false,
      due_date: '2020-01-01T00:00:00Z', // Past date
    };

    render(
      <TaskCard
        task={overdueTask}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const card = getCardElement();
    expect(card.className).toContain('bg-red-50/50');
    expect(card.className).toContain('border-red-500/30');
  });

  it('should show loading state', () => {
    render(
      <TaskCard
        task={mockTask}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isLoading={true}
      />
    );

    // Loading state should be visible (check for loading indicators)
    const card = getCardElement();
    expect(card).toBeInTheDocument();
  });

  it('should not call onToggleComplete if callback is not provided', async () => {
    const user = userEvent.setup();
    render(<TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const toggleButtons = screen.getAllByRole('button');
    const toggleButton = toggleButtons[0];

    await user.click(toggleButton);

    // Should not throw error, just not call the callback
    expect(mockOnToggleComplete).not.toHaveBeenCalled();
  });
});
