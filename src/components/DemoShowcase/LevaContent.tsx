import { useControls, button, folder, buttonGroup } from 'leva'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function LevaContent() {
  const [message, setMessage] = useState('')
  const [clickCount, setClickCount] = useState(0)

  // Basic Controls
  const basicControls = useControls('Basic Controls', {
    name: 'Protobox',
    count: { value: 42, min: 0, max: 100, step: 1 },
    enabled: true,
    opacity: { value: 0.8, min: 0, max: 1, step: 0.01 },
  })

  // Color Controls
  const colorControls = useControls('Colors', {
    background: '#4c9aff',
    textColor: { value: '#ffffff', label: 'Text Color' },
    accentColor: { value: 'rgb(255, 100, 150)' },
  })

  // Vector Controls
  const vectorControls = useControls('Vectors & Positions', {
    position2D: { value: { x: 0, y: 0 }, step: 1 },
    position3D: { value: { x: 0, y: 0, z: 0 }, step: 1 },
    scale: { value: { x: 1, y: 1 }, min: 0.1, max: 3, step: 0.1 },
  })

  // String & Selection Controls
  const selectionControls = useControls('Selection & Text', {
    description: {
      value: 'This is a long text input',
      rows: 3,
    },
    size: {
      value: 'medium',
      options: ['small', 'medium', 'large', 'extra-large'],
    },
    theme: {
      value: 'dark',
      options: {
        Light: 'light',
        Dark: 'dark',
        Auto: 'auto',
      },
    },
  })

  // Interval & Range
  const intervalControls = useControls('Intervals & Ranges', {
    range: { value: [20, 80], min: 0, max: 100 },
    temperature: { value: 72, min: 32, max: 100, suffix: '°F' },
  })

  // Button Actions
  const buttonControls = useControls('Actions', {
    'Click Me': button(() => {
      setClickCount((prev) => prev + 1)
      setMessage(`Button clicked ${clickCount + 1} times!`)
    }),
    'Reset Count': button(() => {
      setClickCount(0)
      setMessage('Counter reset!')
    }),
    'Action Group': buttonGroup({
      Save: () => setMessage('Saved!'),
      Load: () => setMessage('Loaded!'),
      Delete: () => setMessage('Deleted!'),
    }),
  })

  // Nested Folders
  const nestedControls = useControls('Advanced Settings', {
    Animation: folder({
      duration: { value: 1000, min: 100, max: 5000, step: 100, suffix: 'ms' },
      easing: {
        value: 'easeOut',
        options: ['linear', 'easeIn', 'easeOut', 'easeInOut'],
      },
      loop: false,
    }),
    Performance: folder(
      {
        fps: { value: 60, min: 24, max: 120, step: 1 },
        quality: {
          value: 'high',
          options: ['low', 'medium', 'high', 'ultra'],
        },
        vsync: true,
      },
      { collapsed: true }
    ),
  })

  // Transient Controls (for real-time updates without re-renders for every change)
  const { smoothValue } = useControls('Transient (Smooth)', {
    smoothValue: {
      value: 50,
      min: 0,
      max: 100,
    },
  })

  // Monitor controls (read-only display)
  const monitorControls = useControls('Monitor', {
    'Frame Count': {
      value: clickCount,
      disabled: true,
    },
    'Current Time': {
      value: new Date().toLocaleTimeString(),
      disabled: true,
    },
  })

  return (
    <div className="space-y-8">
      {/* Demo Output Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Visual Output */}
        <motion.div
          className="rounded-lg p-8 shadow-lg relative overflow-hidden"
          style={{
            backgroundColor: colorControls.background,
            opacity: basicControls.opacity,
          }}
          animate={{
            scale: vectorControls.scale.x,
            x: vectorControls.position2D.x,
            y: vectorControls.position2D.y,
          }}
          transition={{
            duration: nestedControls.duration / 1000,
          }}
        >
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: colorControls.textColor }}
          >
            {basicControls.name}
          </h2>
          <div style={{ color: colorControls.textColor }}>
            <p className="mb-2">Count: {basicControls.count}</p>
            <p className="mb-2">Enabled: {basicControls.enabled ? 'Yes' : 'No'}</p>
            <p className="mb-2">
              Size: <span className="font-mono">{selectionControls.size}</span>
            </p>
            <p className="mb-2">
              Theme: <span className="font-mono">{selectionControls.theme}</span>
            </p>
            <p className="mb-2">
              Temperature: {intervalControls.temperature}
              {nestedControls.fps && ` @ ${nestedControls.fps}fps`}
            </p>
            <p className="mb-2">
              Range: [{intervalControls.range[0]}, {intervalControls.range[1]}]
            </p>
          </div>
        </motion.div>

        {/* Text Output */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-8 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">
            Control Values
          </h3>
          <div className="space-y-3 text-sm font-mono text-zinc-700 dark:text-zinc-300">
            <div>
              <span className="text-zinc-500 dark:text-zinc-500">Position 3D:</span>{' '}
              {`{ x: ${vectorControls.position3D.x}, y: ${vectorControls.position3D.y}, z: ${vectorControls.position3D.z} }`}
            </div>
            <div>
              <span className="text-zinc-500 dark:text-zinc-500">Accent:</span>{' '}
              <span
                className="inline-block w-4 h-4 rounded"
                style={{ backgroundColor: colorControls.accentColor }}
              />{' '}
              {colorControls.accentColor}
            </div>
            <div>
              <span className="text-zinc-500 dark:text-zinc-500">Description:</span>
              <div className="mt-1 p-2 bg-zinc-100 dark:bg-zinc-700 rounded">
                {selectionControls.description}
              </div>
            </div>
            <div>
              <span className="text-zinc-500 dark:text-zinc-500">Animation:</span>{' '}
              {nestedControls.duration}ms {nestedControls.easing}
              {nestedControls.loop && ' (loop)'}
            </div>
            <div>
              <span className="text-zinc-500 dark:text-zinc-500">Quality:</span>{' '}
              {nestedControls.quality} {nestedControls.vsync && '(vsync)'}
            </div>
            <div>
              <span className="text-zinc-500 dark:text-zinc-500">Smooth Value:</span>{' '}
              {smoothValue.toFixed(1)}
            </div>
          </div>

          {/* Message Display */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-green-100 dark:bg-green-900/30 rounded-lg"
            >
              <p className="text-green-800 dark:text-green-200 font-medium">
                {message}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow">
          <h3 className="font-bold mb-2 text-zinc-900 dark:text-zinc-50">
            Rich Controls
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Numbers, text, colors, vectors, ranges, and more control types available
            out of the box.
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow">
          <h3 className="font-bold mb-2 text-zinc-900 dark:text-zinc-50">
            Organization
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Group related controls using folders and panels for better organization and
            collapsible sections.
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow">
          <h3 className="font-bold mb-2 text-zinc-900 dark:text-zinc-50">
            Performance
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Use transient mode for smooth real-time updates without causing expensive
            re-renders.
          </p>
        </div>
      </div>
    </div>
  )
}
