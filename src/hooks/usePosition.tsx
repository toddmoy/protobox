import { useLayoutEffect, useState, useRef, RefObject } from 'react'

function usePosition(
  targetRef: RefObject<HTMLElement>,
  { position = 'bottom', alignment = 'start' }
) {
  const [style, setStyle] = useState({})
  const positionedElementRef = useRef(null)

  useLayoutEffect(() => {
    function updatePosition() {
      if (!targetRef.current || !positionedElementRef.current) return

      const targetRect = targetRef.current.getBoundingClientRect()
      //@ts-ignore - quit whining
      const elementRect = positionedElementRef.current.getBoundingClientRect()

      let top = 0
      let left = 0

      // Calculate position based on `position` prop
      switch (position) {
        case 'top':
          top = targetRect.top - elementRect.height
          break
        case 'bottom':
          top = targetRect.bottom
          break
        case 'left':
          left = targetRect.left - elementRect.width
          break
        case 'right':
          left = targetRect.right
          break
        default:
          break
      }

      console.log('top: ' + top)

      // Calculate alignment based on `alignment` prop
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
        default:
          if (position === 'top' || position === 'bottom') {
            left = targetRect.left
          } else {
            top = targetRect.top
          }
          break
      }

      setStyle({
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,
      })
    }

    updatePosition()

    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition)
    }
  }, [targetRef, position, alignment])

  return { ref: positionedElementRef, style }
}

export default usePosition
