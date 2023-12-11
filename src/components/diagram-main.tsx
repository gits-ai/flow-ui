"use client"

import ReactFlow, {
  addEdge,
  Background,
  Connection,
  NodeTypes,
  Panel,
} from "reactflow"
import React from "react"
import { NodeType } from "@/types/diagram-node"
import { DiagramAgentNode } from "@/components/diagram-node"
import DiagramStatus from "@/components/diagram-status"
import { v4 } from "uuid"
import { useDiagramFitView } from "@/hooks/use-diagram-fit-view"
import { useAppReactFlow } from "@/hooks/use-app-react-flow"

import "reactflow/dist/style.css"
import { NodeDataTransferTag } from "@/config/diagram"

const nodeTypes: NodeTypes = {
  [NodeType.agent]: DiagramAgentNode,
}

export default function DiagramMain({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  setEdges,
}) {
  const { screenToFlowPosition, addNodes } = useAppReactFlow()

  const { ref } = useDiagramFitView({ nodes, edges })

  // console.log("-- components: ", { nodes, edges })

  return (
    <ReactFlow
      ref={ref}
      className={"grow bg-slate-900 text-slate-50 "}
      nodes={nodes}
      onNodesChange={onNodesChange}
      edges={edges}
      onEdgesChange={onEdgesChange}
      onConnect={(connection: Connection) => {
        setEdges((edges) => addEdge(connection, edges))
      }}
      nodeTypes={nodeTypes}
      fitView
      onDragOver={(event) => {
        console.log("-- onDropOver")
        event.preventDefault()
        event.dataTransfer.dropEffect = "move"
      }}
      onDrop={async (event) => {
        console.log("-- onDrop: ", event)
        addNodes([
          {
            id: v4(),
            position: screenToFlowPosition({
              x: event.clientX,
              y: event.clientY,
            }),
            type: NodeType.agent,

            data: {
              title: event.dataTransfer.getData(NodeDataTransferTag),
              type: "prompt",
              expanded: true,
              source: [],
              target: [],
              tickToRun: 0,
            },
          },
        ])
      }}
      proOptions={{ hideAttribution: true }}
    >
      {/*<MiniMap />*/}
      {/*<Controls />*/}
      <Background />

      <Panel position={"bottom-right"} className={"flex flex-col gap-2"}>
        {/*<DiagramControllerAnimation />*/}
        <DiagramStatus />
      </Panel>
    </ReactFlow>
  )
}
