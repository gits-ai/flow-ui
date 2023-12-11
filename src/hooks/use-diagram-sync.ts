import { api } from "@/trpc/react"
import { useEffect } from "react"
import { useAppReactFlow } from "@/hooks/use-app-react-flow"

export const useDiagramSyncWithDB = ({ diagram, nodes, edges }) => {
  const { toObject } = useAppReactFlow()

  const utils = api.useUtils()
  const updateDiagramMutation = api.diagram.update.useMutation({
    onSuccess: (data) => {
      // 不要在这里更新表，这里只初始化
      // void utils.diagram.get.invalidate()
      console.log("-- updated diagram ✅")
    },
  })

  useEffect(() => {
    //   但可以在清理的时候初始化
    return () => void utils.diagram.get.invalidate()
  }, [])

  /**
   * 1. onNodesChange / onEdgesChange
   * 2. state of nodes/edges change
   * 3. database change
   */
  useEffect(() => {
    const nodeOk = ({ width, height, dragging }) =>
      !!width && !!height && !dragging

    if (!diagram?.id) return

    if (nodes.length && nodes.every(nodeOk))
      updateDiagramMutation.mutate({
        where: { id: diagram.id },
        data: {
          flowData: toObject(),
        },
      })
  }, [diagram?.id, nodes, edges])
}
