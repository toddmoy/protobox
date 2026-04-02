import { createContext, useContext, useState, useCallback } from "react"

// ---------------------------------------------------------------------------
// State Machine
// ---------------------------------------------------------------------------

export const promptBoxMachine = {
  idle: {
    CHANGE: "composing",
  },
  composing: {
    SUBMIT: "submitting",
    CLEAR: "idle",
  },
  submitting: {
    SUCCESS: "idle",
    ERROR: "composing",
    CANCEL: "idle",
  },
} as const

export type PromptBoxState = keyof typeof promptBoxMachine
export type PromptBoxEvent =
  | "CHANGE"
  | "SUBMIT"
  | "CLEAR"
  | "SUCCESS"
  | "ERROR"
  | "CANCEL"

export function useStateMachine<
  T extends Record<string, Record<string, string>>,
>(machine: T, initial: keyof T) {
  const [state, setState] = useState<keyof T>(initial)

  const send = useCallback(
    (event: string) => {
      setState((current) => {
        const transitions = machine[current] as
          | Record<string, keyof T>
          | undefined
        const next = transitions?.[event]
        if (next) return next
        console.warn(
          `PromptBox: no transition for "${event}" in state "${String(current)}"`,
        )
        return current
      })
    },
    [machine],
  )

  return [state, send] as const
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export type PromptBoxContextValue = {
  state: PromptBoxState
  send: (event: PromptBoxEvent) => void
  value: string
  onValueChange: (value: string) => void
  submit: () => void
}

export const PromptBoxContext = createContext<PromptBoxContextValue | null>(null)

export function usePromptBox() {
  const ctx = useContext(PromptBoxContext)
  if (!ctx)
    throw new Error(
      "PromptBox compound components must be rendered inside <PromptBox>",
    )
  return ctx
}
