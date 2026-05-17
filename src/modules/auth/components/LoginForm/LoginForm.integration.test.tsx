import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as api from '@/api';
import { render, screen, waitFor } from '@/test/utils';
import { LoginForm } from './LoginForm';

// Mock dependencies
vi.mock('@/api', () => ({
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  isAuthenticated: vi.fn(),
  getStoredUser: vi.fn(),
}));

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  const mockNavigate = vi.fn();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('LoginForm Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.isAuthenticated).mockReturnValue(false);
    vi.mocked(api.getStoredUser).mockReturnValue(null);
  });

  it('should complete full login flow', async () => {
    const user = userEvent.setup();
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
    };
    const mockAuthResponse = {
      token: 'mock-token',
      user: mockUser,
    };

    vi.mocked(api.login).mockResolvedValue(mockAuthResponse);

    render(<LoginForm />);

    // Fill form
    const usernameInput = screen.getByLabelText(/nome de usuário ou e-mail/i);
    const passwordInput = screen.getByLabelText(/^senha$/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    // Verify API was called
    await waitFor(() => {
      expect(api.login).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
      });
    });

    // Verify navigation (would be called by useAuth hook)
    // This is tested indirectly through the hook tests
  });

  it('should handle login error and show error message', async () => {
    const user = userEvent.setup();
    const mockError = new Error('Credenciais inválidas');

    vi.mocked(api.login).mockRejectedValue(mockError);

    render(<LoginForm />);

    const usernameInput = screen.getByLabelText(/nome de usuário ou e-mail/i);
    const passwordInput = screen.getByLabelText(/^senha$/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
    });
  });

  it('should validate form before submission', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const submitButton = screen.getByRole('button', { name: /entrar/i });
    await user.click(submitButton);

    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText(/nome de usuário ou e-mail é obrigatório/i)).toBeInTheDocument();
      expect(screen.getByText(/senha é obrigatória/i)).toBeInTheDocument();
    });

    // Should not call API
    expect(api.login).not.toHaveBeenCalled();
  });
});
