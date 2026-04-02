import { type ReactNode } from "react"
import { cn } from "@/lib/utils"

export function Footer({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-end px-3 pt-1 pb-3",
        className,
      )}
    >
      {children}
    </div>
  )
}
