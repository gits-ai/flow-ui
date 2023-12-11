import { Label } from "@/components/ui/label"

export const VerticalField = ({ title, children }) => {
  return (
    <div className={"flex flex-col gap-1"}>
      <Label>{title}</Label>
      {children}
    </div>
  )
}

export const HorizontalField = ({ title, children }) => {
  return (
    <div className={"flex gap-1"}>
      <Label className={"w-16 truncate"}>{title}</Label>
      {children}
    </div>
  )
}
