const STORAGE_KEY = 'pwa_install_banner';
const SNOOZE_MS = 7 * 24 * 60 * 60 * 1000;

export interface PwaInstallDismissState {
  permanent: boolean;
  snoozedUntil: number | null;
}

export const getPwaInstallDismissState = (): PwaInstallDismissState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { permanent: false, snoozedUntil: null };
    }

    const parsed = JSON.parse(raw) as Partial<PwaInstallDismissState>;
    return {
      permanent: parsed.permanent === true,
      snoozedUntil: typeof parsed.snoozedUntil === 'number' ? parsed.snoozedUntil : null,
    };
  } catch {
    return { permanent: false, snoozedUntil: null };
  }
};

export const shouldShowPwaInstallBanner = (): boolean => {
  const state = getPwaInstallDismissState();
  if (state.permanent) {
    return false;
  }

  if (state.snoozedUntil !== null && Date.now() < state.snoozedUntil) {
    return false;
  }

  return true;
};

export const snoozePwaInstallBanner = (): void => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      permanent: false,
      snoozedUntil: Date.now() + SNOOZE_MS,
    } satisfies PwaInstallDismissState)
  );
};

export const dismissPwaInstallBannerPermanently = (): void => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      permanent: true,
      snoozedUntil: null,
    } satisfies PwaInstallDismissState)
  );
};

export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia('(max-width: 767px)').matches;
};

export const isStandaloneApp = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
};

export const isIosDevice = (): boolean => {
  if (typeof navigator === 'undefined') {
    return false;
  }

  return /iphone|ipad|ipod/i.test(navigator.userAgent);
};
