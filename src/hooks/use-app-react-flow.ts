import { useNodes, useReactFlow } from "reactflow"
import { ClientNodeData } from "@/types/diagram-node"
import { ClientEdgeData } from "@/types/diagram-edge"

/**
 * todo: encapsulate `mutateNodes` based on Producer
 */
export const useAppReactFlow = () => {
  return useReactFlow<ClientNodeData, ClientEdgeData>()
}

export const useAppNodes = () => {
  return useNodes<ClientNodeData>()
}
