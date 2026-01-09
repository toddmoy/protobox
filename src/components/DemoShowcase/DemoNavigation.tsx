import { Link, useLocation } from 'react-router-dom'
import { DEMO_REGISTRY, Demo } from './demoRegistry'
import { cn } from '@/lib/utils'
import { Play } from 'lucide-react'
import { ReactNode } from 'react'

function NavLink({ demo, icon }: { demo: Demo; icon?: ReactNode }) {
  const location = useLocation()
  const isActive = location.pathname === demo.path

  return (
    <Link
      to={demo.path}
      className={cn(
        'flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors',
        isActive
          ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50'
          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-50'
      )}
    >
      {icon}
      {demo.label}
    </Link>
  )
}

export default function DemoNavigation() {
  // Group demos by section, excluding playgrounds from regular sections
  const hooksDemos = DEMO_REGISTRY.filter(
    (demo) => demo.section === 'Hooks' && demo.type !== 'playground'
  )
  const componentsDemos = DEMO_REGISTRY.filter(
    (demo) => demo.section === 'Components' && demo.type !== 'playground'
  )
  const playgroundDemos = DEMO_REGISTRY.filter(
    (demo) => demo.type === 'playground'
  )

  return (
    <div className="space-y-6">
      {/* Hooks Section */}
      {hooksDemos.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2 px-3">
            Hooks
          </h3>
          <nav className="space-y-1">
            {hooksDemos.map((demo) => (
              <NavLink key={demo.id} demo={demo} />
            ))}
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
            {componentsDemos.map((demo) => (
              <NavLink key={demo.id} demo={demo} />
            ))}
          </nav>
        </div>
      )}

      {/* Playgrounds Section */}
      {playgroundDemos.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2 px-3">
            Playgrounds
          </h3>
          <nav className="space-y-1">
            {playgroundDemos.map((demo) => (
              <NavLink
                key={demo.id}
                demo={demo}
                icon={<Play size={12} className="shrink-0" />}
              />
            ))}
          </nav>
        </div>
      )}
    </div>
  )
}
