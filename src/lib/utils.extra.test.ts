import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { formatDate, debounce, copyToClipboard, sleep } from './utils'

describe('formatDate', () => {
  it('formats as an ISO string', () => {
    expect(formatDate(0, 'iso')).toBe('1970-01-01T00:00:00.000Z')
  })

  it('accepts Date, number, and string inputs for iso', () => {
    const expected = '2023-06-15T12:00:00.000Z'
    expect(formatDate(new Date(expected), 'iso')).toBe(expected)
    expect(formatDate(Date.parse(expected), 'iso')).toBe(expected)
    expect(formatDate(expected, 'iso')).toBe(expected)
  })

  it('defaults to the short format', () => {
    const date = new Date('2023-06-15T12:00:00Z')
    expect(formatDate(date)).toBe(date.toLocaleDateString())
  })

  it('returns a non-empty time string', () => {
    const result = formatDate(new Date('2023-06-15T12:00:00Z'), 'time')
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('includes the year in the long format', () => {
    const result = formatDate(new Date('2023-06-15T12:00:00Z'), 'long')
    expect(result).toContain('2023')
  })

  describe('relative format', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2023-06-15T12:00:00Z'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('returns "just now" for times under a minute', () => {
      const date = new Date('2023-06-15T11:59:30Z')
      expect(formatDate(date, 'relative')).toBe('just now')
    })

    it('returns minutes ago', () => {
      const date = new Date('2023-06-15T11:55:00Z')
      expect(formatDate(date, 'relative')).toBe('5m ago')
    })

    it('returns hours ago', () => {
      const date = new Date('2023-06-15T09:00:00Z')
      expect(formatDate(date, 'relative')).toBe('3h ago')
    })

    it('returns days ago', () => {
      const date = new Date('2023-06-13T12:00:00Z')
      expect(formatDate(date, 'relative')).toBe('2d ago')
    })

    it('falls back to a date string for more than a week ago', () => {
      const date = new Date('2023-06-05T12:00:00Z')
      expect(formatDate(date, 'relative')).toContain('2023')
    })
  })
})

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('delays invocation until after the wait elapses', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced()
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(99)
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('only invokes once for rapid successive calls, with the latest args', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced('a')
    debounced('b')
    debounced('c')

    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('c')
  })

  it('resets the timer on each call', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced()
    vi.advanceTimersByTime(60)
    debounced()
    vi.advanceTimersByTime(60)
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(40)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('can invoke again after the first debounced call fires', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 50)

    debounced()
    vi.advanceTimersByTime(50)
    expect(fn).toHaveBeenCalledTimes(1)

    debounced()
    vi.advanceTimersByTime(50)
    expect(fn).toHaveBeenCalledTimes(2)
  })
})

describe('sleep', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('resolves only after the given delay', async () => {
    const onResolve = vi.fn()
    sleep(100).then(onResolve)

    expect(onResolve).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(99)
    expect(onResolve).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1)
    expect(onResolve).toHaveBeenCalledTimes(1)
  })

  it('resolves with undefined', async () => {
    const promise = sleep(10)
    await vi.advanceTimersByTimeAsync(10)
    await expect(promise).resolves.toBeUndefined()
  })
})

describe('copyToClipboard', () => {
  let originalClipboard: PropertyDescriptor | undefined
  let originalExecCommand: typeof document.execCommand

  beforeEach(() => {
    originalClipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard')
    originalExecCommand = document.execCommand
  })

  afterEach(() => {
    if (originalClipboard) {
      Object.defineProperty(navigator, 'clipboard', originalClipboard)
    } else {
      Reflect.deleteProperty(navigator as unknown as Record<string, unknown>, 'clipboard')
    }
    document.execCommand = originalExecCommand
    vi.restoreAllMocks()
  })

  function setClipboard(writeText: (text: string) => Promise<void>) {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
      writable: true,
    })
  }

  it('uses the async clipboard API on success', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    setClipboard(writeText)

    await expect(copyToClipboard('hello')).resolves.toBe(true)
    expect(writeText).toHaveBeenCalledWith('hello')
  })

  it('falls back to execCommand when the clipboard API rejects', async () => {
    setClipboard(vi.fn().mockRejectedValue(new Error('denied')))
    const execCommand = vi.fn().mockReturnValue(true)
    document.execCommand = execCommand as unknown as typeof document.execCommand

    await expect(copyToClipboard('world')).resolves.toBe(true)
    expect(execCommand).toHaveBeenCalledWith('copy')
  })

  it('returns false when the fallback also fails', async () => {
    setClipboard(vi.fn().mockRejectedValue(new Error('denied')))
    document.execCommand = vi.fn(() => {
      throw new Error('no execCommand')
    }) as unknown as typeof document.execCommand

    await expect(copyToClipboard('nope')).resolves.toBe(false)
  })

  it('cleans up the temporary textarea in the fallback path', async () => {
    setClipboard(vi.fn().mockRejectedValue(new Error('denied')))
    document.execCommand = vi.fn().mockReturnValue(true) as unknown as typeof document.execCommand

    await copyToClipboard('cleanup')
    expect(document.querySelector('textarea')).toBeNull()
  })
})
