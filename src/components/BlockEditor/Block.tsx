import {
  useEffect,
  useRef,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/utils'
import type { Block as BlockData } from './types'

interface BlockProps {
  block: BlockData
  selected: boolean
  registerRef: (el: HTMLElement | null) => void
  onKeyDown: (e: KeyboardEvent<HTMLDivElement>, block: BlockData) => void
  onInput: (block: BlockData, text: string) => void
  onBlur: (block: BlockData, text: string) => void
  onToggleCheck: (block: BlockData) => void
  /** mousedown on the block's selection chrome (handles plain + shift click). */
  onSelectMouseDown: (e: MouseEvent, block: BlockData) => void
}

const PLACEHOLDER: Record<string, string> = {
  paragraph: "Type '/' for commands",
  heading: 'Heading',
  list: 'List item',
  todo: 'To-do',
  quote: 'Quote',
  callout: 'Callout',
}

/** Per-type classes applied to the editable element. */
function editableClasses(block: BlockData): string {
  switch (block.type) {
    case 'heading': {
      const level = block.meta?.level ?? 1
      if (level === 1) return 'text-3xl font-bold text-gray-900'
      if (level === 2) return 'text-2xl font-semibold text-gray-900'
      return 'text-xl font-semibold text-gray-900'
    }
    case 'quote':
      return 'text-base italic text-gray-700'
    case 'callout':
      return 'text-base text-gray-800'
    case 'todo':
      return cn(
        'text-base text-gray-900',
        block.meta?.checked && 'text-gray-400 line-through',
      )
    default:
      return 'text-base text-gray-900'
  }
}

export function Block({
  block,
  selected,
  registerRef,
  onKeyDown,
  onInput,
  onBlur,
  onToggleCheck,
  onSelectMouseDown,
}: BlockProps) {
  const editableRef = useRef<HTMLDivElement>(null)

  // Render content into the DOM only when it diverges from what's already
  // there (e.g. after a split/merge that React drove). We never overwrite the
  // DOM mid-typing, which would fight the caret.
  useEffect(() => {
    const el = editableRef.current
    if (el && el.textContent !== block.content) {
      el.textContent = block.content
    }
  }, [block.content])

  const setRefs = (el: HTMLDivElement | null) => {
    editableRef.current = el
    registerRef(el)
  }

  // Selection chrome wraps every block variant. The ring/background paints when
  // selected; mousedown drives plain + shift-click selection.
  const wrap = (children: ReactNode) => (
    <div
      onMouseDown={(e) => onSelectMouseDown(e, block)}
      data-selected={selected || undefined}
      className={cn(
        'rounded px-1 transition-colors',
        selected && 'bg-blue-50 ring-1 ring-blue-300',
      )}
    >
      {children}
    </div>
  )

  if (block.type === 'divider') {
    // Non-editable, but still focusable so Backspace can target it for removal.
    return wrap(
      <div
        ref={setRefs}
        tabIndex={0}
        data-block-id={block.id}
        onKeyDown={(e) => onKeyDown(e, block)}
        className="group cursor-default py-2 outline-none"
        aria-label="Divider"
      >
        <hr className="border-t border-gray-300 group-focus:border-gray-500" />
      </div>,
    )
  }

  const editable = (
    <div
      ref={setRefs}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      data-block-id={block.id}
      data-placeholder={PLACEHOLDER[block.type] ?? ''}
      onKeyDown={(e) => onKeyDown(e, block)}
      onInput={() => onInput(block, editableRef.current?.textContent ?? '')}
      onBlur={() => onBlur(block, editableRef.current?.textContent ?? '')}
      className={cn(
        'min-h-[1.5em] flex-1 whitespace-pre-wrap break-words outline-none',
        'empty:before:pointer-events-none empty:before:text-gray-300 empty:before:content-[attr(data-placeholder)]',
        editableClasses(block),
      )}
    />
  )

  if (block.type === 'list') {
    return wrap(
      <div className="flex items-start gap-2 py-0.5">
        <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-gray-500" />
        {editable}
      </div>,
    )
  }

  if (block.type === 'todo') {
    return wrap(
      <div className="flex items-start gap-2 py-0.5">
        <input
          type="checkbox"
          checked={block.meta?.checked ?? false}
          onChange={() => onToggleCheck(block)}
          // Don't steal focus/caret from the editable when clicking the box.
          onMouseDown={(e) => e.preventDefault()}
          className="mt-[0.3em] h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300"
        />
        {editable}
      </div>,
    )
  }

  if (block.type === 'quote') {
    return wrap(
      <div className="border-l-2 border-gray-300 pl-3 py-0.5">{editable}</div>,
    )
  }

  if (block.type === 'callout') {
    return wrap(
      <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
        {editable}
      </div>,
    )
  }

  // paragraph + heading
  return wrap(<div className="py-0.5">{editable}</div>)
}
