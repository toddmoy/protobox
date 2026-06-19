import { describe, it, expect, beforeAll } from 'vitest'
import { lazy, Suspense } from 'react'
import { MemoryRouter, Navigate, Route, Routes } from 'react-router'
import { render, screen, waitFor } from '@testing-library/react'
import Welcome from './components/Welcome'
import ComponentShowcase from './pages/ComponentShowcase'

// react-resizable-panels (used by ComponentShowcase) relies on ResizeObserver,
// which jsdom does not implement. Provide a no-op stub so the layout can mount.
beforeAll(() => {
  if (!('ResizeObserver' in globalThis)) {
    class ResizeObserverStub {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    globalThis.ResizeObserver =
      ResizeObserverStub as unknown as typeof ResizeObserver
  }
})

// Lazy content components, mirroring src/App.tsx.
const TypewriterContent = lazy(
  () => import('./components/DemoShowcase/TypewriterContent')
)
const PositionContent = lazy(
  () => import('./components/DemoShowcase/PositionContent')
)

// Reproduce the <Routes> tree from src/App.tsx so it can be mounted under a
// MemoryRouter (App ships its own BrowserRouter, which cannot be nested).
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" Component={Welcome} />
      <Route path="/components" element={<ComponentShowcase />}>
        <Route
          index
          element={<Navigate to="/components/useTypewriter" replace />}
        />
        <Route
          path="useTypewriter"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <TypewriterContent />
            </Suspense>
          }
        />
        <Route
          path="usePosition"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <PositionContent />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  )
}

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>
  )
}

describe('App routing', () => {
  it('renders the Welcome page at "/"', () => {
    renderAt('/')

    expect(screen.getByText('Protobox')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /view component showcase/i })
    ).toHaveAttribute('href', '/components')
  })

  it('redirects "/components" to the default demo and renders the showcase layout', async () => {
    renderAt('/components')

    // The showcase layout (with its <Outlet>) is rendered.
    expect(screen.getByText('Browse demos and examples')).toBeInTheDocument()
    expect(screen.getByText('Hide navigation')).toBeInTheDocument()

    // The index <Navigate> redirect lands on useTypewriter, whose lazy content
    // appears once the chunk resolves.
    expect(
      await screen.findByText('Usage Example')
    ).toBeInTheDocument()
  })

  it('renders lazy content for a nested /components/<demo> route', async () => {
    renderAt('/components/useTypewriter')

    // Stable, user-visible labels from TypewriterContent's lazy chunk.
    expect(await screen.findByText('Usage Example')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText('Manual Control')).toBeInTheDocument()
    })
  })
})
