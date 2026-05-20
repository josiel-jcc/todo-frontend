import type { Page } from '@playwright/test';
import { resolveApiRequest } from '@/test/msw/apiRouter';
import { getStore, resetStore } from '@/test/msw/store';

export async function installApiMocks(page: Page): Promise<void> {
  resetStore();

  await page.route('**/api/v1/**', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    let body: Record<string, unknown> | undefined;

    if (request.method() !== 'GET' && request.postData()) {
      try {
        body = request.postDataJSON() as Record<string, unknown>;
      } catch {
        body = undefined;
      }
    }

    const response = resolveApiRequest(
      getStore(),
      request.method(),
      url.pathname,
      url.searchParams,
      body
    );

    if (!response) {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: response.status,
      contentType: 'application/json',
      body: JSON.stringify(response.body),
    });
  });
}
