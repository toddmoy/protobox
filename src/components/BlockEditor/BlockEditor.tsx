import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from 'react'
import { cn } from '@/lib/utils'
import { Block } from './Block'
import { SlashMenu } from './SlashMenu'
import { useBlockFocus } from './useBlockFocus'
import {
  createBlock,
  filterSlashOptions,
  type Block as BlockData,
  type SlashOption,
} from './types'

interface SlashState {
  blockId: string
  /** Caret offset where the triggering '/' sits. */
  slashOffset: number
  query: string
  activeIndex: number
}

interface BlockEditorProps {
  initialBlocks?: BlockData[]
  className?: string
}

/** Character offset of the caret within an editable element (start of selection). */
function caretOffset(el: HTMLElement): number {
  const sel = window.getSelection()
  if (!sel || sel.rangeCount === 0) return 0
  const range = sel.getRangeAt(0).cloneRange()
  range.selectNodeContents(el)
  range.setEnd(sel.getRangeAt(0).startContainer, sel.getRangeAt(0).startOffset)
  return range.toString().length
}

const CONTINUABLE = new Set(['list', 'todo'])

export function BlockEditor({ initialBlocks, className }: BlockEditorProps) {
  const [blocks, setBlocks] = useState<BlockData[]>(
    () => initialBlocks ?? [createBlock('paragraph')],
  )
  const [slash, setSlash] = useState<SlashState | null>(null)
  // Block-level selection (whole blocks, not cross-block text).
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())
  // Block where a range-selection started (for shift+click / shift+arrow).
  const selectionAnchor = useRef<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { registerRef, requestFocus, getRef } = useBlockFocus()

  const selecting = selectedIds.size > 0

  // Anchor for the slash menu's positioning. Set in the key handler (an event
  // handler may touch refs) the instant the menu opens, so usePosition's layout
  // effect sees the element on the first frame.
  const anchorRef = useRef<HTMLElement | null>(null)

  const slashOptions = useMemo(
    () => (slash ? filterSlashOptions(slash.query) : []),
    [slash],
  )

  const indexOf = useCallback(
    (id: string) => blocks.findIndex((b) => b.id === id),
    [blocks],
  )

  const closeSlash = useCallback(() => setSlash(null), [])

  // --- Block-level selection ----------------------------------------------

  const clearSelection = useCallback(() => {
    selectionAnchor.current = null
    setSelectedIds((prev) => (prev.size === 0 ? prev : new Set()))
  }, [])

  /** Select a single block, set it as the range anchor, focus the container. */
  const selectSingle = useCallback((id: string) => {
    selectionAnchor.current = id
    setSelectedIds(new Set([id]))
    // Focus the container so blurred editables hand keystrokes to the
    // selection-mode key handler.
    containerRef.current?.focus()
  }, [])

  /** Select the inclusive index range between the anchor and a target block. */
  const selectRange = useCallback(
    (targetId: string) => {
      const anchorId = selectionAnchor.current ?? targetId
      const a = indexOf(anchorId)
      const b = indexOf(targetId)
      if (a === -1 || b === -1) return
      const [lo, hi] = a <= b ? [a, b] : [b, a]
      const next = new Set(blocks.slice(lo, hi + 1).map((bl) => bl.id))
      if (!selectionAnchor.current) selectionAnchor.current = anchorId
      setSelectedIds(next)
      containerRef.current?.focus()
    },
    [blocks, indexOf],
  )

  /** Grow/shrink the selection from the anchor in a direction (+1 / -1). */
  const extendSelection = useCallback(
    (dir: 1 | -1) => {
      const ids = [...selectedIds]
      if (ids.length === 0) return
      const anchorId = selectionAnchor.current ?? ids[0]
      const anchorIdx = indexOf(anchorId)
      // The "moving" edge is whichever selected block isn't the anchor end.
      const indices = ids.map(indexOf).sort((x, y) => x - y)
      const lo = indices[0]
      const hi = indices[indices.length - 1]
      const movingEdge = anchorIdx === lo ? hi : lo
      const target = Math.max(0, Math.min(blocks.length - 1, movingEdge + dir))
      const [a, b] = anchorIdx <= target ? [anchorIdx, target] : [target, anchorIdx]
      setSelectedIds(new Set(blocks.slice(a, b + 1).map((bl) => bl.id)))
    },
    [selectedIds, blocks, indexOf],
  )

  // --- Structural operations ----------------------------------------------

  const insertParagraphAfter = useCallback(
    (block: BlockData, before: string, after: string, sameType = false) => {
      setBlocks((prev) => {
        const i = prev.findIndex((b) => b.id === block.id)
        if (i === -1) return prev
        const next = [...prev]
        next[i] = { ...next[i], content: before }
        const newType = sameType ? block.type : 'paragraph'
        const newMeta =
          sameType && block.type === 'todo' ? { checked: false } : undefined
        const created = createBlock(newType, after, newMeta)
        next.splice(i + 1, 0, created)
        requestFocus({ blockId: created.id, offset: 0 })
        return next
      })
    },
    [requestFocus],
  )

  const convertToParagraph = useCallback((block: BlockData) => {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === block.id
          ? { ...b, type: 'paragraph', content: '', meta: undefined }
          : b,
      ),
    )
  }, [])

  const mergeIntoPrevious = useCallback(
    (block: BlockData, currentText: string) => {
      setBlocks((prev) => {
        const i = prev.findIndex((b) => b.id === block.id)
        if (i <= 0) return prev
        const prevBlock = prev[i - 1]

        // A divider can't absorb text — just remove it and land on whoever
        // precedes it (or the current block if the divider is above).
        if (prevBlock.type === 'divider') {
          const next = prev.filter((b) => b.id !== prevBlock.id)
          requestFocus({ blockId: block.id, offset: 0 })
          return next
        }

        const joinAt = prevBlock.content.length
        const next = [...prev]
        next[i - 1] = { ...prevBlock, content: prevBlock.content + currentText }
        next.splice(i, 1)
        requestFocus({ blockId: prevBlock.id, offset: joinAt })
        return next
      })
    },
    [requestFocus],
  )

  const deleteBlock = useCallback(
    (block: BlockData) => {
      setBlocks((prev) => {
        const i = prev.findIndex((b) => b.id === block.id)
        if (i <= 0) return prev // never delete the first/only block here
        const prevBlock = prev[i - 1]
        const next = prev.filter((b) => b.id !== block.id)
        requestFocus({ blockId: prevBlock.id, offset: -1 })
        return next
      })
    },
    [requestFocus],
  )

  const deleteSelected = useCallback(() => {
    setBlocks((prev) => {
      const firstIdx = prev.findIndex((b) => selectedIds.has(b.id))
      if (firstIdx === -1) return prev
      const next = prev.filter((b) => !selectedIds.has(b.id))
      if (next.length === 0) {
        const fresh = createBlock('paragraph')
        requestFocus({ blockId: fresh.id, offset: 0 })
        return [fresh]
      }
      // Land on the survivor now occupying the first deleted slot (clamped).
      const survivor = next[Math.min(firstIdx, next.length - 1)]
      requestFocus({ blockId: survivor.id, offset: -1 })
      return next
    })
    clearSelection()
  }, [selectedIds, requestFocus, clearSelection])

  /** Leave selection mode and edit a single block (caret at end). */
  const editBlock = useCallback(
    (id: string, offset = -1) => {
      clearSelection()
      requestFocus({ blockId: id, offset })
    },
    [clearSelection, requestFocus],
  )

  const applySlashOption = useCallback(
    (state: SlashState, option: SlashOption) => {
      setBlocks((prev) => {
        const i = prev.findIndex((b) => b.id === state.blockId)
        if (i === -1) return prev
        const el = getRef(state.blockId)
        const fullText = el?.textContent ?? prev[i].content
        // Strip the "/query" run that triggered the menu.
        const stripped =
          fullText.slice(0, state.slashOffset) +
          fullText.slice(state.slashOffset + 1 + state.query.length)

        const next = [...prev]
        if (option.type === 'divider') {
          next[i] = { ...next[i], type: 'divider', content: '', meta: undefined }
          // Land focus on the divider so a follow-up Backspace can remove it.
          requestFocus({ blockId: next[i].id, offset: 0 })
        } else {
          next[i] = {
            ...next[i],
            type: option.type,
            content: stripped,
            meta: option.meta ? { ...option.meta } : undefined,
          }
          requestFocus({ blockId: next[i].id, offset: state.slashOffset })
        }
        return next
      })
      closeSlash()
    },
    [getRef, requestFocus, closeSlash],
  )

  // --- Per-block text sync -------------------------------------------------

  const handleInput = useCallback(
    (block: BlockData, text: string) => {
      if (!slash || slash.blockId !== block.id) return
      // Re-derive the query from the current text after the slash position.
      const el = getRef(block.id)
      const offset = el ? caretOffset(el) : slash.slashOffset
      // If the caret moved before the slash, or the slash char is gone, close.
      if (offset <= slash.slashOffset || text[slash.slashOffset] !== '/') {
        closeSlash()
        return
      }
      const query = text.slice(slash.slashOffset + 1, offset)
      setSlash((s) => (s ? { ...s, query, activeIndex: 0 } : s))
    },
    [slash, getRef, closeSlash],
  )

  const handleBlur = useCallback((block: BlockData, text: string) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === block.id ? { ...b, content: text } : b)),
    )
  }, [])

  /**
   * mousedown on a block's selection chrome. Shift+click range-selects (and
   * suppresses the native text selection / focus). A plain click is left to
   * fall through to the contenteditable, but if we're currently in selection
   * mode it exits back to editing that block.
   */
  const handleSelectMouseDown = useCallback(
    (e: MouseEvent, block: BlockData) => {
      if (e.shiftKey) {
        e.preventDefault() // don't start a native text selection
        selectRange(block.id)
        return
      }
      if (selecting) clearSelection()
    },
    [selectRange, selecting, clearSelection],
  )

  const handleToggleCheck = useCallback((block: BlockData) => {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === block.id
          ? { ...b, meta: { ...b.meta, checked: !b.meta?.checked } }
          : b,
      ),
    )
  }, [])

  // --- Key dispatch --------------------------------------------------------

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>, block: BlockData) => {
      // Slash menu navigation takes priority while open.
      if (slash && slash.blockId === block.id) {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setSlash((s) =>
            s
              ? { ...s, activeIndex: (s.activeIndex + 1) % slashOptions.length }
              : s,
          )
          return
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault()
          setSlash((s) =>
            s
              ? {
                  ...s,
                  activeIndex:
                    (s.activeIndex - 1 + slashOptions.length) %
                    slashOptions.length,
                }
              : s,
          )
          return
        }
        if (e.key === 'Enter') {
          e.preventDefault()
          const option = slashOptions[slash.activeIndex]
          if (option) applySlashOption(slash, option)
          return
        }
        if (e.key === 'Escape') {
          e.preventDefault()
          closeSlash()
          return
        }
      }

      // Escape (slash closed) drops out of editing into block selection.
      if (e.key === 'Escape') {
        e.preventDefault()
        ;(e.currentTarget as HTMLElement).blur()
        selectSingle(block.id)
        return
      }

      const el = e.currentTarget
      const offset = caretOffset(el)
      const text = el.textContent ?? ''

      if (e.key === '/' && block.type !== 'divider') {
        // Opening the menu — record where the slash lands and anchor the menu
        // to this block before the next render so usePosition can place it.
        anchorRef.current = el
        setSlash({
          blockId: block.id,
          slashOffset: offset,
          query: '',
          activeIndex: 0,
        })
        return // let the '/' character type normally
      }

      if (e.key === 'Enter' && !e.shiftKey && block.type !== 'divider') {
        e.preventDefault()
        const isEmpty = text.length === 0
        if (CONTINUABLE.has(block.type)) {
          if (isEmpty) {
            convertToParagraph(block)
            return
          }
          insertParagraphAfter(block, text.slice(0, offset), text.slice(offset), true)
          return
        }
        insertParagraphAfter(block, text.slice(0, offset), text.slice(offset))
        return
      }

      if (e.key === 'Backspace') {
        const i = indexOf(block.id)
        // Divider: Backspace removes it (focus moves to previous block end).
        if (block.type === 'divider') {
          e.preventDefault()
          if (i > 0) deleteBlock(block)
          return
        }
        if (offset === 0) {
          if (i === 0) return // first block, nothing before — let browser no-op
          e.preventDefault()
          if (text.length === 0) deleteBlock(block)
          else mergeIntoPrevious(block, text)
        }
      }
    },
    [
      slash,
      slashOptions,
      applySlashOption,
      closeSlash,
      convertToParagraph,
      insertParagraphAfter,
      mergeIntoPrevious,
      deleteBlock,
      indexOf,
      selectSingle,
    ],
  )

  // Container-level key handling, active while blocks are selected (editables
  // are blurred, so keystrokes land here).
  const handleContainerKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (!selecting) return

      if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault()
        deleteSelected()
        return
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        clearSelection()
        return
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault()
        selectionAnchor.current = blocks[0]?.id ?? null
        setSelectedIds(new Set(blocks.map((b) => b.id)))
        return
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        const dir = e.key === 'ArrowDown' ? 1 : -1
        if (e.shiftKey) {
          extendSelection(dir)
          return
        }
        // Plain arrow: collapse to the edge block and resume editing it.
        const indices = [...selectedIds].map(indexOf).sort((x, y) => x - y)
        const edge = dir === 1 ? indices[indices.length - 1] : indices[0]
        const target = blocks[Math.max(0, Math.min(blocks.length - 1, edge))]
        if (target) editBlock(target.id, dir === 1 ? -1 : 0)
        return
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        const last = [...selectedIds].map(indexOf).sort((x, y) => x - y).pop()
        const target = last != null ? blocks[last] : undefined
        if (target && target.type !== 'divider') editBlock(target.id, -1)
        return
      }
    },
    [
      selecting,
      selectedIds,
      blocks,
      indexOf,
      deleteSelected,
      clearSelection,
      extendSelection,
      editBlock,
    ],
  )

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      onKeyDown={handleContainerKeyDown}
      className={cn('relative outline-none', selecting && 'select-none', className)}
    >
      {blocks.map((block) => (
        <Block
          key={block.id}
          block={block}
          selected={selectedIds.has(block.id)}
          registerRef={registerRef(block.id)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          onBlur={handleBlur}
          onToggleCheck={handleToggleCheck}
          onSelectMouseDown={handleSelectMouseDown}
        />
      ))}

      {slash && (
        <SlashMenu
          anchorRef={anchorRef}
          options={slashOptions}
          activeIndex={slash.activeIndex}
          onSelect={(option) => applySlashOption(slash, option)}
          onHover={(index) =>
            setSlash((s) => (s ? { ...s, activeIndex: index } : s))
          }
        />
      )}
    </div>
  )
}
