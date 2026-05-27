# 📝 Todo App Frontend

Aplicação frontend moderna para gerenciamento de tarefas construída com React 19, TypeScript e tecnologias de ponta. Interface responsiva com suporte a dark mode, animações suaves e experiência de usuário otimizada.

## Conformidade (LGPD)

Documentação legal e de segurança (fonte canônica): [`docs/compliance/`](docs/compliance/). No app: `/privacidade` e `/termos`. Exportação JSON e exclusão de conta em **Configurações → Privacidade e dados**.

## ✨ Features

- 🔐 **Autenticação completa** - Login e registro de usuários
- 📋 **Gerenciamento de tarefas** - Criar, editar, excluir e completar tarefas
- 🏷️ **Sistema de tags** - Organize tarefas com tags coloridas
- 👥 **Atribuição de usuários** - Atribua tarefas a outros usuários do mesmo grupo
- 🏠 **Grupos e convites** - Crie grupos, convide membros (aceite obrigatório) e colabore com segurança
- 🔔 **Notificações in-app** - Sino no header para convites de grupo e lembretes de tarefa
- 📲 **Web Push (PWA)** - Lembretes no navegador com consentimento explícito
- ⏱️ **Lembretes por horário** - Antecedência configurável (padrão 10 min antes do vencimento)
- 💬 **Comentários** - Adicione comentários às tarefas
- 🔍 **Busca avançada** - Filtros por tipo, prioridade, data, status e mais
- 📊 **Dashboard** - Visualize estatísticas e tarefas em progresso
- 🌓 **Dark Mode** - Suporte completo a tema claro e escuro
- 📱 **Design Responsivo** - Otimizado para mobile, tablet e desktop
- ✨ **Animações** - Transições suaves com Framer Motion
- 🎉 **Feedback visual** - Confetti ao completar tarefas
- ⚠️ **Confirmações** - Diálogos de confirmação para ações destrutivas

## 🚀 Tecnologias

### Core
- **React 19** - Biblioteca UI moderna
- **TypeScript** - Tipagem estática para maior segurança
- **Rsbuild** - Build tool rápida e moderna
- **React Router v7** - Roteamento declarativo
- **React Query (TanStack Query)** - Gerenciamento de estado do servidor

### UI/UX
- **Tailwind CSS 4** - Framework CSS utility-first
- **Framer Motion** - Biblioteca de animações
- **Radix UI** - Componentes acessíveis (Dropdown, Tabs, etc.)
- **Lucide React** - Ícones modernos
- **Sonner** - Notificações toast elegantes

### Formulários e Validação
- **React Hook Form** - Gerenciamento de formulários performático
- **Zod** - Validação de schemas TypeScript-first

### Outros
- **Axios** - Cliente HTTP com interceptadores
- **Canvas Confetti** - Animações de confetti
- **OpenAPI TypeScript** - Geração automática de tipos da API

## 📋 Pré-requisitos

- **Node.js** 18+ ou **Bun** (recomendado)
- **npm**, **yarn**, **pnpm** ou **bun**

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone <repository-url>
cd todo-frontend
```

### 2. Instale as dependências

```bash
# Usando bun (recomendado)
bun install

# Ou usando npm
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=https://api-todo.infoos.shop
```

## 🐳 Docker Compose + Cloudflare Tunnel

### Subir localmente (com acesso em `http://localhost:8080`)

1. Copie o arquivo de exemplo:

```bash
cp .env.docker.example .env.docker
```

2. Ajuste `VITE_API_URL` e, se for usar Cloudflare Tunnel, preencha `CLOUDFLARE_TUNNEL_TOKEN`.

3. Suba os containers:

```bash
docker compose --env-file ./.env.docker up -d --build
```

### Subir com Cloudflare (cloudflared)

O serviço `cloudflared` roda sob o profile `cloudflare`. Para subir junto:

```bash
docker compose --env-file ./.env.docker --profile cloudflare up -d --build
```

> No Cloudflare Zero Trust, crie/gerencie o Tunnel e configure o Public Hostname para apontar para o serviço HTTP interno (ex.: `http://frontend:80`).

## 🤖 CI/CD (GitHub Actions)

- **Quality** (`.github/workflows/quality.yml`): roda `bun run test:ci` e `bun run check:ci` em PRs e push na `master`.
- **Deploy (Raspberry Pi)** (`.github/workflows/deploy-raspberrypi.yml`): requer **runner self-hosted** no Raspberry Pi com Docker + Docker Compose v2.

### Secrets necessários (repo → Settings → Secrets and variables → Actions)

- `CLOUDFLARE_TUNNEL_TOKEN` (obrigatório para o profile `cloudflare`)
- `VITE_API_URL` (opcional; se vazio usa o default `https://api-todo.infoos.shop`)

## 🛠️ Scripts Disponíveis

### Desenvolvimento

