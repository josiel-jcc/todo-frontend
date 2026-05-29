# ADR 0004: Finanças como bounded context no hub familiar

**Status:** Proposto  
**Data:** 2026-05-29  
**Decisores:** Josiel / equipe  
**Afeta:** `todo-frontend`, `todo-go-backend`

> **API canônica:** contratos HTTP, papéis e persistência são definidos no backend em [`todo-go-backend/docs/adr/0001-finance-bounded-context.md`](../../../todo-go-backend/docs/adr/0001-finance-bounded-context.md). Este documento espelha a decisão para o frontend e registra implicações de UI/estrutura de código.

## Contexto

O produto evolui de um app de tarefas colaborativo para um **hub pessoal/familiar** (Life Hub): tarefas, grupos, notificações e, em seguida, finanças no mesmo ecossistema de conta e lar.

Finanças têm regras de domínio distintas das tarefas (saldos, categorias, visibilidade por membro, papéis específicos, exportação de dados sensíveis). **Não** devem ser modeladas como tipo de tarefa nem compartilhar stores/rotas de tarefas.

O conceito de **grupo** já existente representa o **lar familiar (household)**. O módulo de finanças reutiliza `group_id` em vez de um segundo agregado familiar.

## Decisão

1. **Bounded context**
   - Implementação em **`modules/finance`** (rotas, páginas, hooks, tipos), separada de `modules/tasks` (ou equivalente atual).
   - Chamadas HTTP apenas sob **`/api/v1/finance/*`** (ver OpenAPI no backend quando disponível).

2. **Household = `group_id`**
   - Seletor de lar ativo na UI usa o mesmo grupo da colaboração em tarefas.
   - Estado de sessão/contexto financeiro carrega `group_id` antes de listar lançamentos compartilhados.

3. **Papéis financeiros** (refletidos na UI)
   - `admin` — telas de configuração e gestão do household financeiro.
   - `editor` — formulários de lançamento household.
   - `viewer` — listagens e relatórios somente leitura.

   Botões e rotas respeitam permissões retornadas pela API (fonte da verdade no backend).

4. **Visibilidade dos lançamentos**
   - **Private** — indicador na UI; não aparece em totais/agregados do lar.
   - **Household** — visível conforme papel do membro no grupo.

5. **Integração ao hub**
   - Navegação global (shell) expõe Finanças como área do hub, sem misturar formulários ou listagens com tarefas.

## Consequências

### Positivas

- Evolução do módulo financeiro sem inflar o bundle/estado de tarefas.
- UX consistente com “um lar, um login” — alinhado ao plano de **hub único**.

### Negativas / custo

- Novo módulo, testes E2E e i18n dedicados.
- Export LGPD na UI de privacidade dependerá de endpoint backend estendido (fase posterior).

### Implementação

- Tipos e clientes API gerados ou mantidos em sync com `todo-go-backend/docs/openapi.json`.
- ADR backend (canônica): [`0001-finance-bounded-context.md`](../../../todo-go-backend/docs/adr/0001-finance-bounded-context.md).

## Referências

- Plano de produto: **hub único** — [docs/PRODUCT_ROADMAP.md](../PRODUCT_ROADMAP.md).
- Grupos / household: [0002-groups-and-invitations.md](0002-groups-and-invitations.md).
- Backend ADR: `todo-go-backend/docs/adr/0001-finance-bounded-context.md`.
