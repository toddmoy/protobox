import { useCallback, useMemo, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import {
  PromptBoxContext,
  promptBoxMachine,
  useStateMachine,
  type PromptBoxState,
  type PromptBoxEvent,
  type PromptBoxContextValue,
} from "./context"
import { Status } from "./Status"
import { Box } from "./Box"
import { Header } from "./Header"
import { TextArea } from "./TextArea"
import { Footer } from "./Footer"

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export type PromptBoxProps = {
  value: string
  onValueChange: (value: string) => void
  onSubmit?: (value: string) => void
  children: ReactNode
  className?: string
}

function PromptBoxRoot({
  value,
  onValueChange,
  onSubmit,
  children,
  className,
}: PromptBoxProps) {
  const [state, send] = useStateMachine(promptBoxMachine, "idle")

  const handleSubmit = useCallback(() => {
    if (!value.trim()) return
    send("SUBMIT")
    onSubmit?.(value)
  }, [value, send, onSubmit])

  const handleValueChange = useCallback(
    (next: string) => {
      onValueChange(next)
      const hasContent = next.trim().length > 0
      if (state === "idle" && hasContent) send("CHANGE")
      if (state === "composing" && !hasContent) send("CLEAR")
    },
    [onValueChange, state, send],
  )

  const ctx = useMemo(
    (): PromptBoxContextValue => ({
      state: state as PromptBoxState,
      send: send as (event: PromptBoxEvent) => void,
      value,
      onValueChange: handleValueChange,
      submit: handleSubmit,
    }),
    [state, send, value, handleValueChange, handleSubmit],
  )

  return (
    <PromptBoxContext.Provider value={ctx}>
      <div className={cn("flex flex-col justify-end", className)}>
        {children}
      </div>
    </PromptBoxContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Compound export
// ---------------------------------------------------------------------------

export const PromptBox = Object.assign(PromptBoxRoot, {
  Status,
  Box,
  Header,
  TextArea,
  Footer,
})
