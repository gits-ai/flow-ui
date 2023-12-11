import * as React from "react"

import { cn } from "@/utils/shadcn"
import TextareaAutosize, {
  TextareaAutosizeProps,
} from "react-textarea-autosize"

export interface TextareaProps extends TextareaAutosizeProps {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextareaAutosize
        className={cn(
          "flex w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          // "text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          // "min-h-[80px]",
          "resize-none",
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Textarea.displayName = "Textarea"

export { Textarea }
