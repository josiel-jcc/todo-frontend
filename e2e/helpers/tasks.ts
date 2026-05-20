import type { Locator, Page } from '@playwright/test';

/** Task title appears in multiple sections (hoje, em andamento, todas). */
export function taskTitle(page: Page, title: string): Locator {
  return page.getByRole('heading', { name: title, level: 3 }).first();
}

export function taskCard(page: Page, title: string): Locator {
  return page.locator('[role="button"]').filter({ hasText: title }).first();
}
