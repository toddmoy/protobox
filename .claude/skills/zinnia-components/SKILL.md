---
name: zinnia-components
description: Adds Zapier's Zinnia design system (@zapier/design-system components, tokens, icons) to this Vite + React prototype, including the package install, DesignSystemProvider wiring, and the Vite shims needed to avoid runtime errors. Use when the user wants to use Zinnia components (Button, Text, Modal, Icon, etc.), real Zapier UI components, or @zapier/design-system in a prototype. This is for actual components — for color-only branding of shadcn, use zapier-branding instead.
---

# Zinnia Components

Integrates `@zapier/design-system` into a Vite + React app (no Next.js). This covers real DS components — not just colors. For color-token-only theming of shadcn, use the `zapier-branding` skill instead.

## When to use
- User wants to use Zinnia / `@zapier/design-system` components (Button, Text, Heading, Modal, Icon)
- User wants real Zapier product UI, not just brand colors
- User references the `zinnia-prototype-starter` repo

## Critical gotchas (the reason this skill exists)

These four issues each produce a broken page. Address all of them.

1. **`process is not defined`** — DS code reads `process.env.NODE_ENV`. Vite doesn't define it. Add a `define` in `vite.config`.
2. **`Invalid hook call` / `Cannot read properties of null (reading 'useMemo')`** — linked DS packages pull a second copy of React. Dedupe React in `vite.config`.
3. **Packages may 404 on the public npm registry.** Fall back to linking from a local `zinnia-prototype-starter` clone.
4. **`onClick` does nothing on DS buttons** — Zinnia uses React Aria. Use `onPress`, not `onClick`.

## Workflow

```
- [ ] Step 1: Install packages (registry, or link fallback)
- [ ] Step 2: Add the CSS (token imports + Tailwind mapping)
- [ ] Step 3: Add ZinniaProvider and wrap the app
- [ ] Step 4: Patch vite.config (the shims)
- [ ] Step 5: Clear Vite cache, run, verify no console errors
```

### Step 1: Install packages

Core + React Aria peer deps + sass:

```bash
pnpm add @zapier/design-system @zapier/design-tokens @zapier/zinnia-icons react-aria react-aria-components sass
```

**If the registry returns 404** (private packages, no Okta/npm access), link them from a local checkout of the starter (clone/install `zinnia-prototype-starter` first):

```bash
pnpm add \
  @zapier/design-system@link:../../zapier/zinnia-prototype-starter/node_modules/@zapier/design-system \
  @zapier/design-tokens@link:../../zapier/zinnia-prototype-starter/node_modules/@zapier/design-tokens \
  @zapier/zinnia-icons@link:../../zapier/zinnia-prototype-starter/node_modules/@zapier/zinnia-icons \
  react-aria react-aria-components sass
```

Use a relative `link:` path. When full npm access is available later, swap `link:` entries for normal versions (`^10.1.0`, etc.) and reinstall.

### Step 2: Add the CSS

Copy `assets/zinnia.css` from this skill to `src/styles/zinnia.css`. It imports the three DS stylesheets (order matters: tokens → design-system → icons) and maps tokens to Tailwind v4 utilities via `@theme inline`.

Import it in `src/index.css` **before** `tailwindcss`:

```css
@import './styles/zinnia.css';
@import 'tailwindcss';
```

Point `body` at Zinnia tokens (keep existing vars as fallback):

```css
body {
  font-family: var(--zds-inter, inherit);
  background-color: var(--zds-background-default, var(--color-background));
  color: var(--zds-text-default, var(--color-foreground));
}
```

### Step 3: Add the provider

Copy `assets/ZinniaProvider.tsx` from this skill to `src/components/ZinniaProvider.tsx`. It wraps `DesignSystemProvider` with a React Router `Link` adapter and `useNavigate` (the DS provider expects a `LinkComponent` and `navigate`).

Wrap the app **inside** `BrowserRouter` (it uses `useNavigate`):

```tsx
<BrowserRouter>
  <ZinniaProvider>
    <Routes>{/* ... */}</Routes>
  </ZinniaProvider>
</BrowserRouter>
```

### Step 4: Patch vite.config

Apply these to `vite.config.js`. See `assets/vite.config.snippet.js` for the exact blocks.

- Wrap the export so `mode` is available: `defineConfig(({ mode }) => ({ ... }))`
- `define: { 'process.env.NODE_ENV': JSON.stringify(mode) }` — fixes `process is not defined`
- `resolve.dedupe: ['react', 'react-dom', 'react-aria', 'react-aria-components']` plus `react`/`react-dom` aliases to the local copies — fixes duplicate-React hook errors
- `optimizeDeps.include` the `@zapier/*` packages plus `react`, `react-dom`, `react/jsx-runtime`, `react/jsx-dev-runtime`
- `css.preprocessorOptions.scss.api = 'modern-compiler'` — for DS SCSS

### Step 5: Verify

```bash
rm -rf node_modules/.vite && pnpm dev
```

Clearing `node_modules/.vite` is required — stale pre-bundles keep the old errors. Then confirm:
- Page renders, no `process is not defined`
- No `Invalid hook call` / `useMemo` null errors
- A DS `<Button onPress={...}>` and an `<Icon name="zapierLogo" />` render

## Usage patterns

```tsx
import { Button, Heading, Text } from '@zapier/design-system'
import { Icon } from '@zapier/zinnia-icons'

<Text tag={Heading} type="PageHeader">Title</Text>
<Button variant="primary" size="medium" onPress={handlePress}>Save</Button>
<Icon name="zapierLogo" size={20} aria-label="Zapier" />
```

- Use `Text` / `Heading` for typography, not raw `<p>`/`<h1>`.
- Buttons use `onPress`, never `onClick`.
- Icon-only controls need `aria-label`.
- Custom UI can use the Zinnia-mapped Tailwind classes (`bg-background-weaker`, `text-text-default`, `rounded-lg`, `p-6`) defined in `zinnia.css`, or `var(--zds-*)` directly in CSS modules.

## Notes
- This is Vite-only. Do **not** adopt Next.js, `transpilePackages`, `'use client'`, or `next.config.js`.
- Reference repo: `zinnia-prototype-starter` (Next.js based — adapt patterns, don't copy its build config).
