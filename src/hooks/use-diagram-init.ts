import { useEffect } from "react"

export const useDiagramInit = ({ diagram, setNodes, setEdges }) => {
  useEffect(() => {
    if (!diagram) return

    setNodes(diagram.flowData?.nodes ?? [])
    setEdges(diagram.flowData?.edges ?? [])

    console.log("-- init diagram ✅")
  }, [diagram])
}
