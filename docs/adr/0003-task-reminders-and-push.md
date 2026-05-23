# ADR 0003: Lembretes de tarefa, Web Push (PWA) e canais unificados

**Status:** Aceito  
**Data:** 2026-05-22  
**Decisores:** Josiel / equipe  
**Afeta:** `todo-go-backend`, `todo-frontend`

## Contexto

O app já possui:

- PWA com service worker (`rsbuild-plugin-pwa` + Workbox)
- Notificações de tarefa por **email** e **Telegram**, disparadas por cron com granularidade de **dia** (`due_soon`, `due_today`, `overdue`)
- Notificações **in-app** (`UserNotification`) para convites de grupo
- Opt-in global via `notifications_enabled`

O produto precisa avisar o usuário **pouco antes do horário de vencimento** da tarefa (padrão **10 minutos**), com antecedência configurável globalmente e opcionalmente por tarefa, incluindo notificação nativa no celular via PWA.

## Decisões do brainstorm (2026-05-22)

| # | Tópico | Decisão |
|---|--------|---------|
| 1 | Canais na v1 | **Push PWA** + **email** + **Telegram** em paralelo |
| 2 | Antecedência | Preferência **global** (`reminder_minutes_before`, default 10) + **override opcional por tarefa** |
| 3 | Avisos legados | **Substituir** `due_soon` / `due_today` / `overdue` por um único tipo `task_reminder` relativo ao `due_date` |
| 4 | In-app | Criar também `UserNotification` tipo `task_reminder` no sino |
| 5 | Orquestração | **Servidor** (cron ~1 min) calcula `due_date − offset` e dispara todos os canais |

## Opções consideradas

### Orquestração do lembrete

| Opção | Prós | Contras |
|-------|------|---------|
| **Servidor (cron)** | Funciona com app fechado; um motor para push, email, Telegram e in-app | VAPID, tabela de push subscriptions, cron mais frequente |
| Cliente (Service Worker agenda local) | Menos backend | Não confiável com app fechado; não cobre email/Telegram/in-app |
| Híbrido | Separação clara UI vs envio | Equivalente ao servidor na prática |

**Escolhida:** servidor orquestra tudo.

### Web Push no PWA

| Opção | Prós | Contras |
|-------|------|---------|
| **Web Push API + VAPID** | Notificação do sistema (Android, desktop, iOS 16.4+ PWA na Tela de Início) | Permissão do usuário; chaves e subscriptions no backend |
| Só notificações in-app | Sem permissão de browser | Não alerta com app fechado |

**Escolhida:** Web Push com subscriptions persistidas no backend.

## Decisão

1. **Modelo**
   - `users.reminder_minutes_before` (int, default 10, not null)
   - `tasks.reminder_minutes_before` (*int, null = herda do usuário)
   - Tabela `push_subscriptions` (endpoint, keys, user_id, user_agent)
   - Tipo único de notificação enviada: `task_reminder` (canais: `email`, `telegram`, `push`; histórico em `notifications`)
   - In-app: `UserNotificationTypeTaskReminder`

2. **Scheduler**
   - Intervalo padrão: **a cada 1 minuto** (`NOTIFICATION_CHECK_INTERVAL`, ex. `* * * * *`)
   - Janela: `now ∈ [reminder_at, reminder_at + 1min)` onde `reminder_at = due_date − effective_offset`
   - `effective_offset = task.reminder_minutes_before ?? user.reminder_minutes_before`
   - Enviar apenas se `notifications_enabled`, tarefa não concluída, `due_date` presente
   - **Não** enviar lembrete retroativo se a tarefa já passou do horário ao criar/editar
   - Se `due_date` mudar: invalidar envios anteriores da tarefa (permitir novo lembrete para o novo horário)
   - **Pré-filtro no banco** (não full scan): buscar só tarefas com `due_date` na faixa candidata (~`now+4min` … `now+61min`, cobrindo offsets 5–60) + `JOIN users` com `notifications_enabled = true`
   - **Índice** em `tasks(completed, due_date)` para a query de candidatos
   - **Log por tick** resumido (`candidates=N, sent=M`); sem log linha-a-linha por tarefa em produção

3. **API**
   - `PUT /users/reminder-settings` — `{ reminder_minutes_before }`
   - `POST /notifications/push/subscribe`, `DELETE /notifications/push/subscribe`
   - Task create/update aceita `reminder_minutes_before` opcional
   - VAPID public key exposta (ex. `GET /notifications/push/vapid-public-key`)

4. **Frontend**
   - Configurações: select de minutos (5, 10, 15, 30, 60) + fluxo “Ativar push neste dispositivo”
   - Formulário de tarefa: lembrete personalizado (opcional)
   - Service worker: handler `push` → `showNotification` com deep link `/tasks/:id`
   - Sino: renderizar `task_reminder`

5. **Substituição dos tipos antigos**
   - Remover lógica baseada em “vence amanhã / hoje / atrasada” em `internal/notifications/service.go`
   - Atualizar `NOTIFICATIONS_SETUP.md` e mensagens de email/Telegram para texto de lembrete único

6. **Fora do escopo v1**
   - Snooze, segundo lembrete, rich actions na push
   - Lembretes para tarefas de grupo atribuídas a outro usuário (tipo separado)

## Consequências

### Positivas

- Experiência alinhada ao horário real da tarefa (com hora no `due_date`)
- Push nativo no celular sem app store
- Um único conceito de “lembrete” para todos os canais

### Negativas / riscos

- Cron a cada minuto aumenta frequência do job (mitigado por query filtrada; ver escalabilidade)
- iOS exige PWA instalada e iOS ≥ 16.4 para Web Push
- Migração: registros antigos em `notifications` permanecem como histórico; tipos legados não são mais gerados
- **Múltiplas réplicas da API** sem lock: cada instância rodaria o cron → duplicar envios. v1 assume **uma instância** ou `RUN_SCHEDULER=true` só em um pod (documentado)

### Escalabilidade (meta: ≤ 5 000 tarefas ativas)

| Aspecto | Decisão v1 |
|---------|------------|
| Volume esperado | Até **5 000** tarefas `completed=false` com `due_date` |
| Candidatos por tick | Query por janela de `due_date` → tipicamente **dezenas**, não 5 000 |
| Custo estimado | ~1 query indexada/min + loop pequeno + envios só na janela de 1 min |
| Full scan | **Proibido** na implementação — substituir `Find` sem filtro atual |
| Horizontal scale | Fora do escopo v1; futuro: worker dedicado ou fila de envio |

Com 5 000 tarefas ativas espalhadas no tempo, o cron de 1 minuto na arquitetura atual (processo único + MySQL) é **adequado** desde que a query use índice e janela.

### Operacional

- Novas env vars: `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` (mailto ou URL)
- Documentar em privacidade o armazenamento de endpoints de push

## Referências

- Spec: [`docs/superpowers/specs/2026-05-22-task-notifications-design.md`](../../../docs/superpowers/specs/2026-05-22-task-notifications-design.md)
- Plano: [`docs/superpowers/plans/2026-05-22-task-notifications.md`](../../../docs/superpowers/plans/2026-05-22-task-notifications.md)
- ADR 0002 (in-app): [`0002-groups-and-invitations.md`](0002-groups-and-invitations.md)
- Setup legado: `todo-go-backend/NOTIFICATIONS_SETUP.md` (a atualizar na implementação)
