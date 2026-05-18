import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { render, screen, waitFor } from '@/test/utils';
import { RegisterForm } from './RegisterForm';

// Mock dependencies
vi.mock('@/modules/auth/hooks/useAuth');

describe('RegisterForm', () => {
  const mockRegister = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      register: mockRegister,
      isRegistering: false,
      registerError: null,
      user: null,
      isLoadingUser: false,
      isAuthenticated: false,
      login: vi.fn(),
      loginAsync: vi.fn(),
      isLoggingIn: false,
      loginError: null,
      registerAsync: vi.fn(),
      logout: vi.fn(),
      isLoggingOut: false,
    });
  });

  it('should render register form', () => {
    render(<RegisterForm />);

    expect(screen.getByRole('heading', { name: 'Criar conta' })).toBeInTheDocument();
    expect(screen.getByLabelText(/nome de usuário/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^senha$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /criar conta/i })).toBeInTheDocument();
  });

  it('should show validation errors for empty fields', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const submitButton = screen.getByRole('button', { name: /criar conta/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/o nome de usuário deve ter no mínimo 3 caracteres/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/informe um endereço de e-mail válido/i)).toBeInTheDocument();
      expect(screen.getByText(/a senha deve ter no mínimo 8 caracteres/i)).toBeInTheDocument();
      expect(screen.getByText(/confirme sua senha/i)).toBeInTheDocument();
      expect(screen.getByText(/você deve aceitar a política de privacidade/i)).toBeInTheDocument();
    });

    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('should validate username minimum length', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const usernameInput = screen.getByLabelText(/nome de usuário/i);
    await user.type(usernameInput, 'ab');

    const submitButton = screen.getByRole('button', { name: /criar conta/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/o nome de usuário deve ter no mínimo 3 caracteres/i)
      ).toBeInTheDocument();
    });

    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('should validate email format', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const usernameInput = screen.getByLabelText(/nome de usuário/i);
    const emailInput = screen.getByLabelText(/e-mail/i);
    const passwordInput = screen.getByLabelText(/^senha$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmar senha/i);

    await user.type(usernameInput, 'testuser');
    await user.type(emailInput, 'invalid-email');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');

    const submitButton = screen.getByRole('button', { name: /criar conta/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/informe um endereço de e-mail válido/i)).toBeInTheDocument();
    });

    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('should validate password minimum length', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const usernameInput = screen.getByLabelText(/nome de usuário/i);
    const emailInput = screen.getByLabelText(/e-mail/i);
    const passwordInput = screen.getByLabelText(/^senha$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmar senha/i);

    await user.type(usernameInput, 'testuser');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, '12345');
    await user.type(confirmPasswordInput, '12345');

    const submitButton = screen.getByRole('button', { name: /criar conta/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/a senha deve ter no mínimo 8 caracteres/i)).toBeInTheDocument();
    });

    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('should validate password confirmation match', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const usernameInput = screen.getByLabelText(/nome de usuário/i);
    const emailInput = screen.getByLabelText(/e-mail/i);
    const passwordInput = screen.getByLabelText(/^senha$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmar senha/i);

    await user.type(usernameInput, 'testuser');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'differentpassword');

    const submitButton = screen.getByRole('button', { name: /criar conta/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/as senhas não coincidem/i)).toBeInTheDocument();
    });

    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const usernameInput = screen.getByLabelText(/nome de usuário/i);
    const emailInput = screen.getByLabelText(/e-mail/i);
    const passwordInput = screen.getByLabelText(/^senha$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmar senha/i);
    const submitButton = screen.getByRole('button', { name: /criar conta/i });

    await user.type(usernameInput, 'testuser');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');
    await user.click(screen.getByRole('checkbox'));
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should show loading state when registering', () => {
    vi.mocked(useAuth).mockReturnValue({
      register: mockRegister,
      isRegistering: true,
      registerError: null,
      user: null,
      isLoadingUser: false,
      isAuthenticated: false,
      login: vi.fn(),
      loginAsync: vi.fn(),
      isLoggingIn: false,
      loginError: null,
      registerAsync: vi.fn(),
      logout: vi.fn(),
      isLoggingOut: false,
    });

    render(<RegisterForm />);

    expect(screen.getByRole('button', { name: /criando conta/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /criando conta/i })).toBeDisabled();
  });

  it('should show error message when registration fails', () => {
    const mockError = new Error('Usuário já existe');
    vi.mocked(useAuth).mockReturnValue({
      register: mockRegister,
      isRegistering: false,
      registerError: mockError,
      user: null,
      isLoadingUser: false,
      isAuthenticated: false,
      login: vi.fn(),
      loginAsync: vi.fn(),
      isLoggingIn: false,
      loginError: null,
      registerAsync: vi.fn(),
      logout: vi.fn(),
      isLoggingOut: false,
    });

    render(<RegisterForm />);

    expect(screen.getByText('Usuário já existe')).toBeInTheDocument();
  });
});
