import './App.css'
import Welcome from './components/Welcome'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import NewPage from './pages/newPage'
import PositionTest from './pages/PositionTest'
import TypewriterDemo from './pages/TypewriterDemo'
import LevaDemo from './pages/LevaDemo'
import ComponentShowcase from './pages/ComponentShowcase'
import { lazy, Suspense } from 'react'

// Lazy load demo content components
const TypewriterContent = lazy(() => import('./components/DemoShowcase/TypewriterContent'))
const PositionContent = lazy(() => import('./components/DemoShowcase/PositionContent'))
const LevaContent = lazy(() => import('./components/DemoShowcase/LevaContent'))

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Welcome} />

        {/* Component Showcase with nested routes */}
        <Route path="/components" element={<ComponentShowcase />}>
          <Route index element={<Navigate to="/components/useTypewriter" replace />} />
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
          <Route
            path="leva-demo"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <LevaContent />
              </Suspense>
            }
          />
        </Route>

        {/* Original standalone demo pages */}
        <Route path="/new-page" Component={NewPage} />
        <Route path="/position-test" Component={PositionTest} />
        <Route path="/typewriter-demo" Component={TypewriterDemo} />
        <Route path="/leva-demo" Component={LevaDemo} />
      </Routes>
    </BrowserRouter>
  )
}
