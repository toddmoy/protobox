import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import useTypewriter from './useTypewriter'

describe('useTypewriter', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  // Each typed character is scheduled by an effect that runs after the
  // previous timer fires, so advance one `speed` step at a time.
  function step(times: number, speed: number) {
    for (let i = 0; i < times; i++) {
      act(() => {
        vi.advanceTimersByTime(speed)
      })
    }
  }

  it('starts with empty text', () => {
    const { result } = renderHook(() => useTypewriter('Hello', { speed: 50 }))
    expect(result.current.text).toBe('')
    expect(result.current.isComplete).toBe(false)
  })

  it('types out the full text over time and completes', () => {
    const onComplete = vi.fn()
    const { result } = renderHook(() =>
      useTypewriter('Hi', { speed: 50, onComplete }),
    )

    act(() => {
      vi.advanceTimersByTime(50)
    })
    expect(result.current.text).toBe('H')
    expect(result.current.isTyping).toBe(true)

    act(() => {
      vi.advanceTimersByTime(50)
    })
    expect(result.current.text).toBe('Hi')
    expect(result.current.isComplete).toBe(true)
    expect(result.current.isTyping).toBe(false)
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('does not type until the initial delay has elapsed', () => {
    const { result } = renderHook(() =>
      useTypewriter('AB', { speed: 50, delay: 200 }),
    )

    act(() => {
      vi.advanceTimersByTime(150)
    })
    expect(result.current.text).toBe('')
    expect(result.current.isComplete).toBe(false)

    // Fire the delay timer (reaches 200ms), then type the characters.
    act(() => {
      vi.advanceTimersByTime(50)
    })
    step(2, 50)
    expect(result.current.text).toBe('AB')
    expect(result.current.isComplete).toBe(true)
  })

  it('does not auto-start when autoStart is false', () => {
    const { result } = renderHook(() =>
      useTypewriter('Later', { speed: 50, autoStart: false }),
    )

    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(result.current.text).toBe('')

    act(() => {
      result.current.start()
    })
    step(5, 50)
    expect(result.current.text).toBe('Later')
    expect(result.current.isComplete).toBe(true)
  })

  it('pause() halts further typing', () => {
    const { result } = renderHook(() => useTypewriter('abcde', { speed: 50 }))

    act(() => {
      vi.advanceTimersByTime(50)
    })
    expect(result.current.text).toBe('a')

    act(() => {
      result.current.pause()
    })
    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(result.current.text).toBe('a')
    expect(result.current.isComplete).toBe(false)
  })

  it('reset() clears typed text back to empty', () => {
    const { result } = renderHook(() => useTypewriter('xy', { speed: 50 }))

    step(2, 50)
    expect(result.current.text).toBe('xy')

    act(() => {
      result.current.reset()
    })
    expect(result.current.text).toBe('')
    expect(result.current.isComplete).toBe(false)
  })

  it('appends a cursor character when cursor is enabled', () => {
    const { result } = renderHook(() =>
      useTypewriter('z', { speed: 50, cursor: true }),
    )
    expect(result.current.text).toBe('|')
  })

  it('supports a custom cursor character', () => {
    const { result } = renderHook(() =>
      useTypewriter('z', { speed: 50, cursor: true, cursorChar: '_' }),
    )
    expect(result.current.text).toBe('_')
  })

  it('resets when the input text changes', () => {
    const { result, rerender } = renderHook(
      ({ text }) => useTypewriter(text, { speed: 50 }),
      { initialProps: { text: 'one' } },
    )

    step(3, 50)
    expect(result.current.text).toBe('one')

    rerender({ text: 'two' })
    expect(result.current.text).toBe('')
    expect(result.current.isComplete).toBe(false)
  })
})
