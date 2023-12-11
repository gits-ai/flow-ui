import React, { HTMLAttributes } from "react"
import { clsx } from "clsx"

export const IconContainer = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={clsx(
      "border border-slate-700 p-1 rounded hover:bg-slate-700 cursor-pointer",
      className,
    )}
    {...props}
  >
    {children}
  </div>
)
