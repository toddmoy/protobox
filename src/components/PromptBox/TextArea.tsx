import { useRef, useCallback, useEffect, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { usePromptBox } from "./context"

export function TextArea({
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

  // The editable div has no React-managed text children — text lives in the DOM
  // only. Pills are rendered as inline contentEditable={false} islands.
  const hasPills = !!children
  const showPlaceholder = !hasPills && !value

  return (
    <div className={cn("relative px-3 py-2", className)}>
      <div
        ref={editableRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline
        aria-placeholder={placeholder}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        data-placeholder={placeholder}
        className={cn(
          "min-h-[24px] max-h-[150px] overflow-y-auto outline-none",
          "whitespace-pre-wrap break-words text-sm text-gray-900",
          showPlaceholder &&
            "before:pointer-events-none before:text-gray-400 before:content-[attr(data-placeholder)]",
        )}
      >
        {children}
      </div>
    </div>
  )
}
