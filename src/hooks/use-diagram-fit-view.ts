import { useEffect } from "react"
import { useAppReactFlow } from "@/hooks/use-app-react-flow"
import { useElementSize } from "@mantine/hooks"

export const useDiagramFitView = ({ nodes, edges }) => {
  const { fitView } = useAppReactFlow()
  const { ref, width, height } = useElementSize()

  useEffect(() => {
    fitView()
  }, [width, height, nodes, edges])

  return { ref }
}
