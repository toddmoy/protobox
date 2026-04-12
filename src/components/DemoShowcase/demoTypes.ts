import { ComponentType } from 'react'

export interface Demo {
  id: string
  label: string
  section: 'Hooks' | 'Components'
  component: ComponentType
  description?: string
  path: string
  type?: 'showcase' | 'standalone' | 'playground'
}
