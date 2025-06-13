# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Dev server**: `pnpm dev` - Start Vite development server
- **Build**: `pnpm build` - Build for production using Vite
- **Lint**: `pnpm lint` - Run ESLint with TypeScript support
- **Format**: `pnpm format` - Format code with Prettier
- **Preview**: `pnpm preview` - Preview production build locally

## Architecture Overview

This is a React prototyping boilerplate built with:
- **Vite** for build tooling and development server
- **React Router** for client-side routing in `src/App.tsx`
- **shadcn/ui** components library with custom configuration
- **Tailwind CSS** for styling with CSS modules support
- **TypeScript** with strict configuration

### Key Structure

- `src/components/ui/` - shadcn/ui components (auto-generated, don't edit directly)
- `src/components/` - Custom React components
- `src/pages/` - Page components for routing
- `src/hooks/` - Custom React hooks including `usePosition` for element positioning
- `src/lib/utils.ts` - Utility functions
- Path alias `@/` points to `./src/`

### Component Development

- Use shadcn components: `npx shadcn-ui@latest add <component-name>`
- Components follow the pattern: simple default usage, compose icons via props
- CSS Modules supported: create `<Name>.module.css` files
- Icons from `react-icons` library preferred
- Component specs: heights 16px, 20px, 40px standard

### Libraries Available

- **Animation**: Framer Motion (`motion` components)
- **Icons**: react-icons (multiple icon sets), Lucide React
- **Styling**: clsx for conditional classes, Tailwind merge
- **Hooks**: usehooks-ts, @uidotdev/usehooks, react-hotkeys-hook
- **Data**: @faker-js/faker for mock data generation
- **UI**: Full Radix UI primitives via shadcn/ui

### Routing

React Router setup in `src/App.tsx`. Add new routes by importing page components and adding Route elements.