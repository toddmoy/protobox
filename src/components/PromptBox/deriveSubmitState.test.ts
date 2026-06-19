import { describe, it, expect } from 'vitest'
import { deriveSubmitState } from './deriveSubmitState'
import type { PromptBoxState } from './context'

describe('deriveSubmitState', () => {
  it('returns "stop" when submitting, regardless of content', () => {
    expect(deriveSubmitState('submitting', true)).toBe('stop')
    expect(deriveSubmitState('submitting', false)).toBe('stop')
  })

  it('returns "ready" when there is content and not submitting', () => {
    expect(deriveSubmitState('idle', true)).toBe('ready')
    expect(deriveSubmitState('composing', true)).toBe('ready')
  })

  it('returns "disabled" when there is no content and not submitting', () => {
    expect(deriveSubmitState('idle', false)).toBe('disabled')
    expect(deriveSubmitState('composing', false)).toBe('disabled')
  })

  it('prioritizes the submitting state over content', () => {
    const states: PromptBoxState[] = ['idle', 'composing', 'submitting']
    for (const state of states) {
      const result = deriveSubmitState(state, true)
      if (state === 'submitting') {
        expect(result).toBe('stop')
      } else {
        expect(result).toBe('ready')
      }
    }
  })
})
