import type { ComponentType } from 'react'
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  CheckSquare,
  Quote,
  Minus,
  MessageSquare,
} from 'lucide-react'

export type BlockType =
  | 'paragraph'
  | 'heading'
  | 'list'
  | 'todo'
  | 'divider'
  | 'quote'
  | 'callout'

export interface BlockMeta {
  level?: 1 | 2 | 3 // heading
  checked?: boolean // todo
  icon?: string // callout (reserved)
  color?: string // callout (reserved)
}

export interface Block {
  id: string
  type: BlockType
  content: string // plain text; '' for divider
  meta?: BlockMeta
}

/**
 * An entry shown in the slash menu. Selecting it applies `type` + `meta` to
 * the current block. `aliases` are extra strings the filter matches against.
 */
export interface SlashOption {
  id: string
  label: string
  description: string
  icon: ComponentType<{ size?: number; className?: string }>
  type: BlockType
  meta?: BlockMeta
  aliases: string[]
}

export const SLASH_OPTIONS: SlashOption[] = [
  {
    id: 'paragraph',
    label: 'Text',
    description: 'Plain paragraph',
    icon: Type,
    type: 'paragraph',
    aliases: ['paragraph', 'text', 'p', 'body'],
  },
  {
    id: 'heading-1',
    label: 'Heading 1',
    description: 'Large section heading',
    icon: Heading1,
    type: 'heading',
    meta: { level: 1 },
    aliases: ['h1', 'heading', 'title', 'header'],
  },
  {
    id: 'heading-2',
    label: 'Heading 2',
    description: 'Medium section heading',
    icon: Heading2,
    type: 'heading',
    meta: { level: 2 },
    aliases: ['h2', 'heading', 'subtitle', 'header'],
  },
  {
    id: 'heading-3',
    label: 'Heading 3',
    description: 'Small section heading',
    icon: Heading3,
    type: 'heading',
    meta: { level: 3 },
    aliases: ['h3', 'heading', 'header'],
  },
  {
    id: 'list',
    label: 'Bulleted list',
    description: 'A simple bullet point',
    icon: List,
    type: 'list',
    aliases: ['list', 'bullet', 'ul', 'unordered'],
  },
  {
    id: 'todo',
    label: 'To-do',
    description: 'A checkbox item',
    icon: CheckSquare,
    type: 'todo',
    meta: { checked: false },
    aliases: ['todo', 'task', 'checkbox', 'check'],
  },
  {
    id: 'quote',
    label: 'Quote',
    description: 'Capture a quotation',
    icon: Quote,
    type: 'quote',
    aliases: ['quote', 'blockquote', 'cite'],
  },
  {
    id: 'callout',
    label: 'Callout',
    description: 'Make text stand out',
    icon: MessageSquare,
    type: 'callout',
    aliases: ['callout', 'note', 'info', 'aside'],
  },
  {
    id: 'divider',
    label: 'Divider',
    description: 'Visually divide blocks',
    icon: Minus,
    type: 'divider',
    aliases: ['divider', 'hr', 'rule', 'line', 'separator'],
  },
]

/** Filter the slash options against a query (matches label + aliases). */
export function filterSlashOptions(query: string): SlashOption[] {
  const q = query.trim().toLowerCase()
  if (!q) return SLASH_OPTIONS
  return SLASH_OPTIONS.filter((opt) => {
    if (opt.label.toLowerCase().includes(q)) return true
    return opt.aliases.some((a) => a.includes(q))
  })
}

export function createBlock(
  type: BlockType = 'paragraph',
  content = '',
  meta?: BlockMeta,
): Block {
  return { id: crypto.randomUUID(), type, content, meta }
}
