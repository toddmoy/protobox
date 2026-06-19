import { describe, it, expect, vi, afterEach } from 'vitest'
import { useRef } from 'react'
import { act, render, renderHook } from '@testing-library/react'
import usePosition from './usePosition'

type Position = 'top' | 'bottom' | 'left' | 'right'
type Alignment = 'start' | 'center' | 'end'

interface HarnessOptions {
  position?: Position
  alignment?: Alignment
  offset?: number
}

function Harness({ options }: { options?: HarnessOptions }) {
  const targetRef = useRef<HTMLDivElement>(null)
  const { ref, style } = usePosition<HTMLDivElement>(targetRef, options)
  return (
    <>
      <div data-testid="target" ref={targetRef} />
      <div data-testid="content" ref={ref} style={style} />
    </>
  )
}

function mockRect(el: HTMLElement, rect: Partial<DOMRect>) {
  const full: DOMRect = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    toJSON: () => ({}),
    ...rect,
  }
  el.getBoundingClientRect = vi.fn(() => full)
}

// Target occupies (left 200, top 100, right 250, bottom 120) -> 50x20
const TARGET_RECT: Partial<DOMRect> = {
  top: 100,
  left: 200,
  right: 250,
  bottom: 120,
  width: 50,
  height: 20,
}
// Positioned content is 80x30
const CONTENT_RECT: Partial<DOMRect> = {
  top: 0,
  left: 0,
  right: 80,
  bottom: 30,
  width: 80,
  height: 30,
}

function setup(options?: HarnessOptions) {
  const utils = render(<Harness options={options} />)
  const target = utils.getByTestId('target')
  const content = utils.getByTestId('content')
  mockRect(target, TARGET_RECT)
  mockRect(content, CONTENT_RECT)
  act(() => {
    window.dispatchEvent(new Event('resize'))
  })
  return { ...utils, target, content }
}

describe('usePosition', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns a default fixed style when refs are unset', () => {
    const { result } = renderHook(() => usePosition({ current: null }))
    expect(result.current.style).toMatchObject({
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999,
    })
  })

  it('positions below the target by default (bottom / start)', () => {
    const { content } = setup()
    expect(content.style.top).toBe('120px')
    expect(content.style.left).toBe('200px')
    expect(content.style.position).toBe('fixed')
  })

  it('positions above the target for position "top"', () => {
    const { content } = setup({ position: 'top' })
    expect(content.style.top).toBe('70px')
    expect(content.style.left).toBe('200px')
  })

  it('positions to the left for position "left"', () => {
    const { content } = setup({ position: 'left' })
    expect(content.style.left).toBe('120px')
    expect(content.style.top).toBe('100px')
  })

  it('positions to the right for position "right"', () => {
    const { content } = setup({ position: 'right' })
    expect(content.style.left).toBe('250px')
    expect(content.style.top).toBe('100px')
  })

  it('centers along the horizontal axis for bottom + center', () => {
    const { content } = setup({ position: 'bottom', alignment: 'center' })
    expect(content.style.left).toBe('185px')
    expect(content.style.top).toBe('120px')
  })

  it('aligns to the end for bottom + end', () => {
    const { content } = setup({ position: 'bottom', alignment: 'end' })
    expect(content.style.left).toBe('170px')
  })

  it('applies the offset away from the target', () => {
    const { content } = setup({ position: 'bottom', offset: 8 })
    expect(content.style.top).toBe('128px')
  })

  it('recomputes position on scroll', () => {
    const { content, target } = setup()
    mockRect(target, { ...TARGET_RECT, top: 300, bottom: 320 })
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })
    expect(content.style.top).toBe('320px')
  })

  it('removes window listeners on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const { unmount } = render(<Harness />)
    unmount()
    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function))
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
  })
})
