import { useCallback, useLayoutEffect, useRef } from 'react'

/**
 * A request to place the caret inside a specific block after the next render.
 * `offset` is a character offset into the block's text; -1 means "end".
 */
export interface FocusIntent {
  blockId: string
  offset: number
}

/**
 * Place the caret at a character offset within a contentEditable element.
 * Walks the element's first text node; offset -1 (or out of range) lands at
 * the end. Falls back to selecting the element itself when it has no text node
 * (e.g. an empty block that hasn't been typed into yet).
 */
export function setCaret(el: HTMLElement, offset: number) {
  el.focus()
  const selection = window.getSelection()
  if (!selection) return

  const range = document.createRange()
  const textNode = el.firstChild

  if (textNode && textNode.nodeType === Node.TEXT_NODE) {
    const len = textNode.textContent?.length ?? 0
    const pos = offset < 0 || offset > len ? len : offset
    range.setStart(textNode, pos)
  } else {
    // No text node yet — collapse into the (empty) element.
    range.setStart(el, 0)
  }
  range.collapse(true)
  selection.removeAllRanges()
  selection.addRange(range)
}

/**
 * Manages per-block DOM refs and deferred caret placement across re-renders.
 *
 * Register each block's editable element with `registerRef(id)`. After a
 * structural mutation (split/merge/delete), call `requestFocus({ blockId,
 * offset })`; a layout effect focuses that block and sets the caret once React
 * has committed the new block list.
 */
export function useBlockFocus() {
  const refs = useRef(new Map<string, HTMLElement | null>())
  const pendingFocus = useRef<FocusIntent | null>(null)

  const registerRef = useCallback(
    (id: string) => (el: HTMLElement | null) => {
      if (el) refs.current.set(id, el)
      else refs.current.delete(id)
    },
    [],
  )

  const requestFocus = useCallback((intent: FocusIntent) => {
    pendingFocus.current = intent
  }, [])

  const getRef = useCallback((id: string) => refs.current.get(id) ?? null, [])

  useLayoutEffect(() => {
    const intent = pendingFocus.current
    if (!intent) return
    const el = refs.current.get(intent.blockId)
    if (el) {
      setCaret(el, intent.offset)
      pendingFocus.current = null
    }
  })

  return { registerRef, requestFocus, getRef }
}
