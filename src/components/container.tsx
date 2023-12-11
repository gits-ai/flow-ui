import React, { HTMLAttributes, PropsWithChildren } from "react"
import { clsx } from "clsx"

export const Container = ({
  orientation = "horizontal",

  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  orientation: "horizontal" | "vertical"
}) => {
  return (
    <div
      className={clsx(
        "w-full h-full flex",
        // "items-center ",
        orientation === "horizontal" ? "" : "flex-col",
        className,
      )}
      {...props}
    />
  )
}
