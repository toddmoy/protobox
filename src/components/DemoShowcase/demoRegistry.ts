import { lazy } from 'react'
import type { Demo } from './demoTypes'

// Lazy load content components
const TypewriterContent = lazy(() => import('./TypewriterContent'))
const PositionContent = lazy(() => import('./PositionContent'))
const ToastContent = lazy(() => import('./ToastContent'))
const PromptBoxContent = lazy(() => import('./PromptBoxContent'))
const CuelumeContent = lazy(() => import('./CuelumeContent'))
const LucideIconsContent = lazy(() => import('./LucideIconsContent'))

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
    id: 'prompt-box',
    label: 'PromptBox',
    section: 'Components',
    component: PromptBoxContent,
    description: 'LLM chat input with state machine, pills, and submit button',
    path: '/components/prompt-box',
  },
  {
    id: 'lucide-icons',
    label: 'Lucide Icons',
    section: 'Components',
    component: LucideIconsContent,
    description: 'Browse and copy all lucide-react icons',
    path: '/components/lucide-icons',
  },
  {
    id: 'cuelume',
    label: 'Cuelume',
    section: 'Components',
    component: CuelumeContent,
    description: 'Synthesized interaction sounds via Web Audio API',
    path: '/components/cuelume',
  },
]
