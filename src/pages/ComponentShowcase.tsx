import { useRef, useState } from 'react'
import { Outlet } from 'react-router-dom'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable'
import { ImperativePanelHandle } from 'react-resizable-panels'
import DemoNavigation from '@/components/DemoShowcase/DemoNavigation'
import { Button } from '@/components/ui/button'
import { PanelLeftClose, PanelLeft } from 'lucide-react'

export default function ComponentShowcase() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const panelRef = useRef<ImperativePanelHandle>(null)

  const toggleCollapse = () => {
    const panel = panelRef.current
    if (panel) {
      if (isCollapsed) {
        panel.expand()
      } else {
        panel.collapse()
      }
    }
  }

  return (
    <div className="h-screen w-full bg-white dark:bg-zinc-950">
      <ResizablePanelGroup direction="horizontal">
        {/* Left Panel - Collapsible Navigation */}
        <ResizablePanel
          ref={panelRef}
          defaultSize={20}
          minSize={15}
          maxSize={30}
          collapsible
          collapsedSize={0}
          onCollapse={() => setIsCollapsed(true)}
          onExpand={() => setIsCollapsed(false)}
        >
          <div className="h-full border-r border-border overflow-auto">
            <div className="p-4">
              <div className="mb-6">
                <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-1">
                  Components
                </h1>
                <p className="text-xs text-muted-foreground">
                  Browse demos and examples
                </p>
              </div>
              <DemoNavigation />
            </div>
          </div>
        </ResizablePanel>

        {/* Resize Handle */}
        <ResizableHandle withHandle />

        {/* Right Panel - Content */}
        <ResizablePanel defaultSize={80}>
          <div className="h-full flex flex-col overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-zinc-50/50 dark:bg-zinc-900/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleCollapse}
                className="h-8 w-8 p-0"
              >
                {isCollapsed ? (
                  <PanelLeft size={16} />
                ) : (
                  <PanelLeftClose size={16} />
                )}
              </Button>
              <span className="text-xs text-muted-foreground">
                {isCollapsed ? 'Show navigation' : 'Hide navigation'}
              </span>
            </div>
            {/* Content */}
            <div className="flex-1 overflow-auto">
              <div className="p-8">
                <Outlet />
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
