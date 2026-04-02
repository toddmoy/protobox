import { useState } from "react"
import { PromptBox, SubmitButton } from "@/components/PromptBox"

export default function PromptBoxContent() {
  const [value, setValue] = useState("")
  const [showHeader, setShowHeader] = useState(false)
  const [showStatus, setShowStatus] = useState(false)
  const [showPill, setShowPill] = useState(false)

  const handleSubmit = (text: string) => {
    alert(`Submitted: "${text}"`)
    setValue("")
  }

  return (
    <div className="space-y-8">
      {/* Interactive Canvas */}
      <div>
        {/* Canvas */}
        <div
          className="flex min-h-[300px] items-end justify-center rounded-t-xl border border-gray-200 p-8"
          style={{
            backgroundImage:
              "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        >
          <div className="w-full max-w-lg">
            <PromptBox
              value={value}
              onValueChange={setValue}
              onSubmit={handleSubmit}
            >
              {showStatus && (
                <PromptBox.Status>
                  <p className="text-xs text-gray-500">
                    Working on 3 items...
                  </p>
                </PromptBox.Status>
              )}
              <PromptBox.Box>
                {showHeader && (
                  <PromptBox.Header>
                    <span className="text-xs text-gray-400">Model: GPT-4</span>
                  </PromptBox.Header>
                )}
                <PromptBox.TextArea placeholder="Ask anything...">
                  {showPill && (
                    <span
                      contentEditable={false}
                      className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs leading-5 text-blue-700"
                    >
                      report.csv
                    </span>
                  )}
                </PromptBox.TextArea>
                <PromptBox.Footer>
                  <SubmitButton />
                </PromptBox.Footer>
              </PromptBox.Box>
            </PromptBox>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 rounded-b-xl border border-t-0 border-gray-200 bg-zinc-50 px-4 py-3">
          <span className="text-xs font-medium text-zinc-500">Show:</span>
          <label className="flex items-center gap-1.5 text-xs text-zinc-600">
            <input
              type="checkbox"
              checked={showHeader}
              onChange={(e) => setShowHeader(e.target.checked)}
              className="rounded"
            />
            Header
          </label>
          <label className="flex items-center gap-1.5 text-xs text-zinc-600">
            <input
              type="checkbox"
              checked={showStatus}
              onChange={(e) => setShowStatus(e.target.checked)}
              className="rounded"
            />
            Status
          </label>
          <label className="flex items-center gap-1.5 text-xs text-zinc-600">
            <input
              type="checkbox"
              checked={showPill}
              onChange={(e) => setShowPill(e.target.checked)}
              className="rounded"
            />
            Pill
          </label>
        </div>
      </div>
    </div>
  )
}
