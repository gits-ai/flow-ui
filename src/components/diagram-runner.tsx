"use client"

import { useDiagramController } from "@/hooks/use-diagram-controller"
import React, { useEffect, useRef, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RiOpenaiFill } from "react-icons/ri"
import { getHotkeyHandler } from "@mantine/hooks"
import { v4 } from "uuid"
import { Skeleton } from "@/components/ui/skeleton"
import { Message, useMessages } from "@/hooks/use-messages"
import { AppNode, SetAppNodes } from "@/types/diagram-node"
import { toast } from "sonner"
import { PostAgentBody } from "@/app/api/agent/route"
import useDiagramThread from "@/hooks/use-diagram-thread"

export default function DiagramRunner({
  id,
  nodes,
  setNodes,
}: {
  id: string
  nodes: AppNode[]
  setNodes: SetAppNodes
}) {
  const refInput = useRef<HTMLTextAreaElement>(null)

  const { messages, addMessage } = useMessages()

  const { updateThread } = useDiagramThread({ setNodes })

  const handleSubmit = async (event: KeyboardEvent | React.KeyboardEvent) => {
    if ((event as unknown as KeyboardEvent).isComposing || !refInput.current)
      return

    if (!nodes.length) return toast.error("At least ono node in a components!")

    let input = refInput.current.value
    refInput.current.value = ""

    const reqId = v4()
    const userMessage: Message = { id: reqId, content: input, role: "user" }
    addMessage(userMessage)

    const context = [...messages, userMessage]
    const data: PostAgentBody = {
      diagramId: id,
      messages: context,
    }
    const res = await fetch("/api/agent", {
      method: "POST",
      body: JSON.stringify(data),
    })
    const { threadId } = (await res.json()) as { threadId: string }
    void updateThread(threadId)
  }

  // console.log("-- runner: ", { id, threadId, messages })

  return (
    <div className={"w-[640px] h-full overflow-hidden flex flex-col gap-2 p-2"}>
      <div className={"flex justify-between items-center"}>
        <Label>预览</Label>
      </div>

      <div className={"grow overflow-auto flex flex-col gap-2"}>
        {messages.map((message, index) => (
          <div
            className={"flex gap-2 bg-slate-900 rounded-2xl p-2"}
            key={index}
          >
            <Avatar className={"shrink-0"}>
              <AvatarFallback>
                {message.role === "user" ? "U" : <RiOpenaiFill />}
              </AvatarFallback>
            </Avatar>

            <div className={"grow whitespace-pre-wrap rounded p-2"}>
              {message.content === null ? (
                <Skeleton className={"h-full w-full"} />
              ) : (
                message.content
              )}
            </div>
          </div>
        ))}
      </div>

      <div id={"input"} className={"shrink-0"}>
        <Textarea
          ref={refInput}
          maxRows={7}
          className={"w-full rounded-2xl"}
          onKeyDown={getHotkeyHandler([["Enter", handleSubmit]])}
        />
      </div>
    </div>
  )
}
