# ADR 0002: Grupos, convites e colaboração restrita

## Status

Aceito — implementado.

## Contexto

Usuários podiam compartilhar e atribuir tarefas a qualquer conta do sistema. Era necessário limitar colaboração a grupos definidos, com entrada por convite aceito, sem perder dados existentes.

## Decisão

1. **Grupos** com membros many-to-many; usuário em vários grupos.
2. **Convites** com estados `pending`, `accepted`, `declined`, `cancelled`; membro só após aceitar.
3. **Notificações in-app** (`/notifications/in-app`) para `group_invite`.
4. **Enforcement** em `ShareTask` e criação de tarefa com `user_id` de outro.
5. **Migração** idempotente: grupo padrão **"Os de casa"** com todos os usuários ativos; novos registros entram automaticamente.
6. **GET /users** filtrado por colegas de grupo; `?scope=invite` para picker de convites.

## Consequências

- Compartilhamentos antigos permanecem válidos (grandfathering).
- Grupo padrão não pode ser excluído (`is_default`).
- E2E: cenários de grupo priorizados (ver ADR 0001).
