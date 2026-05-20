# ADR 0001: Estratégia de testes E2E no frontend

**Status:** Aceito (implementação em andamento)  
**Data:** 2026-05-20  
**Decisores:** Equipe frontend / Josiel

## Contexto

O app de tarefas ([todo-frontend](../../)) cresce em funcionalidades (auth, CRUD de tarefas, busca, delegação, detalhe, configurações). Hoje há **17 testes Vitest** (jsdom) cobrindo componentes e hooks, mas **nenhum teste de ponta a ponta** no navegador.

Ao adicionar features, regressões em fluxos integrados (roteamento + estado + API + UI) passam despercebidas. Precisamos de uma rede de segurança E2E antes de expandir o produto.

**Escopo acordado:** E2E **somente no frontend**, com **API mockada** (sem Docker/API/MySQL no CI).

## Fluxos críticos mapeados

| Prioridade | Fluxo | Rotas / pontos de entrada |
|------------|-------|---------------------------|
| P0 | Cadastro, login, logout, guarda de rota | `/login`, `ProtectedRoute` |
| P0 | Listar, criar, concluir tarefa | `/tasks`, `TaskFormOverlay` |
| P1 | Editar, excluir, navegação, busca, detalhe | `/tasks`, `/search`, `/tasks/:id`, `BottomNavigation` |
| P2 | Hoje, delegadas, comentários, share, settings | `/tasks/today`, `/tasks/assigned`, `/settings` |

## Opções consideradas

### 1. Runner E2E

| Opção | Prós | Contras |
|-------|------|---------|
| **Playwright** | Navegador real, trace/screenshot, `storageState`, CI maduro, TypeScript nativo | Dependência nova, browsers no CI |
| Cypress | DX familiar, time-travel | Menos flexível em múltiplos browsers; modelo diferente do Vitest |
| Vitest Browser Mode | Mesma stack de unit | E2E full-app ainda imaturo; mistura responsabilidades |

### 2. Mock de API

| Opção | Prós | Contras |
|-------|------|---------|
| **MSW v2** | Handlers reutilizáveis, alinhado a contratos OpenAPI, mesmo padrão da comunidade React | Setup inicial (service worker) |
| `page.route()` (Playwright) | Sem lib extra | Handlers duplicados por spec, difícil compartilhar estado |
| Backend real (Docker) | Máxima fidelidade | Lento, frágil no CI; fora do escopo escolhido |

### 3. Onde executar o app nos testes

| Opção | Prós | Contras |
|-------|------|---------|
| **`rsbuild dev` via `webServer`** | Hot reload local, mesma config de dev | Porta dedicada (3100) |
| `rsbuild preview` (build) | Mais próximo de produção | Build mais lento no CI |

## Decisão

Adotar **Playwright** (`@playwright/test`) + **contratos de mock centralizados** em `src/test/msw/` (estilo MSW), aplicados via **`page.route()`** do Playwright em E2E.

> **Nota de implementação:** o service worker do MSW no browser não foi confiável com Rsbuild dev + PWA; a lógica dos handlers vive em `apiRouter.ts` e é injetada por `e2e/fixtures/apiMock.ts`. Os arquivos em `handlers/` e `browser.ts` permanecem como referência/opção para testes manuais futuros.

### Detalhes

- **Pasta de specs:** `e2e/specs/`
- **Config:** `e2e/playwright.config.ts` + `.env.e2e` (`VITE_API_URL=http://localhost:3100/api/v1`)
- **Mock de API:** `installApiMocks(page)` em `e2e/fixtures/test.ts` (todas as specs)
- **Seletores:** `getByRole` / `getByLabel`; helpers em `e2e/helpers/tasks.ts` para títulos duplicados
- **Auth nos testes:** `localStorage` seed + specs de login/cadastro reais
- **CI:** job E2E em `.github/workflows/quality.yml` após unit tests
- **`pre-pr`:** incluir `test:e2e` (~35s local)

### Scripts

```json
"dev:e2e": "rsbuild dev --port 3100",
"test:e2e": "playwright test -c e2e/playwright.config.ts",
"test:e2e:ui": "playwright test -c e2e/playwright.config.ts --ui",
"test:e2e:headed": "playwright test -c e2e/playwright.config.ts --headed"
```

## Consequências

### Positivas

- Regressões em fluxos P0/P1 detectadas antes do merge
- Handlers MSW documentam o contrato esperado da API no frontend
- Playwright traces aceleram debug de falhas intermitentes

### Negativas / limitações

- **Não valida** backend real, CORS, migrações ou divergência OpenAPI
- Compartilhamento/delegação multi-usuário depende de mocks realistas
- Service worker MSW exige `public/mockServiceWorker.js` versionado

### Mitigação futura

ADR opcional `0002` para 2–3 smokes **full-stack** (Playwright + docker-compose do backend), fora deste escopo.

## Checklist para novas features

- [ ] Alterou rota em `appRoutes.tsx`? → spec de navegação ou smoke
- [ ] Novo endpoint em `src/api/`? → handler MSW + cenário E2E mínimo
- [ ] Alterou fluxo P0/P1? → atualizar spec existente

## Referências

- [Playwright](https://playwright.dev/)
- [MSW – Playwright recipe](https://mswjs.io/docs/recipes/playwright/)
- Plano interno: fluxos críticos + fases P0–P5
