# Hooks Directory

Custom React hooks for common UI patterns.

## Available Hooks

### usePosition
Positions elements relative to a target (tooltips, dropdowns, popovers).

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

### useTypewriter
Creates typing animations with optional cursor.

```tsx
import useTypewriter from '@/hooks/useTypewriter'

const { text, isComplete, start, pause, reset } = useTypewriter('Hello, World!', {
  speed: 100,      // ms per character
  delay: 500,      // ms before starting
  cursor: true,    // show blinking cursor
  autoStart: true, // start immediately
})

<p>{text}</p>
```

### useToast
Toast notification hook from shadcn/ui. See shadcn documentation.

## Guidelines

- Hooks should be self-contained and reusable
- Use TypeScript for type safety
- Export as default for simpler imports
- Add demos in `src/pages/` for testing
