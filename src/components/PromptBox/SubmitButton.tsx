import { cn } from "@/lib/utils"
import { usePromptBox, type PromptBoxState } from "./PromptBox"
import { ArrowUp, Square, Loader2 } from "lucide-react"

// ---------------------------------------------------------------------------
// Derived state
// ---------------------------------------------------------------------------

export type SubmitButtonState = "disabled" | "ready" | "submitting" | "stop"

export function deriveSubmitState(
  promptState: PromptBoxState,
  hasContent: boolean,
): SubmitButtonState {
  if (promptState === "submitting") return "stop"
  if (hasContent) return "ready"
  return "disabled"
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export type SubmitButtonProps = {
  className?: string
  onStop?: () => void
}

export function SubmitButton({ className, onStop }: SubmitButtonProps) {
  const { state, value, submit, send } = usePromptBox()
  const buttonState = deriveSubmitState(state, value.trim().length > 0)

  const handleClick = () => {
    if (buttonState === "stop") {
      onStop?.()
      send("CANCEL")
      return
    }
    submit()
  }

  return (
    <button
      type="button"
      disabled={buttonState === "disabled"}
      onClick={handleClick}
      aria-label={buttonState === "stop" ? "Stop generation" : "Send message"}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors",
        buttonState === "disabled" && "cursor-not-allowed bg-gray-100 text-gray-300",
        buttonState === "ready" && "bg-gray-900 text-white hover:bg-gray-700",
        buttonState === "submitting" && "bg-gray-900 text-white",
        buttonState === "stop" && "bg-gray-900 text-white hover:bg-red-600",
        className,
      )}
    >
      {buttonState === "submitting" && (
        <Loader2 size={16} className="animate-spin" />
      )}
      {buttonState === "stop" && <Square size={12} fill="currentColor" />}
      {(buttonState === "ready" || buttonState === "disabled") && (
        <ArrowUp size={16} />
      )}
    </button>
  )
}
