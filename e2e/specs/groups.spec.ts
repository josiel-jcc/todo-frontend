import { expect, test } from '../fixtures/auth';

test.describe('Grupos', () => {
  test('lista grupo padrão na página de grupos', async ({ authenticatedPage: page }) => {
    await page.goto('/groups');
    await expect(page.getByRole('heading', { name: 'Grupos', exact: true })).toBeVisible();
    await expect(page.getByText('Os de casa')).toBeVisible();
  });

  test('cria um novo grupo', async ({ authenticatedPage: page }) => {
    await page.goto('/groups');
    await page.getByLabel('Nome do grupo').fill('Equipe E2E');
    await page.getByRole('button', { name: 'Criar grupo' }).click();
    await expect(page.getByText('Equipe E2E')).toBeVisible();
  });
});
