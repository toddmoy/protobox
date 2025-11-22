# Protobox

An opinionated prototyping boilerplate for Codesandbox's Devbox or local development.

- [x] React / Vite
- [x] Tailwind CSS with dark mode
- [x] CSS Modules
- [x] Framer Motion
- [x] Lucide icons + react-icons
- [x] Hotkeys (react-hotkeys-hook)
- [x] Faker (mock data generation)
- [x] TypeScript with strict mode
- [x] React Router v6
- [x] Custom easing curves
- [x] Drag and Drop (@dnd-kit)
- [x] Hooks: [usehooks-ts](https://usehooks-ts.com/) and [@uidotdev/usehooks](https://usehooks.com/)
- [x] [clsx](https://www.npmjs.com/package/clsx) for classnames
- [x] [shadcn/ui](https://ui.shadcn.com/) components (34 pre-installed)

## Usage

To initialize a new project, run

```bash
$ npm create protobox@latest <project-name>
$ cd <project-name>
$ pnpm i
$ pnpm run dev
```

Other ways:
 
- Duplicate the repo, remove .git and reinitialize, install with `pnpm`
- [Open in Codesandbox](https://codesandbox.io/p/devbox/github/toddmoy/protobox)
- [Use repo template](https://github.com/new?template_name=protobox&template_owner=toddmoy)


Visit `http://localhost:5173` to see the welcome page with examples.

## Tips & Tricks

### Add a component

Using shadcn (34 components already installed):

```bash
npx shadcn-ui@latest add button
```

then use it like so:

```tsx
import { Button } from "@/components/ui/button"

<Button>Click me</Button>
```

**Available shadcn components:** accordion, alert, alert-dialog, aspect-ratio, badge, button, card, checkbox, drawer, dropdown-menu, hover-card, input, label, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, switch, table, tabs, textarea, toast, toaster, toggle, toggle-group, tooltip

### Component Development Guidelines

See [src/components/README.md](src/components/README.md) for detailed specs:
- Standard heights: 16px, 20px, 40px
- Simple default usage (minimal props required)
- Compose icons via `icon`, `leadingIcon`, or `trailingIcon` props
- Always accept `style`, `className`, and native element props

### Add a keyboard shortcut

```tsx
import { useHotkeys } from 'react-hotkeys-hook'

useHotkeys('ctrl+/', () => {
  alert("Shortcut pressed!")
})
```

### Add an icon

We use `react-icons` to easily insert icons from different libraries. [Browse icons](https://react-icons.github.io/react-icons/)

```tsx
import { FiBox } from "react-icons/fi"

<FiBox size={40} />
```

Or use Lucide React (included with shadcn):

```tsx
import { Box } from "lucide-react"

<Box size={40} />
```

### Use animation

```tsx
import { motion } from 'framer-motion'

<motion.div animate={{y: -20}}>...</motion.div>
```

### Use custom easing curves

Custom easing curves are available in `src/styles/easing.css`:

```css
animation-timing-function: var(--ease-out-expo);
```

### Use CSS modules

CSS modules make it easy to use generic classnames without fear they will have side effects.

1. Create a file `<Name>.module.css`
2. Import it: `import styles from './path/to/<Name>.module.css'`
3. Use it: `className={styles.<classname>}`

### Use fake data

Fake data generation is provided by [FakerJS](https://fakerjs.dev/guide/usage.html)

```tsx
import { faker } from '@faker-js/faker'

const name = faker.person.fullName()
const email = faker.internet.email()
const avatar = faker.image.avatar()
```

### Add drag and drop

Drag and drop functionality is provided by [@dnd-kit](https://docs.dndkit.com/):

```tsx
import { DndContext, useDraggable } from '@dnd-kit/core'

// See src/components/Welcome.tsx for a complete example
```

### Dark mode support

Dark mode is enabled via Tailwind's class-based system:

```tsx
<div className="bg-white dark:bg-zinc-900">
  Content adapts to theme
</div>
```

Toggle dark mode by adding/removing the `dark` class on the root element.

### Add a page

Routing is provided by [React Router v6](https://reactrouter.com/en/main/start/tutorial).

Edit `src/App.tsx`:

```tsx
import { NewPage } from './pages/NewPage'

<Routes>
  <Route path="/" element={<Welcome />} />
  <Route path="/new" element={<NewPage />} />
</Routes>
```

### Create a typewriter effect

Use the `useTypewriter` hook to create typing animations:

```tsx
import useTypewriter from "@/hooks/useTypewriter"

const { text } = useTypewriter('Hello, World!', {
  speed: 100,      // ms per character
  delay: 500,      // ms before starting
  cursor: true,    // show blinking cursor
  loop: false,     // repeat animation
})

<p>{text}</p>
```

**With manual control:**

```tsx
const { text, isComplete, start, pause, reset } = useTypewriter('Type on demand', {
  autoStart: false,
  onComplete: () => console.log('Done!')
})

<p>{text}</p>
<button onClick={start}>Start</button>
```

### Position something relative to another

Use the `usePosition` hook for tooltips, dropdowns, etc. Make sure the positioned element has a predictable width.

```tsx
import usePosition from "@/hooks/usePosition"

const buttonRef = useRef(null)
const { ref: menuRef, style } = usePosition(buttonRef, {
  position: 'left',  // 'top' | 'bottom' | 'left' | 'right'
  alignment: 'start', // 'start' | 'center' | 'end'
})

<button ref={buttonRef}>Target</button>
<div ref={menuRef} className="w-52" style={style}>
  Positioned content
</div>
```

### Utility classes

The `src/index.css` includes a helpful utility:

```tsx
<div className="center-content">
  {/* Flex container with items centered */}
</div>
```

## Claude Code Skills

This project includes specialized Claude Code skills for rapid prototyping:

- **animate** - UI animations and microinteractions using native CSS and Framer Motion
- **responsive** - Responsive layouts with Tailwind breakpoints, CSS Grid, and Flexbox
- **modernist** - Swiss Design, Bauhaus, Minimalist, and De Stijl-inspired interfaces

To use a skill in Claude Code, invoke it with `/animate`, `/responsive`, or `/modernist` when working on your project.

## Example Components

- **src/components/Welcome.tsx** - Landing page demonstrating Framer Motion, drag-and-drop, hotkeys, and faker
- **src/components/MCP.tsx** - Complex card component showcasing dark mode, composition patterns, and realistic mock data

## Development Commands

- `pnpm dev` - Start Vite development server
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm preview` - Preview production build

## Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn components (auto-generated)
│   └── ...           # Custom components
├── pages/            # Page components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── styles/           # Global styles and easing curves
├── App.tsx           # Router configuration
└── main.tsx          # Application entry point
```

## Path Alias

Use `@/` as a shortcut to `./src/`:

```tsx
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
```
