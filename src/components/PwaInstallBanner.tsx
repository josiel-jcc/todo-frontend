import { AnimatePresence, motion } from 'framer-motion';
import { Share, Smartphone, X } from 'lucide-react';
import { useLocation } from 'react-router';
import { BottomSheet } from '@/components/BottomSheet';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { usePwaInstall } from '@/hooks/usePwaInstall';
import { cn } from '@/lib/utils';

const routesWithBottomNav = ['/tasks', '/search', '/finance', '/settings'];

export const PwaInstallBanner = () => {
  const location = useLocation();
  const { visible, canInstall, install, snooze, dismissPermanently, showIosGuide, closeIosGuide } =
    usePwaInstall();

  const hasBottomNav = routesWithBottomNav.some(
    (route) => location.pathname === route || location.pathname.startsWith(`${route}/`)
  );

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.25 }}
            className={cn(
              'fixed left-4 right-4 z-40 md:hidden',
              hasBottomNav ? 'bottom-20' : 'bottom-4'
            )}
            aria-live="polite"
          >
            <div className="rounded-2xl border bg-card/95 p-4 shadow-lg backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 shrink-0">
                  <Logo size={36} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">Instale o app no celular</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Acesse suas tarefas mais rápido com um ícone na tela inicial.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button size="sm" onClick={install} disabled={!canInstall}>
                      <Smartphone className="h-4 w-4" />
                      Instalar
                    </Button>
                    <Button size="sm" variant="ghost" onClick={snooze}>
                      Agora não
                    </Button>
                  </div>
                  <button
                    type="button"
                    onClick={dismissPermanently}
                    className="mt-2 text-xs text-muted-foreground underline-offset-2 hover:underline"
                  >
                    Não quero instalar
                  </button>
                </div>
                <button
                  type="button"
                  onClick={snooze}
                  className="shrink-0 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Fechar banner de instalação"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <BottomSheet isOpen={showIosGuide} onClose={closeIosGuide} title="Instalar no iPhone">
        <div className="space-y-4 px-4 pb-6 text-sm text-muted-foreground">
          <p>Para instalar o App de Tarefas na tela inicial do iPhone:</p>
          <ol className="list-decimal space-y-4 pl-5">
            <li>
              Toque no botão <Share className="mx-1 inline h-4 w-4 align-text-bottom" />{' '}
              <strong className="text-foreground">Compartilhar</strong> na barra do Safari.
            </li>
            <li>
              Role as opções e toque em{' '}
              <strong className="text-foreground">Adicionar à Tela de Início</strong>.
            </li>
            <li>
              Confirme tocando em <strong className="text-foreground">Adicionar</strong>.
            </li>
          </ol>
          <Button className="w-full" onClick={closeIosGuide}>
            Entendi
          </Button>
        </div>
      </BottomSheet>
    </>
  );
};
