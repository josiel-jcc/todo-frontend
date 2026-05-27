import { motion } from 'framer-motion';
import { Calendar, Home, Plus, Search, Send, Settings, Users } from 'lucide-react';
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
  { icon: Users, label: 'Grupos', path: '/groups' },
  { icon: Calendar, label: 'Hoje', path: '/tasks/today' },
  { icon: Settings, label: 'Configurações', path: '/settings' },
];

// Mobile: symmetric 3 | + | 3 layout
const leftNavItems: NavItem[] = [
  { icon: Home, label: 'Início', path: '/tasks' },
  { icon: Search, label: 'Buscar', path: '/search' },
  { icon: Calendar, label: 'Hoje', path: '/tasks/today' },
];

const rightNavItems: NavItem[] = [
  { icon: Send, label: 'Deleguei', path: '/tasks/assigned' },
  { icon: Users, label: 'Grupos', path: '/groups' },
  { icon: Settings, label: 'Configurações', path: '/settings' },
];

function isNavActive(pathname: string, itemPath: string): boolean {
  if (itemPath === '/groups') {
    return pathname.startsWith('/groups');
  }
  return pathname === itemPath;
}

function NavButton({
  item,
  isActive,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full min-w-0 flex-col items-center justify-center gap-1 py-2 rounded-xl transition-colors',
        isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span className="max-w-full truncate text-xs font-medium">{item.label}</span>
    </button>
  );
}

export const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { openForm, isOpen } = useTaskForm();

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  const handleAddClick = () => {
    openForm();
  };

  return (
    <>
      {/* Mobile: Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
        <motion.div className="relative">
          {/* Center FAB — reserved slot, does not cover nav items */}
          <motion.div
            className={cn(
              'absolute left-1/2 top-0 z-50 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300',
              isOpen && 'pointer-events-none opacity-0'
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

          <motion.div className="rounded-t-3xl border-t bg-card/95 backdrop-blur-sm shadow-lg">
            <div className="grid grid-cols-7 items-end px-2 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
              {leftNavItems.map((item) => (
                <NavButton
                  key={item.path}
                  item={item}
                  isActive={isNavActive(location.pathname, item.path)}
                  onClick={() => handleNavClick(item.path)}
                />
              ))}

              <div className="pointer-events-none" aria-hidden="true" />

              {rightNavItems.map((item) => (
                <NavButton
                  key={item.path}
                  item={item}
                  isActive={isNavActive(location.pathname, item.path)}
                  onClick={() => handleNavClick(item.path)}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </nav>

      {/* Desktop: Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-20 flex-col items-center py-6 border-r bg-card z-40">
        <div className="flex flex-col items-center gap-6 w-full">
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

          <div className="flex flex-col gap-2 w-full px-2">
            {navItems.slice(1).map((item) => {
              const Icon = item.icon;
              const isActive = isNavActive(location.pathname, item.path);

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
