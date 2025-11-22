import { useState } from 'react'
import useTypewriter from '@/hooks/useTypewriter'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Play, Pause, RotateCcw } from 'lucide-react'

export default function TypewriterDemo() {
  const [customText, setCustomText] = useState('The quick brown fox jumps over the lazy dog.')

  // Example 1: Basic typewriter with cursor
  const basic = useTypewriter('Hello, World! This is a typewriter effect.', {
    speed: 80,
    cursor: true,
    delay: 500,
  })

  // Example 2: Fast typing without cursor
  const fast = useTypewriter('This types much faster and has no cursor!', {
    speed: 30,
    cursor: false,
    delay: 1000,
  })

  // Example 3: Looping typewriter
  const looping = useTypewriter('This message loops forever...', {
    speed: 60,
    cursor: true,
    loop: true,
    loopDelay: 2000,
    delay: 1500,
  })

  // Example 4: Manual control
  const manual = useTypewriter('Click the buttons below to control this text!', {
    speed: 70,
    cursor: true,
    autoStart: false,
  })

  // Example 5: Custom text input
  const custom = useTypewriter(customText, {
    speed: 50,
    cursor: true,
    autoStart: false,
  })

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
            Typewriter Hook Demo
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Examples of the useTypewriter hook with different configurations
          </p>
        </div>

        {/* Example 1: Basic */}
        <Card className="p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Basic</Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              speed: 80ms, cursor: true, delay: 500ms
            </span>
          </div>
          <p className="text-lg font-mono text-zinc-900 dark:text-zinc-50 min-h-[2rem]">
            {basic.text}
          </p>
        </Card>

        {/* Example 2: Fast */}
        <Card className="p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Fast</Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              speed: 30ms, cursor: false, delay: 1000ms
            </span>
          </div>
          <p className="text-lg font-mono text-zinc-900 dark:text-zinc-50 min-h-[2rem]">
            {fast.text}
          </p>
        </Card>

        {/* Example 3: Looping */}
        <Card className="p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Looping</Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              loop: true, loopDelay: 2000ms
            </span>
          </div>
          <p className="text-lg font-mono text-zinc-900 dark:text-zinc-50 min-h-[2rem]">
            {looping.text}
          </p>
        </Card>

        {/* Example 4: Manual Control */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Manual Control</Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              autoStart: false
            </span>
          </div>
          <p className="text-lg font-mono text-zinc-900 dark:text-zinc-50 min-h-[2rem]">
            {manual.text}
          </p>
          <div className="flex gap-2">
            <Button
              onClick={manual.start}
              disabled={manual.isTyping}
              size="sm"
              variant="default"
            >
              <Play className="w-4 h-4 mr-1" />
              {manual.isComplete ? 'Restart' : 'Start'}
            </Button>
            <Button
              onClick={manual.pause}
              disabled={!manual.isTyping}
              size="sm"
              variant="outline"
            >
              <Pause className="w-4 h-4 mr-1" />
              Pause
            </Button>
            <Button onClick={manual.reset} size="sm" variant="outline">
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
          </div>
          <div className="flex gap-4 text-xs text-zinc-600 dark:text-zinc-400">
            <span>
              Status: {manual.isTyping ? 'Typing...' : manual.isComplete ? 'Complete' : 'Ready'}
            </span>
          </div>
        </Card>

        {/* Example 5: Custom Text Input */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Custom Text</Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Type your own message
            </span>
          </div>
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="w-full p-3 border border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 font-mono text-sm min-h-[100px] resize-y"
            placeholder="Enter custom text..."
          />
          <p className="text-lg font-mono text-zinc-900 dark:text-zinc-50 min-h-[2rem]">
            {custom.text}
          </p>
          <div className="flex gap-2">
            <Button onClick={custom.start} size="sm" variant="default">
              <Play className="w-4 h-4 mr-1" />
              {custom.isComplete ? 'Restart' : 'Start'}
            </Button>
            <Button onClick={custom.reset} size="sm" variant="outline">
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
          </div>
        </Card>

        {/* Code Example */}
        <Card className="p-6 space-y-3 bg-zinc-50 dark:bg-zinc-900">
          <Badge variant="outline">Usage Example</Badge>
          <pre className="text-xs text-zinc-700 dark:text-zinc-300 overflow-x-auto">
            <code>{`import useTypewriter from '@/hooks/useTypewriter'

const { text, isTyping, isComplete, start, pause, reset } = useTypewriter(
  'Your text here',
  {
    speed: 80,        // ms per character
    delay: 500,       // ms before starting
    cursor: true,     // show blinking cursor
    loop: false,      // repeat animation
    autoStart: true,  // start automatically
    onComplete: () => console.log('Done!')
  }
)

return <p>{text}</p>`}</code>
          </pre>
        </Card>

        {/* Back link */}
        <div className="pt-4">
          <a
            href="/"
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 underline"
          >
            ← Back to home
          </a>
        </div>
      </div>
    </div>
  )
}
