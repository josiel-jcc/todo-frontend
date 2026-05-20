import type { Page } from '@playwright/test';
import { test as base } from './test';

const E2E_USER = {
  id: 1,
  username: 'e2euser',
  email: 'e2e@test.com',
  notifications_enabled: false,
  telegram_chat_id: '',
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
};

export async function seedAuthenticatedSession(page: Page): Promise<void> {
  await page.addInitScript(
    ({ user, token }) => {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
    },
    { user: E2E_USER, token: 'e2e-mock-token' }
  );
}

export const test = base.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ page }, use) => {
    await seedAuthenticatedSession(page);
    await page.goto('/tasks');
    await use(page);
  },
});

export { expect } from './test';
