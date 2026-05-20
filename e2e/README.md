# Testes E2E (Playwright + MSW)

Testes de ponta a ponta do frontend com API mockada via MSW. Decisão arquitetural: [docs/adr/0001-e2e-testing-strategy.md](../docs/adr/0001-e2e-testing-strategy.md).

## Pré-requisitos

```bash
cd todo-frontend
bun install
bunx playwright install chromium
```

## Executar localmente

```bash
# Headless (CI)
bun run test:e2e

# Interface visual
bun run test:e2e:ui

# Com navegador visível
bun run test:e2e:headed
```

O Playwright sobe o app em `http://localhost:3100` (`--env-mode e2e`) e intercepta `**/api/v1/**` via [e2e/fixtures/apiMock.ts](fixtures/apiMock.ts), usando a lógica em [src/test/msw/apiRouter.ts](../src/test/msw/apiRouter.ts).

## Estrutura

| Pasta | Conteúdo |
|-------|----------|
| `e2e/specs/` | Cenários Playwright (P0/P1) |
| `e2e/fixtures/` | Sessão autenticada (`storageState` via localStorage) |
| `e2e/fixtures/apiMock.ts` | Registro de `page.route` para a API |
| `src/test/msw/apiRouter.ts` | Respostas mock por método/path |
| `src/test/msw/store.ts` | Estado em memória resetado por spec |
| `e2e/helpers/tasks.ts` | Locators para cards/títulos de tarefa |

## Adicionar cenário para nova feature

1. Criar ou estender handler em `src/test/msw/handlers/`.
2. Adicionar spec em `e2e/specs/` usando `getByRole` / `getByLabel` (evitar `data-testid` salvo exceção).
3. Se o fluxo for P0/P1, incluir no smoke do PR (`bun run test:e2e`).

## Prioridades cobertas

- **P0:** auth, guard, CRUD básico de tarefas (`auth.spec.ts`, `tasks-crud.spec.ts`)
- **P1:** navegação, busca, detalhe (`navigation.spec.ts`, `search.spec.ts`, `task-detail.spec.ts`)

## Limitações

Não substitui testes contra API/DB reais. Para smoke full-stack, ver ADR futuro `0002`.
