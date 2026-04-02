import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PromptBox } from "@/components/PromptBox/PromptBox"
import { SubmitButton } from "@/components/PromptBox/SubmitButton"

export default function PromptBoxContent() {
  const [value, setValue] = useState("")

  const handleSubmit = (text: string) => {
    alert(`Submitted: "${text}"`)
    setValue("")
  }

  return (
    <div className="space-y-8">
      {/* Example: Idle State */}
      <Card className="space-y-3 p-6">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Idle</Badge>
          <span className="text-xs text-zinc-500">
            default state, submit disabled until content
          </span>
        </div>
        <p className="text-sm text-zinc-600">
          Type a message and press Enter or click the submit button. The button
          enables when text is present.
        </p>

        <div className="mx-auto max-w-lg">
          <PromptBox
            value={value}
            onValueChange={setValue}
            onSubmit={handleSubmit}
          >
            <PromptBox.TextArea placeholder="Ask anything..." />
            <PromptBox.Footer>
              <SubmitButton />
            </PromptBox.Footer>
          </PromptBox>
        </div>
      </Card>

      {/* Code Example */}
      <Card className="space-y-3 bg-zinc-50 p-6">
        <Badge variant="outline">Usage Example</Badge>
        <pre className="overflow-x-auto text-xs text-zinc-700">
          <code>{`import { useState } from "react"
import { PromptBox } from "@/components/PromptBox/PromptBox"
import { SubmitButton } from "@/components/PromptBox/SubmitButton"

function ChatInput() {
  const [value, setValue] = useState("")

  return (
    <PromptBox
      value={value}
      onValueChange={setValue}
      onSubmit={(text) => {
        console.log("Submitted:", text)
        setValue("")
      }}
    >
      {/* Header is optional — add anything */}
      <PromptBox.Header>
        <span className="text-xs text-gray-400">Model: GPT-4</span>
      </PromptBox.Header>

      {/* TextArea supports composed-in pills as children */}
      <PromptBox.TextArea placeholder="Ask anything...">
        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs">
          report.csv
        </span>
      </PromptBox.TextArea>

      {/* Footer — SubmitButton auto-derives its state */}
      <PromptBox.Footer>
        <SubmitButton />
      </PromptBox.Footer>
    </PromptBox>
  )
}`}</code>
        </pre>
      </Card>

      {/* API Reference */}
      <Card className="space-y-3 bg-zinc-50 p-6">
        <Badge variant="outline">API Reference</Badge>
        <div className="space-y-4 text-sm text-zinc-700">
          <div>
            <h4 className="mb-1 font-semibold">PromptBox (Root)</h4>
            <pre className="overflow-x-auto rounded bg-zinc-100 p-2 text-xs">
              <code>{`<PromptBox
  value: string
  onValueChange: (value: string) => void
  onSubmit?: (value: string) => void
  className?: string
/>`}</code>
            </pre>
          </div>
          <div>
            <h4 className="mb-1 font-semibold">PromptBox.Header</h4>
            <p className="mb-1 text-xs text-zinc-500">
              Optional slot for arbitrary header content (model selector, pills,
              etc.)
            </p>
          </div>
          <div>
            <h4 className="mb-1 font-semibold">PromptBox.TextArea</h4>
            <p className="mb-1 text-xs text-zinc-500">
              ContentEditable input. Accepts children (pills) rendered above the
              text. Auto-expands up to ~6 lines.
            </p>
          </div>
          <div>
            <h4 className="mb-1 font-semibold">PromptBox.Footer</h4>
            <p className="mb-1 text-xs text-zinc-500">
              Footer slot. Typically contains SubmitButton plus optional actions.
            </p>
          </div>
          <div>
            <h4 className="mb-1 font-semibold">SubmitButton</h4>
            <p className="mb-1 text-xs text-zinc-500">
              Derives its own state from PromptBox context. States: disabled,
              ready, submitting, stop.
            </p>
            <pre className="overflow-x-auto rounded bg-zinc-100 p-2 text-xs">
              <code>{`<SubmitButton
  onStop?: () => void   // called when user clicks stop
  className?: string
/>`}</code>
            </pre>
          </div>
          <div>
            <h4 className="mb-1 font-semibold">State Machine</h4>
            <pre className="overflow-x-auto rounded bg-zinc-100 p-2 text-xs">
              <code>{`idle ──CHANGE──▶ composing ──SUBMIT──▶ submitting
  ▲                  │                     │
  └───CLEAR──────────┘       SUCCESS/ERROR/CANCEL
                                    │
                                    ▼
                                  idle`}</code>
            </pre>
          </div>
        </div>
      </Card>
    </div>
  )
}
