# Pillbox Pattern

This skill provides guidance for implementing inline structured text editors with "pill" components using Tiptap.

## Overview

The pillbox pattern creates an inline text editor where special tokens (pills/badges) flow naturally within text content, wrapping across lines like regular text while maintaining their distinct visual appearance.

## Implementation Details

### Dependencies

```bash
pnpm add @tiptap/react @tiptap/core @tiptap/pm @tiptap/starter-kit
pnpm add @tiptap/extension-document @tiptap/extension-paragraph @tiptap/extension-text @tiptap/extension-history
```

### File Structure

```
src/
├── extensions/
│   └── Pill.ts              # Custom Tiptap node extension
├── components/
│   ├── PillComponent.tsx    # React component for rendering pills
│   └── Editor.tsx           # Main editor wrapper
└── pages/
    └── EditorPage.tsx       # Demo page with example content
```

### Custom Pill Extension

**Location**: `src/extensions/Pill.ts`

Key characteristics:
- `group: 'inline'` - Makes pills flow inline with text
- `inline: true` - Allows pills to appear within paragraphs
- `atom: true` - Makes pills non-editable blocks
- Attributes: `label` (string), `color` (string)
- Uses `ReactNodeViewRenderer` for custom React rendering

```typescript
import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import PillComponent from '../components/PillComponent'

export const Pill = Node.create({
  name: 'pill',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      label: { default: null },
      color: { default: 'default' },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(PillComponent)
  },
})
```

### Pill Component

**Location**: `src/components/PillComponent.tsx`

Key features:
- Uses `NodeViewWrapper` with `as="span"` for inline rendering
- `inline-block align-baseline` for proper text flow
- `flex items-center gap-1` for icon + text layout
- Lucide icons selected via hash function for consistency
- Icon size: 12px for compact appearance
- Color variants: default, blue, green, purple, red

```typescript
import { NodeViewWrapper } from '@tiptap/react'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Calendar, /* etc */ } from 'lucide-react'

const PillComponent = ({ node }: any) => {
  const { label, color } = node.attrs

  // Hash-based icon selection
  const getIcon = (label: string) => {
    const hash = label.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return icons[hash % icons.length]
  }

  return (
    <NodeViewWrapper as="span" className="inline-block align-baseline">
      <Badge className="flex items-center gap-1">
        <Icon size={12} />
        {label}
      </Badge>
    </NodeViewWrapper>
  )
}
```

### Editor Component

**Location**: `src/components/Editor.tsx`

Minimal configuration:
- Only essential extensions: Document, Paragraph, Text, History, Pill
- No formatting extensions (bold, italic, headings, etc.)
- Content passed as object (not string)
- Styled editor wrapper with border and padding

```typescript
import { useEditor, EditorContent } from '@tiptap/react'
import { Document, Paragraph, Text, History } from '@tiptap/extension-*'
import { Pill } from '../extensions/Pill'

const Editor = ({ content }: { content?: any }) => {
  const editor = useEditor({
    extensions: [Document, Paragraph, Text, History, Pill],
    content: content || '',
  })

  return <EditorContent editor={editor} />
}
```

### Content Format

Pills are represented in Tiptap's JSON format:

```typescript
const content = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Regular text with ' },
        {
          type: 'pill',
          attrs: { label: 'inline pills', color: 'blue' }
        },
        { type: 'text', text: ' that wrap naturally.' },
      ]
    }
  ]
}

// Pass as object, NOT stringified
<Editor content={content} />
```

## Key Design Decisions

1. **Inline rendering**: Pills use `inline-block` with `align-baseline` to flow with text
2. **Atomic nodes**: Pills are non-editable units that behave as single characters
3. **Icon consistency**: Hash function ensures same label always gets same icon
4. **Minimal extensions**: Only unformatted text to keep editor simple
5. **Color coding**: Visual categorization via background colors
6. **Dark mode**: All colors have dark mode variants

## Common Pitfalls

1. ❌ Don't stringify content: `content={JSON.stringify(obj)}`
   ✅ Pass object directly: `content={obj}`

2. ❌ Don't use `display: inline` on NodeViewWrapper
   ✅ Use `as="span"` with `inline-block` class

3. ❌ Don't forget `align-baseline`
   ✅ Ensures proper vertical alignment with text

4. ❌ Don't use random icons on each render
   ✅ Use deterministic hash function for consistency

## Extending the Pattern

To add more functionality:

- **Insert command**: Already included in extension (`insertPill`)
- **Click handlers**: Add `onClick` to Badge component
- **Tooltips**: Wrap Badge with Tooltip component
- **Custom attributes**: Add more attrs in extension definition
- **Autocomplete**: Listen to editor input events
- **Keyboard navigation**: Use arrow keys to move between pills

## Example Use Cases

- Template variables (e.g., `{{user.name}}`)
- Mentions (@username)
- Tags and categories
- Dynamic fields in forms
- Variable insertion in email templates
- Entity references in rich text

## Reference Files

See implementation in this codebase:
- `src/extensions/Pill.ts` - Custom node extension
- `src/components/PillComponent.tsx` - Visual rendering
- `src/components/Editor.tsx` - Editor setup
- `src/pages/EditorPage.tsx` - Demo with examples
