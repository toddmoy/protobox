---
name: "use-zinnia"
description: "Add Zinnia (Zapier's design system) components to this Vite/React protobox project."
license: Proprietary
---

# Use Zinnia Skill

Guides setup and usage of Zapier's Zinnia design system (`@zapier/design-system`) in this Vite + React protobox project.

## Prerequisites

Zinnia packages are private NPM packages. Verify auth before installing:

```bash
npm whoami
# Must return your Zapier npm username (e.g. todd.moy-zapier)
# If it fails: npm login
```

## Setup (run once per repo)

### 1. Install packages

```bash
pnpm add @zapier/design-system @zapier/design-tokens @zapier/zinnia-icons
```

### 2. Add `process.env` polyfill in `vite.config.js`

`@zapier/design-system` references `process.env.NODE_ENV` internally. Vite doesn't polyfill this in the browser, causing a `ReferenceError: process is not defined` at runtime. Add a `define` to the Vite config:

```js
export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'development'),
  },
  // ... rest of config
})
```

### 3. Import Zinnia CSS in `src/main.tsx`

Add before `./index.css`:

```tsx
import '@zapier/design-tokens/custom-properties.css'
import '@zapier/design-system/style.css'
import '@zapier/zinnia-icons/style.css'
import './index.css'
```

Order matters: tokens first, then design system styles, then local overrides.

### 4. Add Zinnia token mappings to `src/index.css`

In the `@theme inline { }` block, add token aliases so Tailwind utilities can reference Zinnia values:

```css
/* Zinnia design token mappings */
--color-zds-background: var(--zds-background-default);
--color-zds-background-weaker: var(--zds-background-weaker);
--color-zds-text: var(--zds-text-default);
--color-zds-text-weaker: var(--zds-text-weaker);
--color-zds-stroke: var(--zds-stroke-default);
--color-zds-stroke-weaker: var(--zds-stroke-weaker);
--color-zds-brand: var(--zds-ui-brand);
/* ... see src/index.css for full list */
```

That's it — no `tailwind.config.js` needed (Tailwind v4 uses CSS-based config).

## Using Components

### Import pattern

```tsx
// UI components from design-system
import { Button, Text, Badge, TextInput, ServiceIcon } from '@zapier/design-system'

// Icons from zinnia-icons (NOT from design-system)
import { Icon } from '@zapier/zinnia-icons'
```

**`Icon` is NOT exported from `@zapier/design-system`.** It comes from `@zapier/zinnia-icons`.

### No `'use client'` needed

Unlike the Next.js prototype starter, this is a Vite CSR app — no `'use client'` directive needed.

### Text

`Text` uses a `type` prop for size/weight, not `size`. Verified type values from real usage:

```tsx
<Text type="PageHeader" tag="h1">Page title</Text>
<Text type="SectionHeader" tag="h2">Section</Text>
<Text type="ParagraphHeader1">Subsection</Text>
<Text type="ParagraphHeader2">Subsection</Text>
<Text type="ParagraphHeader3">Subsection</Text>
<Text type="Body1">Body text</Text>
<Text type="Body2">Body text</Text>
<Text type="Body3">Body text</Text>
<Text type="SmallPrint1">Small text</Text>
<Text type="SmallPrint2">Small text</Text>
<Text type="MinimalPrint1">Tiny label</Text>
```

Color values (pass as `color` prop):
```tsx
<Text color="TextDefault">...</Text>
<Text color="TextWeaker">...</Text>
<Text color="TextWeakest">...</Text>
<Text color="TextLink">...</Text>
```

Use `tag` to control the rendered HTML element (`"h1"`, `"h2"`, `"p"`, `"span"`, `"div"`).

### Button

```tsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="tertiary">Tertiary</Button>
<Button variant="primary" size="compact">Compact</Button>
<Button variant="primary" disabled>Disabled</Button>
```

### Badge

Uses `variant`, not `color`:

