import { ComponentType, lazy } from 'react'

// Lazy load content components
const TypewriterContent = lazy(() => import('./TypewriterContent'))
const PositionContent = lazy(() => import('./PositionContent'))
const LevaContent = lazy(() => import('./LevaContent'))

export interface Demo {
  id: string
  label: string
  section: 'Hooks' | 'Components'
  component: ComponentType<any>
  description?: string
  path: string
  type?: 'showcase' | 'standalone' | 'playground'
}

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
    id: 'leva-demo',
    label: 'Leva Demo',
    section: 'Components',
    component: LevaContent,
    description: 'Interactive GUI controls for prototyping',
    path: '/components/leva-demo',
  },
]

export const getDemoById = (id: string): Demo | undefined => {
  return DEMO_REGISTRY.find((demo) => demo.id === id)
}

export const getFirstDemo = (): Demo => {
  return DEMO_REGISTRY[0]
}

export const getDemosBySection = (section: 'Hooks' | 'Components'): Demo[] => {
  return DEMO_REGISTRY.filter((demo) => demo.section === section)
}

export const getDemosByType = (type: Demo['type']): Demo[] => {
  return DEMO_REGISTRY.filter((demo) => demo.type === type)
}

export const getPlaygroundDemos = (): Demo[] => {
  return DEMO_REGISTRY.filter((demo) => demo.type === 'playground')
}
