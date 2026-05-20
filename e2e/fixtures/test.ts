import { test as base } from '@playwright/test';
import { installApiMocks } from './apiMock';

export const test = base.extend({
  page: async ({ page }, use) => {
    await installApiMocks(page);
    await use(page);
  },
});

export { expect } from '@playwright/test';
