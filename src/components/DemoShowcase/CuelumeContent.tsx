import { useEffect, useRef, useState } from "react"
import { play, bind, sounds } from "cuelume"
import type { SoundName } from "cuelume"

const SOUND_GROUPS: { label: string; cues: SoundName[]; description: string }[] = [
  {
    label: "Tonal",
    description: "Pitched sounds with warmth and space",
    cues: ["chime", "sparkle", "droplet", "bloom", "whisper"],
  },
  {
    label: "Tactile",
    description: "Physical feedback sounds",
    cues: ["tick", "press", "release", "toggle"],
  },
  {
    label: "State",
    description: "Signals for system transitions",
    cues: ["success", "error", "page", "loading", "ready"],
  },
]

const SOUND_DESCRIPTIONS: Record<SoundName, string> = {
  chime: "Soft two-note ascending bell",
  sparkle: "Quick ascending twinkle of four notes",
  droplet: "Single note gliding downward",
  bloom: "Warm slow-swelling pad",
  whisper: "Breathy textureless swell",
  tick: "Crisp focused click",
  press: "Dull muted knock — key down",
  release: "Brighter springy tick — key up",
  toggle: "Mechanical switch click-clack",
  success: "Warm three-note confirmation",
  error: "Calm recoverable refusal",
  page: "Papery flick with glass tick",
  loading: "Brief unresolved lift",
  ready: "Focus tick into harmonic bloom",
}

function SoundButton({ name, onPlay }: { name: SoundName; onPlay: (name: SoundName) => void }) {
  const [active, setActive] = useState(false)

  const handleClick = () => {
    onPlay(name)
    setActive(true)
    setTimeout(() => setActive(false), 300)
  }

  return (
    <button
      onClick={handleClick}
      className={`group flex flex-col gap-1 rounded-lg border px-3 py-2.5 text-left transition-all ${
        active
          ? "border-zinc-400 bg-zinc-100 shadow-sm"
          : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
      }`}
    >
      <span className="text-sm font-medium text-zinc-800">{name}</span>
      <span className="text-xs text-zinc-400">{SOUND_DESCRIPTIONS[name]}</span>
    </button>
  )
}

function InteractionDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [bound, setBound] = useState(false)

  useEffect(() => {
    bind()
    setBound(true)
  }, [])

  return (
    <div ref={containerRef} className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <button
          data-cuelume-press
          data-cuelume-release
          className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 active:bg-zinc-100"
        >
          Press + Release
        </button>

        <button
          data-cuelume-hover="tick"
          className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50"
        >
          Hover (tick)
        </button>

        <button
          data-cuelume-hover="chime"
          className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50"
        >
          Hover (chime)
        </button>

        <Toggle />

        <button
          data-cuelume-press="loading"
          className="rounded-md border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm transition-colors hover:bg-blue-100"
        >
          Load
        </button>

        <button
          data-cuelume-press="success"
          className="rounded-md border border-green-300 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 shadow-sm transition-colors hover:bg-green-100"
        >
          Success
        </button>

        <button
          data-cuelume-press="error"
          className="rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 shadow-sm transition-colors hover:bg-red-100"
        >
          Error
        </button>
      </div>

      {bound && (
        <p className="text-xs text-zinc-400">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400 mr-1.5 translate-y-px" />
          bind() active — data-cuelume-* attributes are wired up
        </p>
      )}
    </div>
  )
}

function Toggle() {
  const [on, setOn] = useState(false)
  return (
    <button
      data-cuelume-toggle
      onClick={() => setOn((v) => !v)}
      className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium shadow-sm transition-colors ${
        on
          ? "border-zinc-800 bg-zinc-800 text-white"
          : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${on ? "bg-white" : "bg-zinc-400"}`} />
      Toggle {on ? "On" : "Off"}
    </button>
  )
}

export default function CuelumeContent() {
  const [lastPlayed, setLastPlayed] = useState<SoundName | null>(null)

  const handlePlay = (name: SoundName) => {
    play(name)
    setLastPlayed(name)
  }

  return (
    <div className="space-y-8">
      {/* Sound Palette */}
      <div>
        <div
          className="rounded-t-xl border border-gray-200 p-6"
          style={{
            backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        >
          <div className="space-y-6">
            {SOUND_GROUPS.map((group) => (
              <div key={group.label}>
                <div className="mb-3 flex items-baseline gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    {group.label}
                  </span>
                  <span className="text-xs text-zinc-400">{group.description}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {group.cues.map((cue) => (
                    <SoundButton key={cue} name={cue} onPlay={handlePlay} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-b-xl border border-t-0 border-gray-200 bg-zinc-50 px-4 py-3">
          <span className="text-xs text-zinc-400">
            {sounds.length} synthesized cues · no audio files · Web Audio API
          </span>
          {lastPlayed && (
            <span className="text-xs text-zinc-500">
              Last played: <code className="font-mono">{lastPlayed}</code>
            </span>
          )}
        </div>
      </div>

      {/* Declarative Usage */}
      <div>
        <h3 className="mb-1 text-sm font-semibold text-zinc-700">Declarative (data attributes)</h3>
        <p className="mb-3 text-xs text-zinc-500">
          Call <code className="font-mono">bind()</code> once, then add attributes to any element.
        </p>
        <div
          className="rounded-t-xl border border-gray-200 p-6"
          style={{
            backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        >
          <InteractionDemo />
        </div>
        <div className="rounded-b-xl border border-t-0 border-gray-200 bg-zinc-50 px-4 py-3">
          <code className="text-xs text-zinc-500">
            data-cuelume-press · data-cuelume-release · data-cuelume-hover · data-cuelume-toggle
          </code>
        </div>
      </div>
    </div>
  )
}
