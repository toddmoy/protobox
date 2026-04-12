import { lazy } from 'react'
import type { Demo } from './demoTypes'

// Lazy load content components
const TypewriterContent = lazy(() => import('./TypewriterContent'))
const PositionContent = lazy(() => import('./PositionContent'))
const LevaContent = lazy(() => import('./LevaContent'))
const ToastContent = lazy(() => import('./ToastContent'))
const PromptBoxContent = lazy(() => import('./PromptBoxContent'))

export const DEMO_REGISTRY: Demo[] = [
  {
    id: 'useTypewriter',
    label: 'useTypewriter',
    section: 'Hooks',
    component: TypewriterContent,
    description: 'Typewriter text animation effect',
    path: '/components/useTypewriter',
  },
  {
    id: 'usePosition',
    label: 'usePosition',
    section: 'Hooks',
    component: PositionContent,
    description: 'Position elements relative to targets',
    path: '/components/usePosition',
  },
  {
    id: 'useToast',
    label: 'useToast',
    section: 'Hooks',
    component: ToastContent,
    description: 'Toast notification system',
    path: '/components/useToast',
  },
  {
    id: 'leva-demo',
    label: 'Leva Demo',
    section: 'Components',
    component: LevaContent,
    description: 'Interactive GUI controls for prototyping',
    path: '/components/leva-demo',
  },
  {
    id: 'prompt-box',
    label: 'PromptBox',
    section: 'Components',
    component: PromptBoxContent,
    description: 'LLM chat input with state machine, pills, and submit button',
    path: '/components/prompt-box',
  },
]
