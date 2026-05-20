import { expect, test } from '../fixtures/auth';
import { taskTitle } from '../helpers/tasks';

test.describe('Navegação principal', () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await expect(taskTitle(page, 'Tarefa de teste E2E')).toBeVisible();
  });

  test('navega para Buscar', async ({ authenticatedPage: page }) => {
    await page.getByRole('button', { name: 'Buscar' }).click();
    await expect(page).toHaveURL(/\/search$/);
    await expect(page.getByLabel('Buscar')).toBeVisible();
  });

  test('navega para Deleguei', async ({ authenticatedPage: page }) => {
    await page.getByRole('button', { name: 'Deleguei' }).click();
    await expect(page).toHaveURL(/\/tasks\/assigned$/);
    await expect(page.getByRole('heading', { name: 'Tarefas que deleguei' })).toBeVisible();
  });

  test('navega para Hoje', async ({ authenticatedPage: page }) => {
    await page.getByRole('button', { name: 'Hoje' }).click();
    await expect(page).toHaveURL(/\/tasks\/today$/);
  });

  test('navega para Configurações via menu do usuário', async ({ authenticatedPage: page }) => {
    await page.locator('header').getByRole('button').last().click();
    await page.getByRole('menuitem', { name: 'Configurações' }).click();
    await expect(page).toHaveURL(/\/settings$/);
    await expect(page.getByRole('heading', { name: 'Configurações' })).toBeVisible();
  });

  test('volta para Início', async ({ authenticatedPage: page }) => {
    await page.getByRole('button', { name: 'Buscar' }).click();
    await expect(page).toHaveURL(/\/search$/);
    await page.getByTitle('Início').click();
    await expect(page).toHaveURL(/\/tasks$/);
  });
});
