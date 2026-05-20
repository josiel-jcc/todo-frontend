import { expect, test } from '../fixtures/auth';
import { taskCard, taskTitle } from '../helpers/tasks';

test.describe('Tarefas — CRUD essencial', () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await expect(taskTitle(page, 'Tarefa de teste E2E')).toBeVisible();
  });

  test('lista tarefas seed na home', async ({ authenticatedPage: page }) => {
    await expect(page.getByRole('heading', { name: 'Todas as tarefas' })).toBeVisible();
    await expect(taskTitle(page, 'Tarefa de teste E2E')).toBeVisible();
    await expect(taskTitle(page, 'Reunião de equipe')).toBeVisible();
  });

  test('cria nova tarefa e exibe na lista', async ({ authenticatedPage: page }) => {
    await page.locator('aside').getByRole('button', { name: 'Adicionar tarefa' }).click();
    await expect(page.getByRole('heading', { name: 'Nova Tarefa' })).toBeVisible();

    await page.getByLabel('Título *').fill('Tarefa criada no E2E');
    await page.getByLabel('Descrição *').fill('Descrição do teste automatizado');
    await page.getByRole('button', { name: /criar tarefa/i }).click();

    await expect(taskTitle(page, 'Tarefa criada no E2E')).toBeVisible();
  });

  test('marca tarefa como concluída', async ({ authenticatedPage: page }) => {
    const card = taskCard(page, 'Tarefa de teste E2E');
    await card.getByRole('button', { name: 'Marcar como concluída' }).click();

    await expect(card.getByRole('button', { name: 'Marcar como pendente' })).toBeVisible();
  });

  test('edita tarefa existente', async ({ authenticatedPage: page }) => {
    const card = taskCard(page, 'Reunião de equipe');
    await card.getByRole('button', { name: 'Menu de opções' }).click();
    await page.getByRole('menuitem', { name: 'Editar' }).click();

    await expect(page.getByRole('heading', { name: 'Editar Tarefa' })).toBeVisible();
    await page.getByLabel('Título *').fill('Reunião atualizada E2E');
    await page.getByRole('button', { name: /salvar alterações/i }).click();

    await expect(taskTitle(page, 'Reunião atualizada E2E')).toBeVisible();
  });

  test('exclui tarefa com confirmação', async ({ authenticatedPage: page }) => {
    const card = taskCard(page, 'Tarefa concluída');
    await card.getByRole('button', { name: 'Menu de opções' }).click();
    await page.getByRole('menuitem', { name: 'Excluir' }).click();
    await page.getByRole('button', { name: 'Excluir', exact: true }).click();

    await expect(taskTitle(page, 'Tarefa concluída')).not.toBeVisible();
  });
});