```tsx
<Badge variant="neutral">Neutral</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error-stronger">Error strong</Badge>
```

### TextInput / form controls

```tsx
<TextInput label="Email" placeholder="you@zapier.com" isFullWidth />
<TextInput label="Password" type="password" isFullWidth />
<Checkbox checked={checked} onChange={() => setChecked(v => !v)} id="my-check" />
<ToggleSwitch checked={toggled} onChange={() => setToggled(v => !v)} id="my-toggle" />
```

### Spinner

```tsx
<Spinner size="small" />
<Spinner size="medium" />
<Spinner size="large" />
```

### Icons

Icons come from `@zapier/zinnia-icons`. **Never guess icon names** — they follow category prefixes:

| Prefix | Examples |
|--------|---------|
| `form` | `formCheck`, `formX`, `formAdd`, `formAddCircle`, `formDash` |
| `action` | `actionEdit`, `actionCopy`, `actionFilter`, `actionEmail`, `actionDownload`, `actionPlay` |
| `nav` | `navHome`, `navFolder`, `navSearch`, `navApiByZapier` |
| `misc` | `miscBolt`, `miscAI`, `miscClock`, `miscBundle` |
| `status` | check storybook |

To find icon names programmatically:
```js
const { iconNames } = require('@zapier/zinnia-icons')
iconNames.filter(n => n.toLowerCase().includes('check'))
```

Usage:
```tsx
<Icon name="formCheck" size="small" />   // small | medium | large
<Icon name="actionEdit" size="medium" />
```

**`zapierLogo` icon** is a filled rounded square (the Zapier mark). It renders black by default because it uses `currentColor`. Pass `color="UiBrand"` to get orange:

```tsx
<Icon name="zapierLogo" size="medium" color="UiBrand" />
```

The `color` prop takes named keys from the zinnia-icons color table — not CSS values, not hex strings. Useful named colors: `UiBrand`, `UiBrandWeaker`, `UiBrandStronger`, `TextDefault`, `TextWeaker`, `TextWeakest`, `TextLink`, `StatusSuccess`, `StatusError`, `StatusWarning`, `BrandOrange`.

### Service Icons

```tsx
import { ServiceIcon } from '@zapier/design-system'

<ServiceIcon serviceName="Gmail" src="https://zapier-images.imgix.net/..." size="medium" />
```

**Service icon URLs must be real imgix CDN hashes** — never invent or guess them. Source URLs from:
- `/Users/toddmoy/code/zapier/zinnia-prototype-starter/lib/services.ts` — curated list of ~50 verified services
- Or run `node scripts/lookup-service-logo.js "app name"` in the prototype starter

Common verified services (name → src hash):

| Service | URL |
|---------|-----|
| Gmail | `https://zapier-images.imgix.net/storage/services/1afcb319c029ec5da10efb593b7159c8.png` |
| Slack | `https://zapier-images.imgix.net/storage/services/6cf3f5a461feadfba7abc93c4c395b33_2.png` |
| Google Sheets | `https://zapier-images.imgix.net/storage/services/8913a06feb7556d01285c052e4ad59d0.png` |
| Google Drive | `https://zapier-images.imgix.net/storage/services/a5b8a9920e9dae8a73711590e7090d3d.png` |
| Google Calendar | `https://zapier-images.imgix.net/storage/services/5839ae4d0567a01a65dd87d3476927c1.png` |
| Notion | `https://zapier-images.imgix.net/storage/services/0de44c7d5f0046873886168b9b498f66_3.png` |
| Airtable | `https://zapier-images.imgix.net/storage/developer/c6c8c5e300ef0da0e47b3084e5522f20.png` |
| Discord | `https://zapier-images.imgix.net/storage/services/ca03beabe94d8f97ba6fbf75cbb695c4.png` |
| Linear | `https://zapier-images.imgix.net/storage/developer_cli/703339d83e11ba76a226c86175413468.png` |
| GitHub | `https://zapier-images.imgix.net/storage/services/c63f7c57dc0afb733535a5adccce4d01.png` |

