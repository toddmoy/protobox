import { describe, it, expect } from 'vitest'
import { cn, truncate } from './utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('px-2', 'py-2')).toBe('px-2 py-2')
  })

  it('dedupes conflicting tailwind classes, last wins', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('applies conditional classes', () => {
    const hidden = false
    expect(cn('base', hidden && 'hidden', 'shown')).toBe('base shown')
  })
})

describe('truncate', () => {
  it('returns the string unchanged when under the limit', () => {
    expect(truncate('hello', 10)).toBe('hello')
  })

  it('truncates and appends the default suffix', () => {
    expect(truncate('hello world', 8)).toBe('hello...')
  })
})
