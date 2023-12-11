import {
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from "d3-force"
import { useEdgesState, useNodesState } from "reactflow"
import { useEffect } from "react"

const simulation = forceSimulation()
  .force("charge", forceManyBody().strength(-100))
  .force("x", forceX().x(0).strength(0.01))
  .force("y", forceY().y(0).strength(0.01))
  // .force("center", forceCenter().strength(0.05))
  // .force("collide", collide())
  .alphaTarget(0.05)

export const useForceLayout = () => {
  const [nodes_, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  useEffect(() => {
    simulation.on("tick", () => {
      // const edges = getEdges()
      const nodes = nodes_.map((node) => ({
        ...node,
        x: node.position.x,
        y: node.position.y,
      }))

      simulation.nodes(nodes).force(
        "link",
        forceLink(edges)
          //   ref: https://stackoverflow.com/a/63642213/9422455
          .id((d: any) => d.id)
          .strength(0.05)
          .distance(100),
      )
      simulation.tick(10)

      console.log("-- ticked nodes: ", nodes)

      setNodes(() =>
        nodes.map((node) => {
          const targetNode = nodes.find((n) => n.id === node.id)
          return targetNode
            ? {
                ...node,
                position: {
                  x: targetNode.x,
                  y: targetNode.y,
                },
              }
            : node
        }),
      )
      // fitView()
    })

    return () => {
      simulation.on("tick", null)
    }
  }, [])
}
