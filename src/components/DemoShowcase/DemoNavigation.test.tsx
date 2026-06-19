import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router'
import { render, screen } from '@testing-library/react'
import DemoNavigation from './DemoNavigation'
import { DEMO_REGISTRY } from './demoRegistry'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <DemoNavigation />
    </MemoryRouter>
  )
}

describe('DemoNavigation', () => {
  it('renders a link for every demo in the registry', () => {
    renderAt('/components/useTypewriter')

    for (const demo of DEMO_REGISTRY) {
      const link = screen.getByRole('link', { name: demo.label })
      expect(link).toHaveAttribute('href', demo.path)
    }
  })

  it('groups demos under Hooks and Components headings', () => {
    renderAt('/components/useTypewriter')

    expect(screen.getByRole('heading', { name: /hooks/i })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /components/i })
    ).toBeInTheDocument()
  })

  it('marks the link matching the current location as active', () => {
    renderAt('/components/usePosition')

    const activeLink = screen.getByRole('link', { name: 'usePosition' })
    const inactiveLink = screen.getByRole('link', { name: 'useTypewriter' })

    // The active link gets a distinct highlighted background; others do not.
    expect(activeLink.className).toContain('bg-zinc-100')
    expect(inactiveLink.className).not.toContain('bg-zinc-100')
  })

  it('moves the active styling when the location changes', () => {
    renderAt('/components/useToast')

    const activeLink = screen.getByRole('link', { name: 'useToast' })
    const otherLink = screen.getByRole('link', { name: 'usePosition' })

    expect(activeLink.className).toContain('bg-zinc-100')
    expect(otherLink.className).not.toContain('bg-zinc-100')
  })
})