```bash
# Inicia o servidor de desenvolvimento
bun run dev
# O app estará disponível em http://localhost:3000
```

### Build

```bash
# Build para produção
bun run build

# Preview do build de produção localmente
bun run preview
```

### Qualidade de Código

```bash
# Lint e correção automática
bun run check

# CI (não modifica arquivos)
bun run check:ci

# Formatação do código
bun run format

# CI (não modifica arquivos)
bun run format:ci

# Verifica tamanho dos arquivos (máximo 175 linhas)
bun run check:file-size
```

### Testes

```bash
# Roda a suíte de testes
bun run test

# CI (run-only)
bun run test:ci

# Modo watch
bun run test:watch

# UI do Vitest
bun run test:ui

# Coverage
bun run test:coverage
```

### Tipos da API

```bash
# Gera tipos TypeScript a partir da especificação OpenAPI
bun run generate:types
```

Este comando baixa a especificação OpenAPI do backend e gera tipos TypeScript em `src/api/types.ts`.

Se a URL estiver indisponível ou a spec publicada estiver defasada, use o OpenAPI gerado no repositório do backend (`swag-openapi3` em `todo-go-backend`) e rode `bun run generate:types:local` (espera `../todo-go-backend/docs/openapi.json`).

**⚠️ Atenção:** Não edite manualmente o arquivo `src/api/types.ts`. Ele é gerado automaticamente.

### Storybook

```bash
# Inicia o Storybook
bun run storybook
# Disponível em http://localhost:6006

# Build do Storybook
bun run build-storybook
```

## 📁 Estrutura do Projeto

```
src/
├── api/                    # Cliente API e tipos gerados
│   ├── apiClient.ts        # Cliente Axios configurado
│   ├── types.ts            # Tipos gerados automaticamente (NÃO EDITAR)
│   ├── auth.ts             # Endpoints de autenticação
│   ├── tasks.ts            # Endpoints de tarefas
│   ├── comments.ts         # Endpoints de comentários
│   ├── tags.ts             # Endpoints de tags
│   └── users.ts            # Endpoints de usuários
│
├── components/             # Componentes globais reutilizáveis
│   ├── ui/                 # Componentes base (Radix UI)
│   ├── BottomNavigation.tsx
│   ├── BottomSheet.tsx
│   ├── ConfirmDialog.tsx   # Diálogo de confirmação (adaptativo mobile/desktop)
│   ├── Loading.tsx
│   └── ...
│
├── contexts/               # Contextos React
│   └── TaskFormContext.tsx # Contexto global do formulário de tarefas
│
├── hooks/                  # Hooks customizados globais
│   └── useTheme.ts         # Hook para gerenciar tema
│
├── layouts/                # Layouts de página
│   └── AppLayout.tsx       # Layout principal com navegação
│
├── lib/                    # Bibliotecas e utilitários
│   ├── animations.ts       # Variantes de animação
│   ├── confetti.ts        # Funções de confetti
│   └── utils.ts           # Funções utilitárias (cn, etc.)
│
├── modules/                # Módulos de funcionalidades
│   ├── auth/              # Módulo de Autenticação
│   │   ├── components/    # Componentes do módulo
│   │   ├── hooks/         # Hooks do módulo
│   │   ├── pages/         # Páginas do módulo
│   │   └── schemas/       # Schemas de validação
│   │
│   ├── tasks/             # Módulo de Tarefas
│   │   ├── components/    # Componentes de tarefas
│   │   │   ├── TaskCard/  # Card de tarefa (refatorado)
│   │   │   ├── TaskForm/  # Formulário de tarefa (refatorado)
│   │   │   └── ...
│   │   ├── hooks/         # Hooks de tarefas
│   │   ├── pages/         # Páginas de tarefas
│   │   │   ├── TasksPage/ # Página principal (refatorada)
│   │   │   ├── TaskDetailPage/ # Página de detalhes (refatorada)
│   │   │   └── search/     # Página de busca (refatorada)
│   │   └── schemas/       # Schemas de validação
│   │
│   └── settings/          # Módulo de Configurações
│
├── routes/                 # Definição de rotas
│   └── appRoutes.tsx      # Rotas da aplicação
│
├── utils/                  # Funções utilitárias
│   └── validators.ts       # Validadores reutilizáveis
│
└── App.tsx                 # Componente raiz
```

## 🏗️ Arquitetura

### Princípios de Design

1. **Arquitetura Modular** - Cada funcionalidade é um módulo independente
2. **Componentes Reutilizáveis** - Componentes globais em `src/components/`
3. **Separação de Responsabilidades** - Componentes pequenos e focados (máximo 175 linhas)
4. **Type Safety** - Tipos gerados automaticamente da API
5. **React Query** - Gerenciamento de estado do servidor
6. **Hooks Customizados** - Lógica reutilizável encapsulada

### Padrões de Código

