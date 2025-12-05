# Components Directory

Custom React components for the protobox project.

## Structure

- `ui/` - shadcn/ui components (auto-generated, **don't edit directly**)
- Root files - Custom components

## Component Guidelines

### Standard Heights
- **Small**: 16px
- **Medium**: 20px  
- **Large**: 40px

### Props Pattern
- Simple default usage (minimal props required)
- Always accept `style`, `className`, and native element props
- Icons via `icon`, `leadingIcon`, or `trailingIcon` props
- Use composition over prop explosion

### Example Component
```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
  variant?: 'default' | 'outline' | 'ghost'
}
```

## Reference Components

- **Welcome.tsx** - Framer Motion, drag-drop, hotkeys, faker
- **MCP.tsx** - Dark mode patterns, composition, Lucide icons

## Adding shadcn Components

```bash
npx shadcn-ui@latest add <component-name>
```

Components are installed to `ui/` and can be customized after installation.
