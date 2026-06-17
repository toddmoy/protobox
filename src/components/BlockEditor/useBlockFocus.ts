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

interface CaretPos {
  node: Node
  offset: number
}

/**
 * Resolve the document caret position under a screen point, across browsers.
 * Returns null if the point doesn't resolve to a text position.
 */
function caretPositionAtPoint(x: number, y: number): CaretPos | null {
  // Standard API (Firefox + recent Chromium/Safari).
  const doc = document as Document & {
    caretPositionFromPoint?: (
      x: number,
      y: number,
    ) => { offsetNode: Node; offset: number } | null
  }
  if (doc.caretPositionFromPoint) {
    const pos = doc.caretPositionFromPoint(x, y)
    if (pos) return { node: pos.offsetNode, offset: pos.offset }
  }
  // Legacy WebKit/Blink fallback.
  const legacy = document as Document & {
    caretRangeFromPoint?: (x: number, y: number) => Range | null
  }
  if (legacy.caretRangeFromPoint) {
    const range = legacy.caretRangeFromPoint(x, y)
    if (range) return { node: range.startContainer, offset: range.startOffset }
  }
  return null
}

/**
 * Focus `el` and place the caret at horizontal position `x`, on the element's
 * first visual line (`edge: 'top'`) or last visual line (`edge: 'bottom'`).
 * Used for vertical arrow navigation between blocks so the caret keeps roughly
 * its column. Falls back to start/end if hit-testing fails.
 */
export function setCaretAtPoint(el: HTMLElement, x: number, edge: 'top' | 'bottom') {
  el.focus()
  const selection = window.getSelection()
  if (!selection) return

  const rect = el.getBoundingClientRect()
  // Probe just inside the top or bottom edge, clamping x into the element.
  const probeY = edge === 'top' ? rect.top + 4 : rect.bottom - 4
  const probeX = Math.max(rect.left + 1, Math.min(x, rect.right - 1))

  const pos = caretPositionAtPoint(probeX, probeY)
  const range = document.createRange()
  if (pos && el.contains(pos.node)) {
    range.setStart(pos.node, pos.offset)
  } else {
    // Hit-test missed (e.g. empty block) — land at the natural edge.
    const textNode = el.firstChild
    if (textNode && textNode.nodeType === Node.TEXT_NODE) {
      range.setStart(textNode, edge === 'top' ? 0 : textNode.textContent?.length ?? 0)
    } else {
      range.setStart(el, 0)
    }
  }
  range.collapse(true)
  selection.removeAllRanges()
  selection.addRange(range)
}

/**
 * Geometry of the current caret relative to its containing element: its screen
 * x, and whether it sits on the element's first / last visual line (handles
 * wrapped lines). Returns null when there is no collapsed caret inside `el`.
 */
export function caretLineInfo(
  el: HTMLElement,
): { x: number; atFirstLine: boolean; atLastLine: boolean } | null {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return null
  const range = selection.getRangeAt(0)
  if (!el.contains(range.startContainer)) return null

  let caretRect = range.getBoundingClientRect()
  // A collapsed range in an empty/edge position can report a zero rect; fall
  // back to the element's own box so navigation still triggers.
  if (caretRect.height === 0 && caretRect.width === 0) {
    caretRect = el.getBoundingClientRect()
  }
  const elRect = el.getBoundingClientRect()
  const lineTolerance = Math.max(4, caretRect.height * 0.5)

  return {
    x: caretRect.left,
    atFirstLine: caretRect.top - elRect.top <= lineTolerance,
    atLastLine: elRect.bottom - caretRect.bottom <= lineTolerance,
  }
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
