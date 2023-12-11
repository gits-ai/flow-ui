"use client"

import React, { useEffect } from "react"
import DiagramSidebar from "@/components/diagram-sidebar"
import { Container } from "@/components/container"
import DiagramTerminal from "@/components/diagram-terminal"
import { useEdgesState, useNodesState } from "reactflow"
import { ClientNodeData } from "@/types/diagram-node"
import { useDiagramBuild } from "@/hooks/use-diagram-build"
import DiagramMain from "@/components/diagram-main"
import DiagramRunner from "@/components/diagram-runner"
import { useDiagramInit } from "@/hooks/use-diagram-init"
import { useDiagramSyncWithDB } from "@/hooks/use-diagram-sync"
import DiagramControllers from "@/components/diagram-controllers"
import RootLayout from "@/components/layout-root"
import { useHasHydrated } from "@/hooks/use-has-hydrated"
import { api } from "@/trpc/react"
import { redirect, useSearchParams } from "next/navigation"
import { AppEdge } from "@/types/diagram-edge"
import { useMessages } from "@/hooks/use-messages"
import { useDiagramController } from "@/hooks/use-diagram-controller"
import useDiagramThread from "@/hooks/use-diagram-thread"

export default function DiagramPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState<ClientNodeData>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<AppEdge>([])

  const { data: diagram } = api.diagram.get.useQuery({
    where: { id },
  })

  const { updateThread } = useDiagramThread({ setNodes })
  const { setPeriods } = useDiagramController()
  const { setMessages } = useMessages()
  const threadId = useSearchParams().get("t") || undefined
  const { data: thread } = api.thread.get.useQuery(
    {
      where: { id: threadId! },
    },
    {
      enabled: !!threadId,
    },
  )
  useEffect(() => {
    if (thread?.context) {
      console.log("-- thread context: ", thread.context)
      setMessages(thread.context)
      void updateThread(threadId)
    }
  }, [
    // todo: why we need thread.context.length
    thread?.context.length,
  ])

  useEffect(() => {
    return () => {
      setMessages([])
      setPeriods(0)
    }
  }, [])

  useDiagramInit({ diagram, setNodes, setEdges })

  useDiagramBuild({ nodes, edges, setNodes })

  useDiagramSyncWithDB({ diagram, nodes, edges })

  const { isRunning } = useDiagramController()

  // console.log(`-- DiagramPage --`)

  if (!useHasHydrated()) return

  if (diagram === null) return redirect("/404")
  if (!diagram) return

  return (
    <RootLayout
      navbarChildren={
        <DiagramControllers
          targetLink={`/diagram/${id}/threads`}
          setNodes={setNodes}
        />
      }
    >
      <Container orientation={"vertical"}>
        <div className={"grow flex overflow-auto"}>
          <DiagramSidebar diagram={diagram} />

          <DiagramMain
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            setEdges={setEdges}
          />

          {isRunning && (
            <DiagramRunner id={id} nodes={nodes} setNodes={setNodes} />
          )}
        </div>

        {/* 不加这个会被压缩 */}
        <div>
          <DiagramTerminal />
        </div>
      </Container>
    </RootLayout>
  )
}
