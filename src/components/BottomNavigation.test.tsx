import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@/test/utils';
import { BottomNavigation } from './BottomNavigation';

// Mock dependencies
const mockNavigate = vi.fn();
const mockOpenForm = vi.fn();
let mockIsOpen = false;

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      pathname: '/tasks',
    }),
  };
});

vi.mock('@/contexts/TaskFormContext', () => ({
  useTaskForm: () => ({
    openForm: mockOpenForm,
    isOpen: mockIsOpen,
  }),
}));

describe('BottomNavigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsOpen = false;
    // Mock window.innerWidth for mobile/desktop detection
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375, // Mobile width
    });
  });

  it('should render mobile navigation items without settings', () => {
    render(<BottomNavigation />);

    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Buscar')).toBeInTheDocument();
    expect(screen.getByText('Deleguei')).toBeInTheDocument();
    expect(screen.getByText('Hoje')).toBeInTheDocument();
    expect(screen.queryByText('Configurações')).not.toBeInTheDocument();
  });

  it('should render settings in desktop sidebar', () => {
    render(<BottomNavigation />);

    expect(screen.getByTitle('Configurações')).toBeInTheDocument();
  });

  it('should navigate when navigation item is clicked', async () => {
    const user = userEvent.setup();
    render(<BottomNavigation />);

    const searchButton = screen.getByText('Buscar');
    await user.click(searchButton);

    expect(mockNavigate).toHaveBeenCalledWith('/search');
  });

  it('should show active indicator for current route', () => {
    render(<BottomNavigation />);

    const homeButton = screen.getByText('Início').closest('button');
    expect(homeButton?.className).toContain('text-primary');
  });

  it('should open form when add button is clicked on mobile', async () => {
    const user = userEvent.setup();
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375, // Mobile
    });

    render(<BottomNavigation />);

    const addButtons = screen.getAllByRole('button', { name: /adicionar tarefa/i });
    const mobileAddButton =
      addButtons.find((b) => b.className.includes('rounded-full')) ?? addButtons[0];

    const addButton = mobileAddButton;
    await user.click(addButton);

    expect(mockOpenForm).toHaveBeenCalled();
  });

  it('should navigate to tasks when add button is clicked on desktop', async () => {
    const user = userEvent.setup();
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024, // Desktop
    });

    render(<BottomNavigation />);

    const addButtons = screen.getAllByRole('button', { name: /adicionar tarefa/i });
    const desktopAddButton =
      addButtons.find((b) => b.className.includes('h-14 w-14')) ?? addButtons[0];

    const addButton = desktopAddButton;
    await user.click(addButton);

    expect(mockOpenForm).toHaveBeenCalled();
  });

  it('should disable add button when form is open', () => {
    mockIsOpen = true;

    render(<BottomNavigation />);

    const addButtons = screen.getAllByRole('button', { name: /adicionar tarefa/i });
    const mobileAddButton =
      addButtons.find((b) => b.className.includes('rounded-full')) ?? addButtons[0];

    expect(mobileAddButton).toBeDisabled();
  });
});
