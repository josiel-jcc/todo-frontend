import { expect, test } from '../fixtures/auth';
import { taskCard, taskTitle } from '../helpers/tasks';

test.describe('Detalhe da tarefa', () => {
  test('abre detalhe ao clicar no card', async ({ authenticatedPage: page }) => {
    await page.goto('/tasks');
    await taskCard(page, 'Tarefa de teste E2E').click();

    await expect(page).toHaveURL(/\/tasks\/1$/);
    await expect(page.getByRole('heading', { name: 'Detalhes da Tarefa' })).toBeVisible();
    await expect(taskTitle(page, 'Tarefa de teste E2E')).toBeVisible();
    await expect(page.getByText('Primeira tarefa seed para listagem')).toBeVisible();
  });

  test('exclui tarefa no detalhe e retorna para /tasks', async ({ authenticatedPage: page }) => {
    await page.goto('/tasks/2');
    await expect(taskTitle(page, 'Reunião de equipe')).toBeVisible();

    await page.getByRole('button', { name: 'Excluir' }).click();
    await expect(page.getByRole('heading', { name: 'Excluir Tarefa' })).toBeVisible();
    await page.locator('[class*="z-[201]"]').getByRole('button', { name: 'Excluir' }).click();

    await expect(page).toHaveURL(/\/tasks$/);
    await expect(taskTitle(page, 'Reunião de equipe')).not.toBeVisible();
  });
});
