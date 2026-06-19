import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useToast, toast } from './useToast'

// The toast store is a module-level singleton, so each test resets it by
// dismissing all toasts and advancing past the removal delay.
function resetToasts() {
  const { result, unmount } = renderHook(() => useToast())
  act(() => {
    result.current.dismiss()
  })
  act(() => {
    vi.advanceTimersByTime(2_000_000)
  })
  unmount()
}

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    resetToasts()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts with no toasts', () => {
    const { result } = renderHook(() => useToast())
    expect(result.current.toasts).toHaveLength(0)
  })

  it('adds a toast', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.toast({ title: 'Saved', description: 'Done' })
    })

    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0].title).toBe('Saved')
    expect(result.current.toasts[0].description).toBe('Done')
    expect(result.current.toasts[0].open).toBe(true)
  })

  it('enforces the toast limit of one, keeping the newest', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.toast({ title: 'First' })
    })
    act(() => {
      result.current.toast({ title: 'Second' })
    })

    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0].title).toBe('Second')
  })

  it('updates an existing toast', () => {
    const { result } = renderHook(() => useToast())

    let handle: ReturnType<typeof toast> | undefined
    act(() => {
      handle = result.current.toast({ title: 'Before' })
    })

    act(() => {
      handle?.update({ id: handle.id, title: 'After' })
    })

    expect(result.current.toasts[0].title).toBe('After')
  })

  it('dismisses a toast via its handle (sets open to false)', () => {
    const { result } = renderHook(() => useToast())

    let handle: ReturnType<typeof toast> | undefined
    act(() => {
      handle = result.current.toast({ title: 'Closing' })
    })
    expect(result.current.toasts[0].open).toBe(true)

    act(() => {
      handle?.dismiss()
    })
    expect(result.current.toasts[0].open).toBe(false)
  })

  it('dismisses all toasts via the hook dismiss()', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.toast({ title: 'Open' })
    })

    act(() => {
      result.current.dismiss()
    })
    expect(result.current.toasts[0].open).toBe(false)
  })

  it('removes the toast after the removal delay', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.toast({ title: 'Temp' })
    })
    act(() => {
      result.current.dismiss()
    })
    expect(result.current.toasts).toHaveLength(1)

    act(() => {
      vi.advanceTimersByTime(1_000_000)
    })
    expect(result.current.toasts).toHaveLength(0)
  })

  it('returns a handle with id, dismiss, and update from the standalone toast()', () => {
    let handle: ReturnType<typeof toast> | undefined
    act(() => {
      handle = toast({ title: 'Standalone' })
    })

    expect(handle).toBeDefined()
    expect(typeof handle?.id).toBe('string')
    expect(typeof handle?.dismiss).toBe('function')
    expect(typeof handle?.update).toBe('function')
  })
})
