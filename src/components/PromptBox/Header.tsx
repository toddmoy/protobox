import { type ReactNode } from "react"
import { cn } from "@/lib/utils"

export function Header({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn("px-3 pt-3 pb-1", className)}>{children}</div>
}
