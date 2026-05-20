import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  dismissPwaInstallBannerPermanently,
  getPwaInstallDismissState,
  shouldShowPwaInstallBanner,
  snoozePwaInstallBanner,
} from './pwaInstall';

describe('pwaInstall storage', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('shows banner by default', () => {
    expect(shouldShowPwaInstallBanner()).toBe(true);
  });

  it('snoozes banner for one week', () => {
    const now = 1_700_000_000_000;
    vi.spyOn(Date, 'now').mockReturnValue(now);

    snoozePwaInstallBanner();

    expect(getPwaInstallDismissState()).toEqual({
      permanent: false,
      snoozedUntil: now + 7 * 24 * 60 * 60 * 1000,
    });
    expect(shouldShowPwaInstallBanner()).toBe(false);

    vi.spyOn(Date, 'now').mockReturnValue(now + 7 * 24 * 60 * 60 * 1000);
    expect(shouldShowPwaInstallBanner()).toBe(true);
  });

  it('dismisses banner permanently', () => {
    dismissPwaInstallBannerPermanently();

    expect(getPwaInstallDismissState()).toEqual({
      permanent: true,
      snoozedUntil: null,
    });
    expect(shouldShowPwaInstallBanner()).toBe(false);
  });
});
