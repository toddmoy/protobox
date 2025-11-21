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
- **React Router v6** for client-side routing in `src/App.tsx`
- **shadcn/ui** components library with custom configuration (34 components pre-installed)
- **Tailwind CSS** for styling with CSS modules support and class-based dark mode
- **TypeScript** with strict configuration

### Key Structure

- `src/components/ui/` - shadcn/ui components (auto-generated, don't edit directly)
- `src/components/` - Custom React components
  - `Welcome.tsx` - Example landing page with animations, drag-drop, hotkeys
  - `MCP.tsx` - Example card component demonstrating dark mode and composition
  - `README.md` - Component development guidelines (heights, props, composition patterns)
- `src/pages/` - Page components for routing
- `src/hooks/` - Custom React hooks
  - `usePosition.tsx` - Hook for positioning elements relative to another (tooltips, dropdowns)
  - `use-toast.ts` - Toast notification hook (shadcn)
- `src/lib/utils.ts` - Utility functions (cn() for className merging)
- `src/styles/easing.css` - Custom easing curves (--ease-out-expo, etc.)
- `src/index.css` - Global styles, Tailwind directives, CSS variables, `.center-content` utility
- Path alias `@/` points to `./src/`

### Component Development

**Guidelines** (see `src/components/README.md` for details):
- Use shadcn components: `npx shadcn-ui@latest add <component-name>`
- Components follow the pattern: simple default usage, compose icons via props
- Standard heights: 16px, 20px, 40px
- Accept `style`, `className`, and native element props
- Icons composed via `icon`, `leadingIcon`, or `trailingIcon` props
- Use composition over prop explosion

**34 shadcn/ui components available:**
accordion, alert, alert-dialog, aspect-ratio, badge, button, card, checkbox, drawer, dropdown-menu, hover-card, input, label, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, switch, table, tabs, textarea, toast, toaster, toggle, toggle-group, tooltip

**CSS Modules supported:**
Create `<Name>.module.css` files and import them:
```tsx
import styles from './Component.module.css'
<div className={styles.myClass}>...</div>
```

### Libraries Available

- **Animation**: Framer Motion (`motion` components)
- **Icons**: react-icons (multiple icon sets), Lucide React
- **Styling**: clsx for conditional classes, Tailwind merge via `cn()` utility
- **Hooks**: usehooks-ts, @uidotdev/usehooks, react-hotkeys-hook
- **Data**: @faker-js/faker for mock data generation
- **UI**: Full Radix UI primitives via shadcn/ui
- **Drag & Drop**: @dnd-kit/core for drag and drop interactions
- **Layouts**: react-resizable-panels, vaul for drawers

### Dark Mode

Dark mode is enabled using Tailwind's class-based system:
```tsx
<div className="bg-white dark:bg-zinc-900 text-black dark:text-white">
  Content
</div>
```

CSS variables are configured for light/dark themes in `src/index.css`. Toggle by adding/removing the `dark` class on the root element.

### Routing

React Router v6 setup in `src/App.tsx`. Add new routes by:
1. Creating a page component in `src/pages/`
2. Importing it in `App.tsx`
3. Adding a Route element:
```tsx
<Route path="/new-page" element={<NewPage />} />
```

**Note:** React Router v6 uses `element` prop, not the deprecated `component` prop.

### Custom Utilities

**Easing Curves** (`src/styles/easing.css`):
Custom CSS variables for animation timing functions. Available curves include:
- `--ease-out-expo`
- Additional curves defined in the file

Usage:
```css
.animated {
  animation-timing-function: var(--ease-out-expo);
}
```

**Helper Classes** (`src/index.css`):
- `.center-content` - Flexbox centering utility

**cn() Function** (`src/lib/utils.ts`):
Merge and deduplicate classnames with Tailwind conflict resolution:
```tsx
import { cn } from '@/lib/utils'
cn('px-4 py-2', 'px-6') // → 'py-2 px-6'
```

### Custom Hooks

**usePosition** (`src/hooks/usePosition.tsx`):
Position elements relative to a target (tooltips, dropdowns, popovers):
```tsx
import usePosition from '@/hooks/usePosition'

const targetRef = useRef(null)
const { ref, style } = usePosition(targetRef, {
  position: 'bottom', // 'top' | 'bottom' | 'left' | 'right'
  alignment: 'center', // 'start' | 'center' | 'end'
})

<button ref={targetRef}>Target</button>
<div ref={ref} style={style}>Positioned content</div>
```

**useHotkeys** (from react-hotkeys-hook):
```tsx
import { useHotkeys } from 'react-hotkeys-hook'
useHotkeys('ctrl+/', () => console.log('Shortcut pressed'))
```

### Example Components

Use these as reference implementations:

**src/components/Welcome.tsx:**
- Framer Motion animations
- @dnd-kit drag-and-drop
- react-hotkeys-hook keyboard shortcuts
- @faker-js/faker mock data
- shadcn Badge component

**src/components/MCP.tsx:**
- Dark mode styling patterns
- Component composition (Avatar, Badge)
- Lucide icons integration
- Realistic mock data generation
- Responsive card layout

### Common Patterns

**Adding icons:**
```tsx
// react-icons (multiple libraries)
import { FiBox } from "react-icons/fi"
<FiBox size={40} />

// Lucide (preferred for shadcn components)
import { Box } from "lucide-react"
<Box size={40} />
```

**Mock data generation:**
```tsx
import { faker } from '@faker-js/faker'
const name = faker.person.fullName()
const email = faker.internet.email()
```

**Animation:**
```tsx
import { motion } from 'framer-motion'
<motion.div animate={{ y: -20 }}>Content</motion.div>
```

**Drag and drop:**
```tsx
import { DndContext, useDraggable } from '@dnd-kit/core'
// See src/components/Welcome.tsx for complete example
```

### Configuration Files

- **vite.config.js** - Path alias (`@` → `./src`), React plugin
- **tsconfig.json** - Strict TypeScript, path mapping, ES2020 target
- **tailwind.config.js** - Dark mode, custom colors via CSS variables, animations
- **components.json** - shadcn/ui configuration (style: new-york, icons: lucide)
- **.eslintrc.cjs** - React + TypeScript rules, React refresh plugin

### Best Practices

1. **Always prefer editing existing files** over creating new ones
2. **Use shadcn components** as building blocks before creating custom UI
3. **Follow composition patterns** from `src/components/README.md`
4. **Leverage the path alias** (`@/`) for cleaner imports
5. **Check example components** (Welcome.tsx, MCP.tsx) for implementation patterns
6. **Use CSS modules** for component-specific styles to avoid conflicts
7. **Utilize custom hooks** (usePosition, useHotkeys) for common interactions
8. **Generate mock data** with faker for realistic prototypes
9. **Support dark mode** by using CSS variables and dark: variants
