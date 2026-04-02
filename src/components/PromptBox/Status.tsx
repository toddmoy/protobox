import { type ReactNode } from "react"
import { cn } from "@/lib/utils"

export function Status({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn("px-3 pb-2", className)}>{children}</div>
}
