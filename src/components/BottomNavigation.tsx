import { motion } from 'framer-motion';
import { Calendar, Home, Plus, Search, Send, Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import { useTaskForm } from '@/contexts/TaskFormContext';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';
import { Button } from './ui/button';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: 'Início', path: '/tasks' },
  { icon: Search, label: 'Buscar', path: '/search' },
  { icon: Send, label: 'Deleguei', path: '/tasks/assigned' },
  { icon: Calendar, label: 'Hoje', path: '/tasks/today' },
  { icon: Settings, label: 'Configurações', path: '/settings' },
];

export const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { openForm, isOpen } = useTaskForm();

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  const handleAddClick = () => {
    // Open task form modal (global)
    openForm();
  };

  return (
    <>
      {/* Mobile: Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
        <div className="relative">
          {/* Navigation Bar */}
          <div className="rounded-t-3xl border-t bg-card/95 backdrop-blur-sm shadow-lg">
            <div className="flex items-center justify-between px-4 pb-4 pt-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <button
                    type="button"
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={cn(
                      'flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-colors',
                      isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Floating Add Button - Overlapping navigation */}
      <motion.div
        className={cn(
          'fixed bottom-14 left-1/2 -translate-x-1/2 z-50 md:hidden transition-opacity duration-300',
          isOpen && 'opacity-0 pointer-events-none'
        )}
        initial={false}
        animate={{
          scale: isOpen ? 0.8 : 1,
          opacity: isOpen ? 0 : 1,
        }}
        whileHover={{ scale: isOpen ? 0.8 : 1.1 }}
        whileTap={{ scale: isOpen ? 0.8 : 0.9 }}
      >
        <Button
          onClick={handleAddClick}
          size="icon"
          className="h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl"
          disabled={isOpen}
          aria-label="Adicionar tarefa"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </motion.div>

      {/* Desktop: Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-20 flex-col items-center py-6 border-r bg-card z-40">
        <div className="flex flex-col items-center gap-6 w-full">
          {/* Logo at top */}
          <button
            type="button"
            onClick={() => navigate('/tasks')}
            className={cn(
              'p-2 rounded-2xl transition-colors hover:bg-accent',
              location.pathname.startsWith('/tasks') && 'bg-accent'
            )}
            title="Início"
          >
            <Logo size={40} />
          </button>

          {/* Navigation Items */}
          <div className="flex flex-col gap-2 w-full px-2">
            {navItems.slice(1).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'w-full rounded-2xl',
                    isActive && 'bg-primary text-primary-foreground'
                  )}
                  title={item.label}
                >
                  <Icon className="h-5 w-5" />
                </Button>
              );
            })}
          </div>

          {/* Add Button */}
          <motion.div className="mt-auto" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              onClick={handleAddClick}
              size="icon"
              className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground shadow-lg hover:shadow-xl"
              title="Adicionar tarefa"
              aria-label="Adicionar tarefa"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </motion.div>
        </div>
      </aside>
    </>
  );
};
