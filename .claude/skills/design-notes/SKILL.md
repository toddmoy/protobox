---
name: "design-notes"
description: "Scaffold a design notes page with sidebar TOC, prose sections, dotted-grid canvases, and a changelog."
license: Proprietary
---

# Design Notes Skill

Scaffolds a full design-walkthrough page following the pattern established in `src/components/Welcome.tsx` (`/notes` route). Each page is a self-contained TSX file with inline helper components, a fixed sidebar TOC with scroll-spy, prose sections, dotted-grid canvases, and a changelog accordion.

## When to Use This Skill

Use when the user asks to:
- Create a design notes page, design walkthrough, or spec page
- Scaffold a new page that documents a feature with prose + live demos
- Create a page following the Welcome.tsx / `/notes` pattern

## Workflow

### Step 1: Gather Inputs

Ask the user for:
1. **Page title** — the h1 heading (e.g. "AI by Zapier / Agents Merger")
2. **Subtitle** — one-line description below the title
3. **Route path** — URL path (e.g. `/my-feature-notes`)
4. **Section names** — ordered list of section headings for the TOC (e.g. Overview, Canvas, Configuration, Execution, Design)

The eyebrow label defaults to "Design Walkthrough" unless specified.

### Step 2: Generate the Page File

Create `src/pages/<PageName>.tsx` using the full template below, substituting the user's inputs.

### Step 3: Add Route to App.tsx

In `src/App.tsx`:
```tsx
import PageName from './pages/PageName'

// Add inside <Routes>:
<Route path="/route-path" Component={PageName} />
```

### Step 4: Confirm

Tell the user the route is ready and suggest running `pnpm dev` to view it.

---

## Page Template

Use this as the skeleton for every design notes page. Replace `{PLACEHOLDERS}` with user inputs.

```tsx
import { useState, useEffect, useRef } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

// ─── Data ────────────────────────────────────────────────────────────────────

const TOC_ITEMS = [
  // One entry per section. The `id` must match the section's `id` attribute.
  // Example:
  // { id: "overview", label: "Overview" },
  // { id: "canvas", label: "Canvas" },
  {GENERATE_TOC_ITEMS}
  { id: "changelog", label: "Change Log" },
]

const CHANGELOG: { date: string; items: string[] }[] = [
  {
    date: "{TODAY_DATE}",
    items: [
      "Initial draft",
    ],
  },
]

// ─── Helper Components ───────────────────────────────────────────────────────

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[65ch] space-y-5 text-base leading-relaxed text-neutral-700">
      {children}
    </div>
  )
}

function Canvas({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-lg border border-neutral-200 bg-neutral-100 flex items-start justify-center p-8 ${className}`}
      style={{
        backgroundImage:
          "radial-gradient(circle, rgb(212 212 212) 1px, transparent 1px)",
        backgroundSize: "16px 16px",
      }}
    >
      {children}
    </div>
  )
}

function CanvasToolbar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-end">
      {children}
    </div>
  )
}

