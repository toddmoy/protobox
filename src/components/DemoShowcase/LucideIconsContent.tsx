import { useMemo, useState } from 'react'
import { icons, Search, X, Check, SearchX } from 'lucide-react'
import { play } from 'cuelume'
import type { LucideProps } from 'lucide-react'

type IconComponent = React.FC<LucideProps>

const ALL_ICONS = Object.entries(icons) as [string, IconComponent][]

function toKebab(name: string) {
  return name.replace(/([A-Z])/g, (m, i) => (i > 0 ? '-' : '') + m.toLowerCase())
}

export default function LucideIconsContent() {
  const [query, setQuery] = useState('')
  const [size, setSize] = useState(28)
  const [copied, setCopied] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return ALL_ICONS
    return ALL_ICONS.filter(([name]) => name.toLowerCase().includes(q))
  }, [query])

  const copy = (name: string) => {
    navigator.clipboard.writeText(name)
    play('success')
    setCopied(name)
    setTimeout(() => setCopied(null), 1200)
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search icons…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-md border border-zinc-200 bg-white py-1.5 pl-8 pr-3 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              <X size={12} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-zinc-400">Size</span>
          <input
            type="range"
            min={12}
            max={40}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-20 accent-zinc-700"
          />
          <span className="w-6 text-right text-xs tabular-nums text-zinc-500">{size}</span>
        </div>

      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-400 gap-2">
          <SearchX size={32} strokeWidth={1.5} />
          <p className="text-sm">No icons match "{query}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-1">
          {filtered.map(([name, Icon]) => (
            <div key={name} className="group relative">
              <button
                onClick={() => copy(name)}
                className={`flex aspect-square w-full items-center justify-center rounded-lg transition-colors ${
                  copied === name
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                }`}
              >
                {copied === name ? (
                  <Check size={size} strokeWidth={1.5} />
                ) : (
                  <Icon size={size} strokeWidth={1.5} />
                )}
              </button>
              <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded bg-zinc-900 px-2 py-1 text-[11px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                {toKebab(name)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
