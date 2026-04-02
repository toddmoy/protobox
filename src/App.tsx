import './App.css'
import Welcome from './components/Welcome'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import ComponentShowcase from './pages/ComponentShowcase'
import { lazy, Suspense } from 'react'

// Lazy load demo content components
const TypewriterContent = lazy(() => import('./components/DemoShowcase/TypewriterContent'))
const PositionContent = lazy(() => import('./components/DemoShowcase/PositionContent'))
const LevaContent = lazy(() => import('./components/DemoShowcase/LevaContent'))
const ToastContent = lazy(() => import('./components/DemoShowcase/ToastContent'))
const PromptBoxContent = lazy(() => import('./components/DemoShowcase/PromptBoxContent'))

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
          <Route
            path="useToast"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <ToastContent />
              </Suspense>
            }
          />
          <Route
            path="prompt-box"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <PromptBoxContent />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
