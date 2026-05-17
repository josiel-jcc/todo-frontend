import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@/test/utils';
import { TaskFormCreateTag } from './TaskFormCreateTag';

const mockCreateTagAsync = vi.fn();
const mockOnTagCreated = vi.fn();

vi.mock('../../hooks/useTags', () => ({
  useTags: () => ({
    createTagAsync: mockCreateTagAsync,
    isCreatingTag: false,
  }),
}));

describe('TaskFormCreateTag', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateTagAsync.mockResolvedValue({ id: 99, name: 'Urgente', color: '#3B82F6' });
  });

  it('should create a tag and notify parent', async () => {
    const user = userEvent.setup();

    render(<TaskFormCreateTag onTagCreated={mockOnTagCreated} />);

    await user.click(screen.getByRole('button', { name: /nova tag/i }));
    await user.type(screen.getByPlaceholderText(/nome da tag/i), 'Urgente');
    await user.click(screen.getByRole('button', { name: /criar tag/i }));

    await waitFor(() => {
      expect(mockCreateTagAsync).toHaveBeenCalledWith({
        name: 'Urgente',
        color: '#3B82F6',
      });
      expect(mockOnTagCreated).toHaveBeenCalledWith(
        expect.objectContaining({ id: 99, name: 'Urgente' })
      );
    });
  });
});
