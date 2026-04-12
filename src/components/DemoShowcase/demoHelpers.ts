import type { Demo } from './demoTypes'
import { DEMO_REGISTRY } from './demoRegistry'

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
