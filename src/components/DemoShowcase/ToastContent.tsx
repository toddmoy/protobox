import { useToast, toast } from '@/hooks/useToast'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Toaster } from '@/components/ui/toaster'
import { ToastAction } from '@/components/ui/toast'
import { Bell, AlertTriangle, Check, Info, X } from 'lucide-react'

export default function ToastContent() {
  const { dismiss } = useToast()

  // Basic toast
  const showBasicToast = () => {
    toast({
      title: 'Hello!',
      description: 'This is a basic toast notification.',
    })
  }

  // Toast with title only
  const showTitleOnlyToast = () => {
    toast({
      title: 'Settings saved successfully',
    })
  }

  // Toast with description only
  const showDescriptionOnlyToast = () => {
    toast({
      description: 'Your changes have been applied.',
    })
  }

  // Destructive toast
  const showDestructiveToast = () => {
    toast({
      variant: 'destructive',
      title: 'Error',
      description: 'Something went wrong. Please try again.',
    })
  }

  // Toast with action
  const showActionToast = () => {
    toast({
      title: 'Event scheduled',
      description: 'Friday, February 10, 2024 at 5:57 PM',
      action: (
        <ToastAction altText="Undo" onClick={() => console.log('Undo clicked')}>
          Undo
        </ToastAction>
      ),
    })
  }

  // Toast with custom dismiss
  const showDismissibleToast = () => {
    const { id, dismiss: dismissThis } = toast({
      title: 'Custom dismiss',
      description: 'This toast can be dismissed programmatically.',
      action: (
        <ToastAction altText="Dismiss" onClick={() => dismissThis()}>
          Dismiss
        </ToastAction>
      ),
    })
    console.log('Toast ID:', id)
  }

  // Dismiss all toasts
  const dismissAllToasts = () => {
    dismiss()
  }

  return (
    <div className="space-y-8">
      {/* Toaster component - required for toasts to display */}
      <Toaster />

      {/* Example 1: Basic Toast */}
      <Card className="p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Basic</Badge>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            title + description
          </span>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          A simple toast with a title and description.
        </p>
        <Button onClick={showBasicToast} size="sm">
          <Bell className="w-4 h-4 mr-2" />
          Show Toast
        </Button>
      </Card>

      {/* Example 2: Title Only */}
      <Card className="p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Title Only</Badge>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            minimal notification
          </span>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          A compact toast with just a title.
        </p>
        <Button onClick={showTitleOnlyToast} size="sm" variant="outline">
          <Check className="w-4 h-4 mr-2" />
          Show Title Toast
        </Button>
      </Card>

      {/* Example 3: Description Only */}
      <Card className="p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Description Only</Badge>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            subtle message
          </span>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          A toast with just a description, no title.
        </p>
        <Button onClick={showDescriptionOnlyToast} size="sm" variant="outline">
          <Info className="w-4 h-4 mr-2" />
          Show Description Toast
        </Button>
      </Card>

      {/* Example 4: Destructive */}
      <Card className="p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Destructive</Badge>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            variant: destructive
          </span>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          An error toast with destructive styling for alerts and warnings.
        </p>
        <Button onClick={showDestructiveToast} size="sm" variant="destructive">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Show Error Toast
        </Button>
      </Card>

      {/* Example 5: With Action */}
      <Card className="p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">With Action</Badge>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            action button
          </span>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          A toast with an action button for user interaction.
        </p>
        <Button onClick={showActionToast} size="sm" variant="outline">
          Show Action Toast
        </Button>
      </Card>

      {/* Example 6: Programmatic Dismiss */}
      <Card className="p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Programmatic Control</Badge>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            dismiss(), update()
          </span>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Control toasts programmatically with dismiss and update functions.
        </p>
        <div className="flex gap-2">
          <Button onClick={showDismissibleToast} size="sm" variant="outline">
            Show Dismissible Toast
          </Button>
          <Button onClick={dismissAllToasts} size="sm" variant="ghost">
            <X className="w-4 h-4 mr-2" />
            Dismiss All
          </Button>
        </div>
      </Card>

      {/* Code Example */}
      <Card className="p-6 space-y-3 bg-zinc-50 dark:bg-zinc-900">
        <Badge variant="outline">Usage Example</Badge>
        <pre className="text-xs text-zinc-700 dark:text-zinc-300 overflow-x-auto">
          <code>{`import { useToast, toast } from '@/hooks/useToast'
import { Toaster } from '@/components/ui/toaster'
import { ToastAction } from '@/components/ui/toast'

function MyComponent() {
  const { dismiss } = useToast()

  // Simple toast
  const showToast = () => {
    toast({
      title: 'Success!',
      description: 'Your action was completed.',
    })
  }

  // Destructive toast
  const showError = () => {
    toast({
      variant: 'destructive',
      title: 'Error',
      description: 'Something went wrong.',
    })
  }

  // Toast with action
  const showWithAction = () => {
    const { id, dismiss: dismissThis } = toast({
      title: 'Event created',
      description: 'Your event has been scheduled.',
      action: (
        <ToastAction altText="Undo" onClick={() => dismissThis()}>
          Undo
        </ToastAction>
      ),
    })
  }

  return (
    <>
      <Toaster /> {/* Required - renders toast notifications */}
      <button onClick={showToast}>Show Toast</button>
      <button onClick={() => dismiss()}>Dismiss All</button>
    </>
  )
}`}</code>
        </pre>
      </Card>

      {/* API Reference */}
      <Card className="p-6 space-y-3 bg-zinc-50 dark:bg-zinc-900">
        <Badge variant="outline">API Reference</Badge>
        <div className="space-y-4 text-sm text-zinc-700 dark:text-zinc-300">
          <div>
            <h4 className="font-semibold mb-1">toast(options)</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">
              Creates a new toast notification. Returns {`{ id, dismiss, update }`}.
            </p>
            <pre className="text-xs bg-zinc-100 dark:bg-zinc-800 p-2 rounded overflow-x-auto">
              <code>{`toast({
  title?: string | ReactNode,
  description?: string | ReactNode,
  variant?: 'default' | 'destructive',
  action?: ToastActionElement,
})`}</code>
            </pre>
          </div>
          <div>
            <h4 className="font-semibold mb-1">useToast()</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">
              Hook to access toast state and controls.
            </p>
            <pre className="text-xs bg-zinc-100 dark:bg-zinc-800 p-2 rounded overflow-x-auto">
              <code>{`const { toasts, toast, dismiss } = useToast()

// toasts: array of active toasts
// toast: function to create a toast
// dismiss: function to dismiss toast(s)`}</code>
            </pre>
          </div>
        </div>
      </Card>
    </div>
  )
}
