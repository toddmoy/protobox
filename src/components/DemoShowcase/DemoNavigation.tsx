import { Link, useLocation } from 'react-router-dom'
import { DEMO_REGISTRY } from './demoRegistry'
import { cn } from '@/lib/utils'

export default function DemoNavigation() {
  const location = useLocation()

  // Group demos by section
  const hooksDemos = DEMO_REGISTRY.filter((demo) => demo.section === 'Hooks')
  const componentsDemos = DEMO_REGISTRY.filter((demo) => demo.section === 'Components')

  return (
    <div className="space-y-6">
      {/* Hooks Section */}
      {hooksDemos.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2 px-3">
            Hooks
          </h3>
          <nav className="space-y-1">
            {hooksDemos.map((demo) => {
              const isActive = location.pathname === demo.path
              return (
                <Link
                  key={demo.id}
                  to={demo.path}
                  className={cn(
                    'block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-50'
                  )}
                >
                  {demo.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}

      {/* Components Section */}
      {componentsDemos.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2 px-3">
            Components
          </h3>
          <nav className="space-y-1">
            {componentsDemos.map((demo) => {
              const isActive = location.pathname === demo.path
              return (
                <Link
                  key={demo.id}
                  to={demo.path}
                  className={cn(
                    'block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-50'
                  )}
                >
                  {demo.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </div>
  )
}
