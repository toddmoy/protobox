import { useEffect, type RefObject } from 'react'
import usePosition from '@/hooks/usePosition'
import { cn } from '@/lib/utils'
import type { SlashOption } from './types'

interface SlashMenuProps {
  /** Element to anchor the menu beneath (the active block). */
  anchorRef: RefObject<HTMLElement | null>
  options: SlashOption[]
  /** Index of the highlighted option (driven by the editor's key handler). */
  activeIndex: number
  onSelect: (option: SlashOption) => void
  onHover: (index: number) => void
}

export function SlashMenu({
  anchorRef,
  options,
  activeIndex,
  onSelect,
  onHover,
}: SlashMenuProps) {
  const { ref, style } = usePosition<HTMLDivElement>(anchorRef, {
    position: 'bottom',
    alignment: 'start',
    offset: 4,
  })

  // Keep the highlighted item scrolled into view as the user arrows through.
  useEffect(() => {
    const el = ref.current?.querySelector(`[data-index="${activeIndex}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, ref])

  if (options.length === 0) {
    return (
      <div
        ref={ref}
        style={style}
        className="w-64 rounded-md border border-gray-200 bg-white p-3 text-sm text-gray-400 shadow-lg"
      >
        No matching blocks
      </div>
    )
  }

  return (
    <div
      ref={ref}
      style={style}
      role="listbox"
      className="max-h-72 w-64 overflow-y-auto rounded-md border border-gray-200 bg-white p-1 shadow-lg"
    >
      {options.map((option, index) => {
        const Icon = option.icon
        const active = index === activeIndex
        return (
          <button
            key={option.id}
            type="button"
            data-index={index}
            role="option"
            aria-selected={active}
            // onMouseDown (not onClick) so we act before the contenteditable
            // blurs and loses the selection/caret.
            onMouseDown={(e) => {
              e.preventDefault()
              onSelect(option)
            }}
            onMouseEnter={() => onHover(index)}
            className={cn(
              'flex w-full items-center gap-2 rounded px-2 py-1.5 text-left',
              active ? 'bg-gray-100' : 'bg-transparent',
            )}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-gray-200 text-gray-600">
              <Icon size={15} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm text-gray-900">
                {option.label}
              </span>
              <span className="block truncate text-xs text-gray-400">
                {option.description}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
