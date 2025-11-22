import { useState, useEffect, useRef } from 'react'

/**
 * Configuration options for useTypewriter hook
 */
interface UseTypewriterOptions {
  /**
   * Speed of typing in milliseconds per character
   * @default 50
   */
  speed?: number
  /**
   * Delay in milliseconds before typing starts
   * @default 0
   */
  delay?: number
  /**
   * Whether to loop the animation (restart after completion)
   * @default false
   */
  loop?: boolean
  /**
   * Delay in milliseconds before restarting loop
   * @default 1000
   */
  loopDelay?: number
  /**
   * Whether to show a blinking cursor
   * @default false
   */
  cursor?: boolean
  /**
   * Custom cursor character
   * @default '|'
   */
  cursorChar?: string
  /**
   * Callback function when typing completes
   */
  onComplete?: () => void
  /**
   * Whether to start typing automatically
   * @default true
   */
  autoStart?: boolean
}

/**
 * Return value from useTypewriter hook
 */
interface UseTypewriterReturn {
  /**
   * The current typed text to display
   */
  text: string
  /**
   * Whether the typing animation is currently running
   */
  isTyping: boolean
  /**
   * Whether the typing animation has completed
   */
  isComplete: boolean
  /**
   * Start or restart the typing animation
   */
  start: () => void
  /**
   * Pause the typing animation
   */
  pause: () => void
  /**
   * Reset the typing animation to the beginning
   */
  reset: () => void
}

/**
 * Custom hook for creating a typewriter effect.
 * Types out text character by character with configurable speed and behavior.
 *
 * @example
 * ```tsx
 * const { text } = useTypewriter('Hello, World!', {
 *   speed: 100,
 *   delay: 500,
 *   cursor: true
 * })
 *
 * return <p>{text}</p>
 * ```
 *
 * @example
 * ```tsx
 * const { text, isComplete, start } = useTypewriter('Type on demand', {
 *   autoStart: false,
 *   onComplete: () => console.log('Done!')
 * })
 *
 * return (
 *   <>
 *     <p>{text}</p>
 *     <button onClick={start}>Start Typing</button>
 *   </>
 * )
 * ```
 */
function useTypewriter(
  fullText: string,
  options: UseTypewriterOptions = {}
): UseTypewriterReturn {
  const {
    speed = 50,
    delay = 0,
    loop = false,
    loopDelay = 1000,
    cursor = false,
    cursorChar = '|',
    onComplete,
    autoStart = true,
  } = options

  const [text, setText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [isPaused, setIsPaused] = useState(!autoStart)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const cursorIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [showCursor, setShowCursor] = useState(true)

  // Cursor blinking effect
  useEffect(() => {
    if (cursor) {
      cursorIntervalRef.current = setInterval(() => {
        setShowCursor((prev) => !prev)
      }, 530) // Standard cursor blink rate

      return () => {
        if (cursorIntervalRef.current) {
          clearInterval(cursorIntervalRef.current)
        }
      }
    }
  }, [cursor])

  // Main typing effect
  useEffect(() => {
    if (isPaused || !fullText) return

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Initial delay before typing starts
    if (currentIndex === 0 && delay > 0) {
      timeoutRef.current = setTimeout(() => {
        setIsTyping(true)
        setCurrentIndex(1)
      }, delay)
      return
    }

    // Typing in progress
    if (currentIndex < fullText.length) {
      setIsTyping(true)
      timeoutRef.current = setTimeout(() => {
        setText(fullText.slice(0, currentIndex + 1))
        setCurrentIndex((prev) => prev + 1)
      }, speed)
    }
    // Typing complete
    else if (currentIndex === fullText.length && isTyping) {
      setIsTyping(false)
      setIsComplete(true)
      onComplete?.()

      // Handle loop
      if (loop) {
        timeoutRef.current = setTimeout(() => {
          setCurrentIndex(0)
          setText('')
          setIsComplete(false)
        }, loopDelay)
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [currentIndex, fullText, speed, delay, loop, loopDelay, onComplete, isTyping, isPaused])

  // Reset when fullText changes
  useEffect(() => {
    setCurrentIndex(0)
    setText('')
    setIsComplete(false)
    setIsPaused(!autoStart)
  }, [fullText, autoStart])

  const start = () => {
    if (isComplete) {
      // Restart from beginning
      setCurrentIndex(0)
      setText('')
      setIsComplete(false)
    }
    setIsPaused(false)
  }

  const pause = () => {
    setIsPaused(true)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const reset = () => {
    setCurrentIndex(0)
    setText('')
    setIsComplete(false)
    setIsTyping(false)
    setIsPaused(!autoStart)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  // Add cursor to displayed text if enabled
  const displayText = cursor && !isComplete ? text + (showCursor ? cursorChar : ' ') : text

  return {
    text: displayText,
    isTyping,
    isComplete,
    start,
    pause,
    reset,
  }
}

export default useTypewriter
