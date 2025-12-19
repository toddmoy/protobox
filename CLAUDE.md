# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Reference

- **Dev server**: `pnpm dev`
- **Build**: `pnpm build`
- **Lint**: `pnpm lint`
- **Format**: `pnpm format`

## Project Overview

Protobox is a React/Vite prototyping boilerplate with:
- **shadcn/ui** - 34 pre-installed components
- **Tailwind CSS** - Class-based dark mode support
- **TypeScript** - Strict configuration
- **React Router v6** - Client-side routing

## Key Directories

- `src/components/ui/` - shadcn components (auto-generated, don't edit)
- `src/components/` - Custom components
- `src/hooks/` - Custom React hooks (usePosition, useTypewriter)
- `src/pages/` - Page components for routing
- `src/lib/utils.ts` - `cn()` utility for className merging
- `src/data/` - Static data for prototyping
- `src/api/` - Mock API routes

## Path Alias

Use `@/` for imports from `./src/`:
```tsx
import { Button } from "@/components/ui/button"
```

## Adding shadcn Components

```bash
npx shadcn-ui@latest add <component-name>
```

## Best Practices

1. Prefer editing existing files over creating new ones
2. Use shadcn components as building blocks
3. Support dark mode with `dark:` variants
4. Use the `cn()` utility for class merging

See `.claude/CLAUDE.md` for detailed architecture documentation.
