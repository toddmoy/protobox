import type { PromptBoxState } from "./context"

export type SubmitButtonState = "disabled" | "ready" | "submitting" | "stop"

export function deriveSubmitState(
  promptState: PromptBoxState,
  hasContent: boolean,
): SubmitButtonState {
  if (promptState === "submitting") return "stop"
  if (hasContent) return "ready"
  return "disabled"
}
