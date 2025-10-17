import { useRef, useState } from 'react'
import usePosition from '@/hooks/usePosition'

type Position = 'top' | 'bottom' | 'left' | 'right'
type Alignment = 'start' | 'center' | 'end'

const PositionTest = () => {
  const targetRef = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState<Position>('bottom')
  const [alignment, setAlignment] = useState<Alignment>('start')
  const [offset, setOffset] = useState(8)

  const { ref, style } = usePosition(targetRef, {
    position,
    alignment,
    offset,
  })

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">usePosition Hook Test</h1>

        {/* Controls */}
        <div className="bg-card border rounded-lg p-6 mb-8 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Position</label>
            <div className="flex gap-2">
              {(['top', 'bottom', 'left', 'right'] as Position[]).map((pos) => (
                <button
                  key={pos}
                  onClick={() => setPosition(pos)}
                  className={`px-4 py-2 rounded border ${
                    position === pos
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background hover:bg-accent'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Alignment</label>
            <div className="flex gap-2">
              {(['start', 'center', 'end'] as Alignment[]).map((align) => (
                <button
                  key={align}
                  onClick={() => setAlignment(align)}
                  className={`px-4 py-2 rounded border ${
                    alignment === align
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background hover:bg-accent'
                  }`}
                >
                  {align}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Offset: {offset}px
            </label>
            <input
              type="range"
              min="0"
              max="32"
              value={offset}
              onChange={(e) => setOffset(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Test Area */}
        <div className="bg-muted/50 rounded-lg p-12 min-h-[500px] flex items-center justify-center relative">
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground mb-6">
              Click the button below and observe the positioned tooltip
            </p>

            <button
              ref={targetRef}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg transition-colors"
            >
              Target Element
            </button>

            {/* Positioned Element */}
            <div
              ref={ref}
              style={style}
              className="w-48 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black px-4 py-3 rounded-lg shadow-xl z-10"
            >
              <div className="text-sm font-medium mb-1">Positioned Tooltip</div>
              <div className="text-xs opacity-80">
                Position: {position}<br />
                Alignment: {alignment}<br />
                Offset: {offset}px
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h2 className="font-semibold mb-2">Test Instructions:</h2>
          <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
            <li>Try different position options (top, bottom, left, right)</li>
            <li>Test alignment options (start, center, end)</li>
            <li>Adjust the offset slider to see spacing changes</li>
            <li>Scroll the page to verify the tooltip follows the target</li>
            <li>Resize the browser window to test responsiveness</li>
          </ul>
        </div>

        {/* Multiple Positions Test */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">All Positions Preview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {(['top', 'bottom', 'left', 'right'] as Position[]).map((pos) => (
              <PositionExample key={pos} position={pos} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Component to test each position independently
const PositionExample = ({ position }: { position: Position }) => {
  const targetRef = useRef<HTMLDivElement>(null)
  const { ref, style } = usePosition(targetRef, {
    position,
    alignment: 'center',
    offset: 8,
  })

  return (
    <div className="relative flex items-center justify-center h-32 bg-muted rounded-lg">
      <div
        ref={targetRef}
        className="w-12 h-12 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold"
      >
        Target
      </div>
      <div
        ref={ref}
        style={style}
        className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black px-2 py-1 rounded text-xs font-medium whitespace-nowrap"
      >
        {position}
      </div>
    </div>
  )
}

export default PositionTest