function TableOfContents() {
  const [activeId, setActiveId] = useState<string>("")
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    )

    TOC_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observerRef.current?.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <nav className="hidden xl:block fixed top-0 left-0 w-56 h-screen">
      <div className="flex flex-col justify-center h-full pl-8 pr-4">
        <ul className="space-y-1">
          {TOC_ITEMS.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
                }}
                className={`block py-1 text-sm transition-colors ${
                  activeId === id
                    ? "text-neutral-900 font-medium"
                    : "text-neutral-400 hover:text-neutral-600"
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function {PAGE_COMPONENT_NAME}() {
  return (
    <div className="min-h-screen bg-white">
      <TableOfContents />
      <div className="mx-auto max-w-4xl px-6 py-16 md:py-24 space-y-20">

        {/* ── Hero ──────────────────────────────────────────── */}
        <header className="space-y-4">
          <p className="text-sm font-medium tracking-wide text-neutral-400 uppercase">
            {EYEBROW_LABEL}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl">
            {PAGE_TITLE}
          </h1>
          <p className="max-w-[55ch] text-lg text-neutral-500">
            {PAGE_SUBTITLE}
          </p>
        </header>

        {/* ── Sections ──────────────────────────────────────── */}
        {GENERATE_SECTIONS}

        {/* ── Changelog ─────────────────────────────────────── */}
        <section className="space-y-0 scroll-mt-24">
          <Accordion type="multiple" className="w-full">
            <AccordionItem id="changelog" value="changelog" className="border-t border-neutral-200 scroll-mt-24">
              <AccordionTrigger className="text-sm font-semibold text-neutral-900 hover:no-underline">
                Change Log
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6">
                  {CHANGELOG.map((entry) => (
                    <div key={entry.date} className="space-y-2">
                      <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                        {entry.date}
                      </p>
                      <ul className="space-y-1.5">
                        {entry.items.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-neutral-600"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-300" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

      </div>
    </div>
  )
}
```

### Section Template

Each section in `{GENERATE_SECTIONS}` follows this pattern:

```tsx
<section id="{section_id}" className="space-y-8 scroll-mt-24">
  <div className="space-y-2">
    <h2 className="text-2xl font-semibold text-neutral-900">
      {Section Title}
    </h2>
    <div className="h-px bg-neutral-200" />
  </div>

  <Prose>
    <p>Section content goes here.</p>
  </Prose>
</section>
```

### TOC Items Template

Each entry in `{GENERATE_TOC_ITEMS}`:

```tsx
{ id: "{section_id}", label: "{Section Label}" },
```

The `id` is the kebab-case version of the section name. It must match the `id` attribute on the corresponding `<section>`.

---

## Reusable Pattern Reference

Use these patterns inside sections as needed. All are lifted directly from Welcome.tsx.

### Prose Block

```tsx
<Prose>
  <p>Paragraph text here.</p>
  <p>
    Links look like{" "}
    <a href="#" className="text-neutral-600 underline underline-offset-2 hover:text-neutral-900">
      this
    </a>.
  </p>
</Prose>
```

### Canvas with Minimum Height

```tsx
<Canvas className="min-h-[300px]">
  {/* Component demo or placeholder */}
</Canvas>
```

For taller canvases: `min-h-[400px]`, `min-h-[500px]`, `min-h-[600px]`.

### Canvas with Toolbar

```tsx
<div className="space-y-2">
  <CanvasToolbar>
    {/* Toggle controls, buttons, etc. */}
  </CanvasToolbar>
  <Canvas className="min-h-[400px]">
    {/* Demo content */}
  </Canvas>
</div>
```

### Considerations Callout

```tsx
<div className="border-l-2 border-neutral-200 pl-6">
  <Prose>
    <h3 className="text-sm font-semibold text-neutral-900">Considerations</h3>
    <ul className="list-disc pl-5 space-y-2 text-sm text-neutral-600">
      <li>First consideration.</li>
      <li>Second consideration.</li>
    </ul>
  </Prose>
</div>
```

### Image with Caption

```tsx
<div className="space-y-1.5">
  <p className="text-sm font-medium text-neutral-700">Caption text</p>
  <img
    src="/image-name.png"
    alt="Descriptive alt text"
    className="w-full rounded-lg border border-neutral-200 shadow-sm"
  />
</div>
```

Multiple images grouped:

```tsx
<div className="space-y-6">
  <div className="space-y-1.5">
    <p className="text-sm font-medium text-neutral-700">First caption</p>
    <img src="/img-1.png" alt="..." className="w-full rounded-lg border border-neutral-200 shadow-sm" />
  </div>
  <div className="space-y-1.5">
    <p className="text-sm font-medium text-neutral-700">Second caption</p>
    <img src="/img-2.png" alt="..." className="w-full rounded-lg border border-neutral-200 shadow-sm" />
  </div>
</div>
```

---

## Typography & Color Tokens

| Element | Classes |
|---------|---------|
| Eyebrow | `text-sm font-medium tracking-wide text-neutral-400 uppercase` |
| Title (h1) | `text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl` |
| Subtitle | `max-w-[55ch] text-lg text-neutral-500` |
| Body / Prose wrapper | `max-w-[65ch] space-y-5 text-base leading-relaxed text-neutral-700` |
| Section h2 | `text-2xl font-semibold text-neutral-900` |
| Section divider | `h-px bg-neutral-200` |
| Links (inline) | `text-neutral-600 underline underline-offset-2 hover:text-neutral-900` |
| Considerations h3 | `text-sm font-semibold text-neutral-900` |
| Considerations list | `list-disc pl-5 space-y-2 text-sm text-neutral-600` |
| Changelog date | `text-xs font-medium uppercase tracking-wide text-neutral-400` |
| Changelog item | `text-sm text-neutral-600` |
| Changelog bullet | `mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-300` |
| Image caption | `text-sm font-medium text-neutral-700` |
| Image | `w-full rounded-lg border border-neutral-200 shadow-sm` |

## Key Files

- `src/components/Welcome.tsx` — source of truth for all patterns
- `src/App.tsx` — route registration
- `src/index.css` — global styles, scrollbar-auto-hide utility
