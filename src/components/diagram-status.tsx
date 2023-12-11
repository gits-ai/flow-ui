import { useEdges } from "reactflow"
import { useDiagramController } from "@/hooks/use-diagram-controller"
import { HorizontalField } from "@/components/fields"
import { max } from "lodash"
import { useAppNodes } from "@/hooks/use-app-react-flow"

export function DiagramStatus() {
  const nodes = useAppNodes()
  const edges = useEdges()
  const { periods, ticks } = useDiagramController()

  return (
    <div className={"flex flex-col text-xs text-slate-300"}>
      <HorizontalField title={"Nodes"}>{nodes.length}</HorizontalField>
      <HorizontalField title={"Edges"}>{edges.length}</HorizontalField>
      <HorizontalField title={"Periods"}>{periods}</HorizontalField>
      <HorizontalField title={"Ticks"}>{ticks}</HorizontalField>
      <HorizontalField title={"MaxTicks"}>
        {max(nodes.map((node) => node.data.tickToRun))}
      </HorizontalField>
    </div>
  )
}

export default DiagramStatus
