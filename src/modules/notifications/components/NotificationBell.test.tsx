import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { render as renderWithProviders } from '@/test/utils';
import { NotificationBell } from './NotificationBell';

vi.mock('../hooks/useInAppNotifications', () => ({
  useInAppNotifications: () => ({
    data: {
      notifications: [
        {
          id: 2,
          user_id: 1,
          type: 'task_reminder',
          payload: JSON.stringify({
            task_id: 42,
            title: 'Comprar leite',
            due_date: '2026-05-22T15:00:00Z',
            minutes_before: 10,
          }),
          read: false,
          created_at: '2026-05-22T14:00:00Z',
        },
      ],
    },
    isLoading: false,
  }),
  useUnreadNotificationCount: () => ({ data: 1 }),
}));

describe('NotificationBell', () => {
  it('renders task_reminder notification with task link', async () => {
    const user = userEvent.setup();

    renderWithProviders(<NotificationBell />);

    await user.click(screen.getByRole('button', { name: /notificações/i }));

    expect(await screen.findByText(/lembrete de tarefa/i)).toBeInTheDocument();
    expect(screen.getByText(/comprar leite/i)).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /lembrete de tarefa/i });
    expect(link).toHaveAttribute('href', '/tasks/42');
  });
});
