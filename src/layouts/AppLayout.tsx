import { motion } from 'framer-motion';
import { useState } from 'react';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UserMenu } from '@/components/UserMenu';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { NotificationBell } from '@/modules/notifications/components/NotificationBell';
import { TaskFormOverlay } from '@/modules/tasks/components/TaskFormOverlay';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { user, logout, isLoggingOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile: Simplified Header */}
      <motion.header
        className="border-b md:hidden"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Logo size={32} />
            <h1 className="text-lg font-bold">App de Tarefas</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user && <NotificationBell />}
            {user && (
              <UserMenu
                user={user}
                onLogout={logout}
                isLoggingOut={isLoggingOut}
                isOpen={isMobileMenuOpen}
                onOpenChange={setIsMobileMenuOpen}
                variant="mobile"
              />
            )}
          </div>
        </div>
      </motion.header>

      {/* Desktop: Header with sidebar space */}
      <motion.header
        className="hidden md:block border-b"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="ml-20 flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">App de Tarefas</h1>
            {user && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Olá,</span>
                <span className="font-semibold text-foreground">{user.username}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user && <NotificationBell />}
            {user && (
              <UserMenu
                user={user}
                onLogout={logout}
                isLoggingOut={isLoggingOut}
                isOpen={isDesktopMenuOpen}
                onOpenChange={setIsDesktopMenuOpen}
                variant="desktop"
              />
            )}
          </div>
        </div>
      </motion.header>

      {/* Main content with padding for navigation */}
      <main className="flex-1 pb-24 md:pb-0 md:ml-20 md:pt-0">{children}</main>

      {/* Global Task Form (mobile: bottom sheet, desktop: modal) */}
      <TaskFormOverlay />

      {/* Bottom Navigation (mobile) / Sidebar (desktop) */}
      <BottomNavigation />
    </div>
  );
};
