import { useLayoutEffect, useState, useRef, useCallback, RefObject, CSSProperties } from 'react'

/**
 * Position options for the positioned element relative to the target
 */
type Position = 'top' | 'bottom' | 'left' | 'right'

/**
 * Alignment options for the positioned element
 */
type Alignment = 'start' | 'center' | 'end'

/**
 * Configuration options for usePosition hook
 */
interface UsePositionOptions {
  /**
   * Where to position the element relative to the target
   * @default 'bottom'
   */
  position?: Position
  /**
   * How to align the element along the perpendicular axis
   * @default 'start'
   */
  alignment?: Alignment
  /**
   * Offset in pixels from the target element
   * @default 0
   */
  offset?: number
}

/**
 * Return value from usePosition hook
 */
interface UsePositionReturn {
  /**
   * Ref to attach to the positioned element
   */
  ref: RefObject<HTMLElement>
  /**
   * Style object containing position coordinates
   */
  style: CSSProperties
}

/**
 * Custom hook for positioning an element relative to a target element.
 * Automatically updates position on window resize and scroll.
 *
 * @example
 * ```tsx
 * const targetRef = useRef<HTMLButtonElement>(null)
 * const { ref, style } = usePosition(targetRef, {
 *   position: 'bottom',
 *   alignment: 'center',
 *   offset: 8
 * })
 *
 * return (
 *   <>
 *     <button ref={targetRef}>Target</button>
 *     <div ref={ref} style={style}>Positioned content</div>
 *   </>
 * )
 * ```
 */
function usePosition(
  targetRef: RefObject<HTMLElement>,
  options: UsePositionOptions = {}
): UsePositionReturn {
  const { position = 'bottom', alignment = 'start', offset = 0 } = options

  const [style, setStyle] = useState<CSSProperties>({
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 9999,
  })

  const positionedElementRef = useRef<HTMLElement>(null)

  const updatePosition = useCallback(() => {
    if (!targetRef.current || !positionedElementRef.current) return

    const targetRect = targetRef.current.getBoundingClientRect()
    const elementRect = positionedElementRef.current.getBoundingClientRect()

    let top = 0
    let left = 0

    // Calculate position based on position prop
    // Using fixed positioning, so coordinates are relative to viewport
    switch (position) {
      case 'top':
        top = targetRect.top - elementRect.height - offset
        break
      case 'bottom':
        top = targetRect.bottom + offset
        break
      case 'left':
        left = targetRect.left - elementRect.width - offset
        break
      case 'right':
        left = targetRect.right + offset
        break
    }

    // Calculate alignment based on alignment prop
    switch (alignment) {
      case 'center':
        if (position === 'top' || position === 'bottom') {
          left = targetRect.left + (targetRect.width - elementRect.width) / 2
        } else {
          top = targetRect.top + (targetRect.height - elementRect.height) / 2
        }
        break
      case 'end':
        if (position === 'top' || position === 'bottom') {
          left = targetRect.right - elementRect.width
        } else {
          top = targetRect.bottom - elementRect.height
        }
        break
      case 'start':
      default:
        if (position === 'top' || position === 'bottom') {
          left = targetRect.left
        } else {
          top = targetRect.top
        }
        break
    }

    setStyle({
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      zIndex: 9999,
    })
  }, [targetRef, position, alignment, offset])

  useLayoutEffect(() => {
    updatePosition()

    // Use passive listeners for better scroll performance
    const options: AddEventListenerOptions = { passive: true }

    window.addEventListener('resize', updatePosition, options)
    window.addEventListener('scroll', updatePosition, options)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition)
    }
  }, [updatePosition])

  return { ref: positionedElementRef, style }
}

export default usePosition
