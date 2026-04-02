import {
  createContext,
  useContext,
  useRef,
  useCallback,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from "react"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// State Machine
// ---------------------------------------------------------------------------

const promptBoxMachine = {
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

function useStateMachine<
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

type PromptBoxContextValue = {
  state: PromptBoxState
  send: (event: PromptBoxEvent) => void
  value: string
  onValueChange: (value: string) => void
  submit: () => void
}

const PromptBoxContext = createContext<PromptBoxContextValue | null>(null)

export function usePromptBox() {
  const ctx = useContext(PromptBoxContext)
  if (!ctx)
    throw new Error(
      "PromptBox compound components must be rendered inside <PromptBox>",
    )
  return ctx
}

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
      <div
        className={cn(
          "flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm",
          "transition-shadow focus-within:border-gray-300 focus-within:shadow-md",
          className,
        )}
      >
        {children}
      </div>
    </PromptBoxContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------

function Header({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn("px-4 pt-3 pb-1", className)}>{children}</div>
}

// ---------------------------------------------------------------------------
// TextArea (contentEditable)
// ---------------------------------------------------------------------------

function TextArea({
  placeholder = "Type a message\u2026",
  className,
  children,
}: {
  placeholder?: string
  className?: string
  children?: ReactNode
}) {
  const { value, onValueChange, submit } = usePromptBox()
  const editableRef = useRef<HTMLDivElement>(null)
  const internalValue = useRef(value)

  // Sync DOM when controlled value changes externally (e.g. cleared after submit)
  useEffect(() => {
    if (value !== internalValue.current && editableRef.current) {
      internalValue.current = value
      editableRef.current.textContent = value
    }
  }, [value])

  const handleInput = useCallback(() => {
    const text = editableRef.current?.textContent ?? ""
    internalValue.current = text
    onValueChange(text)
  }, [onValueChange])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        submit()
      }
    },
    [submit],
  )

  return (
    <div className={cn("relative px-4 py-2", className)}>
      {children && <div className="mb-1 flex flex-wrap gap-1">{children}</div>}
      <div
        ref={editableRef}
        contentEditable
        role="textbox"
        aria-multiline
        aria-placeholder={placeholder}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        data-placeholder={placeholder}
        className={cn(
          "min-h-[24px] max-h-[150px] overflow-y-auto outline-none",
          "whitespace-pre-wrap break-words text-sm text-gray-900",
          "empty:before:pointer-events-none empty:before:text-gray-400 empty:before:content-[attr(data-placeholder)]",
        )}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

function Footer({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex items-center justify-end px-4 pt-1 pb-3", className)}>
      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Compound export
// ---------------------------------------------------------------------------

export const PromptBox = Object.assign(PromptBoxRoot, {
  Header,
  TextArea,
  Footer,
})
