import { useEffect } from "react"
import { produce } from "immer"
import buildDiagram from "@/utils/build-diagram"

/**
 * 生成结点之间的关系，确定 tick 等
 *
 * @param nodes
 * @param edges
 * @param setNodes
 */
export const useDiagramBuild = ({ nodes, edges, setNodes }) => {
  useEffect(() => {
    if (!nodes.length) return

    // 初始化 nodes 里的有向关系与运行时
    setNodes((nodes) =>
      produce(nodes, (nodes) => {
        buildDiagram({ nodes, edges })
      }),
    )
  }, [
    // 点的数量变化时，需要重建图的有向关系；但结点的内部信息变化则不需要
    nodes.length,
    // 边变化（不确定改变一条边的指向瞬间会不会引起边数目的变化，如果会的话，不妨直接用边数量做依赖
    // todo: 图里面有环的情况
    edges,
  ])
}
