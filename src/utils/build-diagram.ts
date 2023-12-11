import { AppNode } from "@/types/diagram-node"
import { AppEdge } from "@/types/diagram-edge"

/**
 * 既可以给 client 用，也可以给 server 用
 *
 * @param nodes
 * @param edges
 */
export default function buildDiagram({
  nodes,
  edges,
}: {
  nodes: AppNode[]
  edges: AppEdge[]
}): AppNode[] {
  // 重置 nodes 的关系
  nodes.forEach((node) => {
    node.data.source = []
    node.data.target = []
    node.data.tickToRun = 0
    node.data.input = ""
    node.data.output = ""
  })

  // 初始化 nodes 的关系
  edges.forEach(({ source, target }) => {
    nodes.find((node) => node.id === source)!.data.target.push(target)
    nodes.find((node) => node.id === target)!.data.source.push(source)
  })

  let ticks = 0
  while (nodes.find((node) => node.data.tickToRun === 0)) {
    ++ticks

    // 初始化 nodes 的运行时
    nodes.forEach((node) => {
      if (node.data.tickToRun !== 0) return
      if (
        !node.data.source.every(
          (sourceId) =>
            nodes.find((node) => node.id === sourceId)!.data.tickToRun > 0,
        )
      )
        return

      node.data.tickToRun = ticks
      // console.log(`-- Node(title=${node.data.title}).data.tickToRun = ${ticks}`)
    })
    // console.log(`-- build tick [${ticks}] ✅`)
  }

  console.log("-- build diagram ✅")
  return nodes
}
