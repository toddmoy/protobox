import { ReactNode, useMemo } from 'react'
import { useControls, folder } from 'leva'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable'
import { cn } from '@/lib/utils'

export type PropType = 'string' | 'number' | 'boolean' | 'select' | 'color'

export interface PropConfig {
  type: PropType
  label?: string
  defaultValue?: unknown
  options?: string[] | Record<string, string>
  min?: number
  max?: number
  step?: number
}

export interface PropSchema {
  [propName: string]: PropConfig
}

interface PlaygroundCanvasProps {
  componentName: string
  children: (props: Record<string, unknown>) => ReactNode
  propSchema: PropSchema
  defaultProps?: Record<string, unknown>
  canvasClassName?: string
}

function buildLevaSchema(
  schema: PropSchema,
  defaults: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  for (const [key, config] of Object.entries(schema)) {
    const defaultValue = defaults[key] ?? config.defaultValue

    switch (config.type) {
      case 'string':
        result[config.label ?? key] = {
          value: defaultValue ?? '',
        }
        break
      case 'number':
        result[config.label ?? key] = {
          value: defaultValue ?? 0,
          min: config.min,
          max: config.max,
          step: config.step ?? 1,
        }
        break
      case 'boolean':
        result[config.label ?? key] = {
          value: defaultValue ?? false,
        }
        break
      case 'select':
        result[config.label ?? key] = {
          value: defaultValue,
          options: config.options,
        }
        break
      case 'color':
        result[config.label ?? key] = {
          value: defaultValue ?? '#000000',
        }
        break
    }
  }

  return result
}

function mapLevaValuesToProps(
  levaValues: Record<string, unknown>,
  schema: PropSchema
): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  for (const [propName, config] of Object.entries(schema)) {
    const levaKey = config.label ?? propName
    result[propName] = levaValues[levaKey]
  }

  return result
}

export default function PlaygroundCanvas({
  componentName,
  children,
  propSchema,
  defaultProps = {},
  canvasClassName,
}: PlaygroundCanvasProps) {
  const levaSchema = useMemo(
    () => buildLevaSchema(propSchema, defaultProps),
    [propSchema, defaultProps]
  )

  const levaValues = useControls(componentName, levaSchema)
  const controlledProps = mapLevaValuesToProps(levaValues, propSchema)

  return (
    <div className="h-full -m-8">
      <ResizablePanelGroup direction="horizontal">
        {/* Canvas Area - Component centered */}
        <ResizablePanel defaultSize={100}>
          <div
            className={cn(
              'h-full flex items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-900/50',
              'bg-[radial-gradient(circle,_rgba(0,0,0,0.05)_1px,_transparent_1px)] dark:bg-[radial-gradient(circle,_rgba(255,255,255,0.05)_1px,_transparent_1px)]',
              'bg-[size:16px_16px]',
              canvasClassName
            )}
          >
            <div className="relative">{children(controlledProps)}</div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export function PlaygroundCanvasWithPanel({
  componentName,
  children,
  propSchema,
  defaultProps = {},
  canvasClassName,
}: PlaygroundCanvasProps) {
  const levaSchema = useMemo(
    () => buildLevaSchema(propSchema, defaultProps),
    [propSchema, defaultProps]
  )

  const levaValues = useControls(componentName, levaSchema)
  const controlledProps = mapLevaValuesToProps(levaValues, propSchema)

  return (
    <div className="h-full -m-8">
      <ResizablePanelGroup direction="horizontal">
        {/* Canvas Area - Component centered */}
        <ResizablePanel defaultSize={75}>
          <div
            className={cn(
              'h-full flex items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-900/50',
              'bg-[radial-gradient(circle,_rgba(0,0,0,0.05)_1px,_transparent_1px)] dark:bg-[radial-gradient(circle,_rgba(255,255,255,0.05)_1px,_transparent_1px)]',
              'bg-[size:16px_16px]',
              canvasClassName
            )}
          >
            <div className="relative">{children(controlledProps)}</div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Props Info Panel */}
        <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
          <div className="h-full border-l border-border bg-white dark:bg-zinc-950 overflow-auto">
            <div className="p-4">
              <h3 className="text-sm font-semibold mb-4 text-zinc-900 dark:text-zinc-50">
                Current Props
              </h3>
              <div className="space-y-2 text-xs font-mono">
                {Object.entries(controlledProps).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between items-start gap-2 py-1 border-b border-zinc-100 dark:border-zinc-800"
                  >
                    <span className="text-zinc-500 dark:text-zinc-400">
                      {key}:
                    </span>
                    <span className="text-zinc-900 dark:text-zinc-100 text-right break-all">
                      {typeof value === 'boolean'
                        ? value.toString()
                        : typeof value === 'string'
                          ? `"${value}"`
                          : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
