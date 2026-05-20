import { useCallback, useEffect, useState } from 'react';
import {
  dismissPwaInstallBannerPermanently,
  isIosDevice,
  isMobileDevice,
  isStandaloneApp,
  shouldShowPwaInstallBanner,
  snoozePwaInstallBanner,
} from '@/lib/pwaInstall';

export const usePwaInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    if (!isMobileDevice() || isStandaloneApp() || !shouldShowPwaInstallBanner()) {
      return;
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    const handleAppInstalled = () => {
      setVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (isIosDevice()) {
      setVisible(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    if (isIosDevice()) {
      setShowIosGuide(true);
      return;
    }

    if (!deferredPrompt) {
      return;
    }

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setVisible(false);
    }

    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const snooze = useCallback(() => {
    snoozePwaInstallBanner();
    setVisible(false);
  }, []);

  const dismissPermanently = useCallback(() => {
    dismissPwaInstallBannerPermanently();
    setVisible(false);
  }, []);

  const closeIosGuide = useCallback(() => {
    setShowIosGuide(false);
  }, []);

  return {
    visible,
    canInstall: isIosDevice() || deferredPrompt !== null,
    install,
    snooze,
    dismissPermanently,
    showIosGuide,
    closeIosGuide,
  };
};
