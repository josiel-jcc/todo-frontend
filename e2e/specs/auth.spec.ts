import { expect, seedAuthenticatedSession, test } from '../fixtures/auth';
import { taskTitle } from '../helpers/tasks';

test.describe('Autenticação', () => {
  test('redireciona /tasks para /login quando não autenticado', async ({ page }) => {
    await page.goto('/tasks');
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible();
  });

  test('login com credenciais mockadas redireciona para /tasks', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Nome de usuário ou e-mail').fill('e2euser');
    await page.getByLabel('Senha', { exact: true }).fill('password123');
    await page.getByRole('button', { name: /^entrar$/i }).click();
    await page.waitForURL(/\/tasks$/, { timeout: 15_000 });
    await expect(taskTitle(page, 'Tarefa de teste E2E')).toBeVisible();
  });

  test('cadastro redireciona para /tasks', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('tab', { name: 'Cadastrar' }).click();
    await expect(page.getByRole('heading', { name: 'Criar conta' })).toBeVisible();

    await page.getByLabel('Nome de usuário').fill('novouser');
    await page.getByLabel('E-mail').fill('novo@test.com');
    await page.getByLabel('Senha', { exact: true }).fill('password123');
    await page.getByLabel('Confirmar senha').fill('password123');
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: /criar conta/i }).click();
    await page.waitForURL(/\/tasks$/, { timeout: 15_000 });
  });

  test('logout volta para /login e limpa sessão', async ({ page }) => {
    await seedAuthenticatedSession(page);
    await page.goto('/tasks');
    await expect(taskTitle(page, 'Tarefa de teste E2E')).toBeVisible();

    await page.locator('header').getByRole('button').last().click();
    await page.getByRole('menuitem', { name: 'Sair' }).click();

    await expect(page).toHaveURL(/\/login$/);
    const token = await page.evaluate(() => localStorage.getItem('auth_token'));
    expect(token).toBeNull();
  });
});
