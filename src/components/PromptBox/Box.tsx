import { type ReactNode } from "react"
import { cn } from "@/lib/utils"

export function Box({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm",
        "transition-shadow focus-within:border-gray-300 focus-within:shadow-md",
        className,
      )}
    >
      {children}
    </div>
  )
}
