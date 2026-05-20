import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';
import { resetStore } from './store';

export const worker = setupWorker(...handlers);

declare global {
  interface Window {
    __MSW_READY__?: boolean;
  }
}

export async function startMsw(): Promise<void> {
  resetStore();
  await worker.start({
    onUnhandledRequest: 'bypass',
    quiet: true,
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  });
  window.__MSW_READY__ = true;
}
