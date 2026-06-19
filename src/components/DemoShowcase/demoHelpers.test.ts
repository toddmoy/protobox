import { describe, it, expect } from 'vitest'
import {
  getDemoById,
  getFirstDemo,
  getDemosBySection,
  getDemosByType,
  getPlaygroundDemos,
} from './demoHelpers'
import { DEMO_REGISTRY } from './demoRegistry'

describe('getDemoById', () => {
  it('returns the matching demo for a known id', () => {
    const demo = getDemoById('useTypewriter')
    expect(demo).toBeDefined()
    expect(demo?.id).toBe('useTypewriter')
    expect(demo?.label).toBe('useTypewriter')
  })

  it('returns undefined for an unknown id', () => {
    expect(getDemoById('does-not-exist')).toBeUndefined()
  })

  it('returns undefined for an empty id', () => {
    expect(getDemoById('')).toBeUndefined()
  })
})

describe('getFirstDemo', () => {
  it('returns the first demo in the registry', () => {
    expect(getFirstDemo()).toBe(DEMO_REGISTRY[0])
  })
})

describe('getDemosBySection', () => {
  it('returns only demos in the Hooks section', () => {
    const hooks = getDemosBySection('Hooks')
    expect(hooks.length).toBeGreaterThan(0)
    expect(hooks.every((demo) => demo.section === 'Hooks')).toBe(true)
  })

  it('returns only demos in the Components section', () => {
    const components = getDemosBySection('Components')
    expect(components.length).toBeGreaterThan(0)
    expect(components.every((demo) => demo.section === 'Components')).toBe(true)
  })

  it('partitions the registry across both sections', () => {
    const hooks = getDemosBySection('Hooks')
    const components = getDemosBySection('Components')
    expect(hooks.length + components.length).toBe(DEMO_REGISTRY.length)
  })
})

describe('getDemosByType', () => {
  it('matches the registry entries for a given type', () => {
    const expected = DEMO_REGISTRY.filter((demo) => demo.type === 'playground')
    expect(getDemosByType('playground')).toEqual(expected)
  })

  it('returns an empty array for a type that no demo uses', () => {
    const showcase = getDemosByType('showcase')
    expect(showcase.every((demo) => demo.type === 'showcase')).toBe(true)
  })
})

describe('getPlaygroundDemos', () => {
  it('matches getDemosByType("playground")', () => {
    expect(getPlaygroundDemos()).toEqual(getDemosByType('playground'))
  })

  it('only contains playground demos', () => {
    expect(getPlaygroundDemos().every((demo) => demo.type === 'playground')).toBe(true)
  })
})
