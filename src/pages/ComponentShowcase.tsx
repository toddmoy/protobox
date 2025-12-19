import { Outlet } from 'react-router-dom'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable'
import DemoNavigation from '@/components/DemoShowcase/DemoNavigation'

export default function ComponentShowcase() {
  return (
    <div className="h-screen w-full bg-white dark:bg-zinc-950">
      <ResizablePanelGroup direction="horizontal">
        {/* Left Panel - Navigation */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
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
          <div className="h-full overflow-auto">
            <div className="p-8">
              <Outlet />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
