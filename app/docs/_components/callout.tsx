import type { ReactNode } from "react"
import { Icons } from "./icons"

export type CalloutVariant = "info" | "warn" | "danger" | "success"

export interface CalloutProps {
  variant?: CalloutVariant
  title?: string
  children: ReactNode
}

export function Callout({ variant = "info", title, children }: CalloutProps) {
  const Icon = {
    info: Icons.Info,
    warn: Icons.Warn,
    danger: Icons.X,
    success: Icons.Check,
  }[variant]

  return (
    <div className={`callout ${variant}`}>
      <div className="cl-icon">
        <Icon />
      </div>
      <div className="cl-body">
        {title ? <div className="cl-title">{title}</div> : null}
        <div>{children}</div>
      </div>
    </div>
  )
}
