"use client"

import React from "react"
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
import { redirect } from "next/navigation"
import { AppEdge } from "@/types/diagram-edge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function ThreadPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const { data: threads = [] } = api.thread.list.useQuery({
    where: { diagramId: id },
    orderBy: { createdAt: "desc" },
  })

  if (!useHasHydrated()) return

  return (
    <RootLayout
      navbarChildren={<DiagramControllers targetLink={`/diagram/${id}`} />}
    >
      <div className={"h-full overflow-auto"}>
        <Table className={""}>
          <TableHeader>
            <TableRow>
              <TableHead>Thread ID</TableHead>
              <TableHead>Diagram ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Events</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className={" grow overflow-auto"}>
            {threads.map((thread) => (
              <TableRow key={thread.id} className={"group"}>
                <TableCell className="font-medium hover:cursor-pointer group-hover:bg-slate-800">
                  <Link href={`/diagram/${id}?t=${thread.id}`} key={thread.id}>
                    {thread.id}
                  </Link>
                </TableCell>

                <TableCell>{thread.diagramId}</TableCell>
                <TableCell>{thread.status}</TableCell>
                <TableCell
                  className={
                    "max-h-[120px] overflow-auto whitespace-pre-wrap flex flex-col gap-1"
                  }
                >
                  {thread.events.map((eventMessage, index) => {
                    const { event, data } = eventMessage
                    return (
                      <div
                        className={"shrink-0 flex gap-2 overflow-auto"}
                        key={index}
                      >
                        <Badge
                          className={"shrink-0 w-40 h-fit"}
                          variant={"outline"}
                        >
                          {event}
                        </Badge>

                        <span>{JSON.stringify(data)}</span>
                      </div>
                    )
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </RootLayout>
  )
}
