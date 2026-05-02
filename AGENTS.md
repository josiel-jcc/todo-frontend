# AGENTS.md

You are an expert in JavaScript, TypeScript, React, Rsbuild, and web application development. You write maintainable, performant, and accessible code.

## Project Overview

This is a Todo App frontend built with:
- React 19 with TypeScript
- Rsbuild for building
- React Query for server state management
- React Router for routing
- Axios for HTTP requests
- Tailwind CSS for styling
- OpenAPI TypeScript for type generation

## Commands

### Development
- `bun run dev` - Start the dev server (available at http://localhost:3000)
- `bun run build` - Build the app for production
- `bun run preview` - Preview the production build locally

### Code Quality
- `bun run check` - Lint and check code with Biome
- `bun run format` - Format code with Biome

### API Types
- `bun run generate:types` - Generate TypeScript types from the deployed OpenAPI URL
- `bun run generate:types:local` - Generate types from `../todo-go-backend/docs/openapi.json` (run `swag-openapi3` in the backend repo first when handlers change). Use this when the remote spec is unavailable or out of date.

### Storybook
- `bun run storybook` - Start Storybook dev server
- `bun run build-storybook` - Build Storybook for production

## Project Structure

```
src/
├── api/                # API client and generated types
│   ├── types.ts        # Auto-generated types (DO NOT EDIT)
│   └── index.ts        # Type exports
├── components/         # Global reusable components
├── modules/            # Feature modules
│   ├── auth/          # Authentication module
│   └── tasks/         # Tasks module
├── layouts/           # Page layouts
├── routes/            # Route definitions
├── store/             # Global state management
├── utils/             # Utility functions
└── App.tsx            # Root component
```

## API Types

Types are automatically generated from the OpenAPI specification at `https://api-todo.infoos.shop/swagger.json`.

**Important:** Never edit `src/api/types.ts` directly. It's auto-generated. To regenerate types, run:
```bash
bun run generate:types
```

### Using API Types

```typescript
import type { paths, components } from "@/api";

// Example: Auth response type
type AuthResponse = components["schemas"]["handlers.AuthResponse"];

// Example: Task type
type Task = components["schemas"]["models.Task"];
```

## Environment Variables

The project uses environment variables defined in `.env`:
- `VITE_API_URL` - Base URL for the API (default: https://api-todo.infoos.shop)

Types are defined in `src/env.d.ts`.

## Architecture Guidelines

1. **Modular Structure**: Each feature (Auth, Tasks) is a self-contained module
2. **Component Reusability**: Global components in `src/components/`
3. **React Query**: Use React Query hooks for all API calls
4. **Type Safety**: Always use generated types from `src/api/types.ts`
5. **Conventional Commits**: Follow conventional commit format

## Code Style

- Use Biome for linting and formatting
- Follow TypeScript strict mode
- Use functional components with hooks
- Prefer named exports over default exports
- Use Tailwind CSS for styling

## Docs

- Rsbuild: https://rsbuild.rs/llms.txt
- Rspack: https://rspack.rs/llms.txt
- React Query: https://tanstack.com/query/latest
- React Router: https://reactrouter.com

## Tools

### Biome
- Run `bun run check` to lint your code
- Run `bun run format` to format your code

### OpenAPI TypeScript
- Run `bun run generate:types` to regenerate API types