### Using design tokens directly

Zinnia tokens are available as CSS custom properties anywhere after setup:

```tsx
<div style={{
  padding: 'var(--zds-space-24)',
  color: 'var(--zds-text-default)',
  background: 'var(--zds-background-weaker)',
  borderRadius: 'var(--zds-radius-large)',
  gap: 'var(--zds-space-8)',
}}>
```

**Token categories:**
- Spacing: `--zds-space-0` through `--zds-space-48`
- Text: `--zds-text-default`, `--zds-text-weaker`, `--zds-text-weakest`, `--zds-text-link`
- Background: `--zds-background-default`, `--zds-background-weaker`, `--zds-background-stronger`, `--zds-background-strongest`, `--zds-background-selected`
- Stroke (borders): `--zds-stroke-default`, `--zds-stroke-weaker`, `--zds-stroke-stronger`
- Radius: `--zds-radius-none`, `--zds-radius-xsmall`, `--zds-radius-default`, `--zds-radius-medium`, `--zds-radius-large`, `--zds-radius-xlarge`, `--zds-radius-pill`
- Font families: `--zds-inter`, `--zds-degular`, `--zds-jet-brains-mono`
- Font sizes: `--zds-font-size-minimal` (12px), `--zds-font-size-small-print` (13px), `--zds-font-size-default` (14px), `--zds-font-size-header` (18px)
- Shadows: `--zds-shadow-1` through `--zds-shadow-5`
- Brand: `--zds-ui-brand`, `--zds-ui-brand-weaker`, `--zds-ui-brand-stronger`
- Status: `--zds-status-error`, `--zds-status-warning`, `--zds-status-success` (each with `-weaker`/`-stronger`)

## NEVER invent props or token names

Zinnia's API does NOT match shadcn/Tailwind naming conventions. Verified mistakes to avoid:

| ❌ Wrong | ✅ Right |
|----------|---------|
| `<Icon name="actionCheck">` | `<Icon name="formCheck">` — use `formCheck`, not `actionCheck` |
| `<Icon name="actionClose">` | `<Icon name="formX">` — use `formX` |
| `<Icon name="actionSearch">` | `<Icon name="navSearch">` — search is in `nav` category |
| `<Icon name="zapierLogo">` with no color | Add `color="UiBrand"` or it renders black |
| `<Icon color="var(--zds-ui-brand)">` | `<Icon color="UiBrand">` — named key, not CSS value |
| `<Badge color="green">` | `<Badge variant="success">` — Badge uses `variant` |
| `<Text size="small">` | `<Text type="SmallPrint1">` — use `type`, not `size` |
| `var(--zds-foreground-primary)` | `var(--zds-text-default)` |
| `var(--zds-border-primary)` | `var(--zds-stroke-default)` |
| `import { Icon } from '@zapier/design-system'` | `import { Icon } from '@zapier/zinnia-icons'` |

**When unsure about a component's props:** Search usage in `/Users/toddmoy/code/zapier/zinnia-prototype-starter/app/` or check the storybook.

## Verifying setup works

```bash
pnpm build  # Must succeed with no errors
```

A smoke test page at `/zinnia` (`src/pages/ZinniaDemo.tsx`) covers: color swatches, type scale, buttons, badges, icons, service icons, form controls, and spinner.

## Coexistence with shadcn/ui

Zinnia and shadcn components coexist without conflict. Both use Radix UI under the hood. The shadcn color tokens (HSL `--background`, `--foreground`, etc.) and Zinnia tokens (`--zds-*`) do not conflict.

## Reference

- Zinnia Storybook: https://zinnia-storybook.zapier.com
- Prototype starter (local): `/Users/toddmoy/code/zapier/zinnia-prototype-starter`
- Service logo URLs: `/Users/toddmoy/code/zapier/zinnia-prototype-starter/lib/services.ts`
