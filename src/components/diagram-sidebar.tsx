"use client"

import { Input } from "@/components/ui/input"
import { EditIcon, SearchIcon } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import _, { camelCase, startCase } from "lodash"
import React from "react"
import { api } from "@/trpc/react"
import { Diagram } from ".prisma/client"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { NODE_TYPES, NodeCategory, NodeDataTransferTag } from "@/config/diagram"

export default function DiagramSidebar({ diagram }: { diagram?: Diagram }) {
  const updateDiagram = api.diagram.update.useMutation({})

  return (
    <div
      id={"sidebar"}
      className={"w-48 h-full shrink-0 p-2 flex flex-col gap-2"}
    >
      <div className={"w-full flex items-center"}>
        {/*<EditIcon className={"w-4 h-4 shrink-0 text-muted-foreground"} />*/}
        <Input
          className={"border-none grow truncate hover:underline"}
          defaultValue={diagram?.title ?? ""}
          placeholder={diagram?.title ?? "Untitled"}
          onChange={(event) => {
            if (!diagram) return

            const title = event.currentTarget.value
            updateDiagram.mutate({
              where: { id: diagram.id },
              data: {
                title,
              },
            })
          }}
        />
      </div>

      {/*<Separator orientation={"horizontal"} />*/}

      <div className={"w-ful relative"}>
        <Input className={"w-full"} />
        <SearchIcon
          className={
            "w-5 absolute right-2 top-0 bottom-0 my-auto text-muted-foreground"
          }
        />
      </div>

      <Accordion type={"multiple"} defaultValue={[NodeCategory.Agent]}>
        {_(NODE_TYPES)
          .groupBy("category")
          .map((nodes, category) => {
            // console.log("-- nodeTypes category: ", { category, nodes })
            return (
              <AccordionItem value={category} key={category}>
                <AccordionTrigger className={"py-2"}>
                  {category}
                </AccordionTrigger>
                <AccordionContent>
                  <div className={"flex flex-col gap-2"}>
                    {nodes.map(({ name }) => (
                      <Button
                        className={"text-xs"}
                        key={name}
                        draggable
                        onDragStart={(event) => {
                          event.dataTransfer.setData(NodeDataTransferTag, name)
                          event.dataTransfer.effectAllowed = "move"
                        }}
                      >
                        {startCase(camelCase(name))}
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })
          .value()}
      </Accordion>
    </div>
  )
}