- **Componentes Funcionais** - Uso exclusivo de componentes funcionais com hooks
- **Named Exports** - Preferência por exports nomeados
- **TypeScript Strict** - Modo estrito habilitado
- **Biome** - Linting e formatação automática
- **Conventional Commits** - Padrão de commits semânticos

## 🔌 API Types

Os tipos da API são gerados automaticamente a partir da especificação OpenAPI do backend.

### Usando os Tipos

```typescript
import type { paths, components } from "@/api";

// Tipo de resposta de autenticação
type AuthResponse = components["schemas"]["handlers.AuthResponse"];

// Tipo de requisição de login
type LoginRequest = components["schemas"]["handlers.LoginRequest"];

// Tipo de tarefa
type Task = components["schemas"]["models.Task"];

// Tipo de comentário
type Comment = components["schemas"]["models.Comment"];
```

### Regenerar Tipos

Se a API for atualizada, regenere os tipos:

```bash
bun run generate:types
```

## 🎨 Design System

### Tema

- **Dark Mode** - Suporte completo com toggle
- **Cores** - Sistema de cores baseado em variáveis CSS
- **Tipografia** - Sistema tipográfico consistente
- **Espaçamento** - Grid system baseado em Tailwind

### Componentes UI

- **Cards** - Componentes de card com bordas arredondadas
- **Buttons** - Variantes: default, destructive, outline, ghost
- **Inputs** - Campos de entrada estilizados
- **Dialogs** - Diálogos modais e bottom sheets responsivos
- **Dropdowns** - Menus dropdown acessíveis

### Animações

- **Framer Motion** - Animações de entrada/saída
- **Transições** - Transições suaves entre páginas
- **Feedback** - Animações de confirmação e loading

## 📱 Responsividade

A aplicação é totalmente responsiva:

- **Mobile** (< 768px) - Layout otimizado, bottom sheets, navegação inferior
- **Tablet** (768px - 1024px) - Layout adaptativo
- **Desktop** (> 1024px) - Layout completo com sidebar

### Componentes Adaptativos

- **ConfirmDialog** - Bottom sheet no mobile, modal no desktop
- **TaskForm** - Bottom sheet no mobile, formulário inline no desktop
- **Navigation** - Bottom navigation no mobile, sidebar no desktop

## 🔒 Segurança

- **Rotas Protegidas** - Sistema de autenticação com `ProtectedRoute`
- **Token Management** - Gerenciamento seguro de tokens JWT
- **Interceptadores Axios** - Adição automática de tokens e tratamento de erros
- **Validação de Formulários** - Validação client-side com Zod

## 🧪 Qualidade de Código

### Linting e Formatação

- **Biome** - Linter e formatter rápido
- **TypeScript** - Verificação de tipos em tempo de compilação
- **File Size Check** - Script customizado para verificar tamanho de arquivos

### Regras de Código

- Máximo de **175 linhas** por arquivo de componente
- Máximo de **50 linhas** por função (warning do Biome)
- Componentes devem ser pequenos e focados
- Hooks customizados para lógica complexa

## 📚 Recursos e Documentação

### Documentação Oficial

- [Rsbuild Documentation](https://rsbuild.rs) - Build tool
- [React Query](https://tanstack.com/query/latest) - Server state management
- [React Router](https://reactrouter.com) - Routing
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Radix UI](https://www.radix-ui.com) - UI Components

### Ferramentas

- **Biome** - Linting e formatação
- **OpenAPI TypeScript** - Geração de tipos
- **Storybook** - Documentação de componentes

## 📝 Convenções de Commit

Este projeto usa [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação (não afeta código)
- `refactor:` - Refatoração de código
- `perf:` - Melhoria de performance
- `test:` - Adição ou correção de testes
- `chore:` - Tarefas de manutenção
- `build:` - Mudanças no sistema de build
- `ci:` - Mudanças na CI/CD

### Exemplos

```bash
feat: adiciona confirmação de exclusão com nome da tarefa
fix: corrige altura inconsistente do InProgressCard
refactor: divide TaskForm em componentes menores
docs: atualiza README com informações de responsividade
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feat/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Execute os checks (`bun run check && bun run check:file-size`)
5. Push para a branch (`git push origin feat/nova-feature`)
6. Abra um Pull Request

### Checklist antes de fazer PR

- [ ] Código segue os padrões do projeto
- [ ] Todos os checks passam (`bun run check`)
- [ ] Arquivos não excedem 175 linhas
- [ ] Tipos TypeScript estão corretos
- [ ] Componentes são responsivos
- [ ] Dark mode funciona corretamente
- [ ] Não há warnings do linter

## 📄 Licença

Este projeto é privado e proprietário.

## 👥 Autores

Desenvolvido com ❤️ pela equipe do Todo App.

---

**Nota:** Este projeto está em constante evolução. Para sugestões ou problemas, abra uma issue no repositório.
