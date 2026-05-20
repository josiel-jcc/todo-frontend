import { expect, test } from '../fixtures/auth';
import { taskTitle } from '../helpers/tasks';

test.describe('Busca de tarefas', () => {
  test('filtra tarefas pelo termo de busca', async ({ authenticatedPage: page }) => {
    await page.goto('/search');
    await page.getByLabel('Buscar').fill('Reunião');

    await expect(taskTitle(page, 'Reunião de equipe')).toBeVisible();
    await expect(taskTitle(page, 'Tarefa de teste E2E')).not.toBeVisible();
  });

  test('limpa busca e restaura resultados', async ({ authenticatedPage: page }) => {
    await page.goto('/search');
    const searchInput = page.getByLabel('Buscar');
    await searchInput.fill('Reunião');
    await expect(taskTitle(page, 'Reunião de equipe')).toBeVisible();

    await searchInput.clear();
    await expect(taskTitle(page, 'Tarefa de teste E2E')).toBeVisible({ timeout: 15_000 });
  });
});
