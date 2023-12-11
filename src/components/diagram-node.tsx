import { ChangeEventHandler } from "react"
import { Handle, Node, NodeProps, Position } from "reactflow"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ClientNodeData, NodeType, PromptNodeData } from "@/types/diagram-node"
import {
  DotFilledIcon,
  MinusCircledIcon,
  PinBottomIcon,
  PinTopIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons"
import { v4 } from "uuid"
import { Textarea } from "@/components/ui/textarea"
import { produce } from "immer"
import { clsx } from "clsx"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { IconContainer } from "@/components/icon"
import _ from "lodash"
import type { Paths } from "type-fest"
import { Separator } from "@/components/ui/separator"
import { useAppReactFlow } from "@/hooks/use-app-react-flow"
import { VerticalField } from "@/components/fields"
import { useDiagramController } from "@/hooks/use-diagram-controller"
import { CLASSNAME_NODRAG } from "@/config/diagram"

const SubNode = ({ title, children }) => {
  return (
    <div className={"flex flex-col gap-1 overflow-auto max-w-72"}>
      <div className={"flex items-center w-full"}>
        <DotFilledIcon className={"text-green-500"} />
        <Label>{title}</Label>
      </div>
      {children}
    </div>
  )
}

export const DiagramAgentNode = (node: NodeProps<ClientNodeData>) => {
  const { ticks } = useDiagramController()
  const { data, xPos, yPos, id: agentId } = node
  const { addNodes, getNodes, addEdges, setEdges, setNodes } = useAppReactFlow()

  const updateNode = (func: (node: Node) => void) => {
    setNodes((nodes) =>
      produce(nodes, (nodes) => {
        func(nodes.find((node) => node.id === agentId)!)
      }),
    )
  }

  const bindStringField = (
    key: Paths<PromptNodeData>,
  ): {
    className?: string
    defaultValue: string | undefined
    onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  } => ({
    defaultValue: _.get(node.data, key) as string | undefined,
    onChange: (event) => {
      console.log("-- onChangeEvent: ", event)
      updateNode((node) => _.set(node.data, key, event.currentTarget.value))
    },
  })

  const PinIcon = data.expanded ? PinTopIcon : PinBottomIcon

  // console.log("-- [UI] node data: ", data)
  const tick = node.data.tickToRun

  return (
    <>
      <Collapsible
        className={clsx(
          "rounded border bg-slate-800 text-text-xs",
          // 运行中
          ticks > 0 &&
            clsx(
              // 触发后，加粗
              tick <= ticks && "border-2 border-pink-900",

              // 正在运行时，变色更浓一些
              tick === ticks && "!border-green-500",

              // 完成后，若是叶子结点取一个中间色
              tick < ticks &&
                node.data.target.length === 0 &&
                "border-pink-400",
            ),
        )}
        defaultOpen={!!data.expanded}
        onOpenChange={(expanded) => {
          updateNode((node) => (node.data.expanded = expanded))
        }}
      >
        <div
          className={
            "w-full flex items-center justify-between bg-gradient-to-r from-red-500/25"
          }
        >
          <Input
            className={clsx(
              "grow px-2 py-1 border-none",
              !data.expanded && "min-w-[2rem] max-w-[4rem]",
            )}
            {...bindStringField("title")}
          />

          <div className={"shrink-0 px-2 flex items-center"}>
            <CollapsibleTrigger>
              <IconContainer>
                <PinIcon className={"w-2 h-2"} />
              </IconContainer>
            </CollapsibleTrigger>
          </div>
        </div>

        <CollapsibleContent className={"border-t border-red-500 w-72"}>
          <div className={"p-2 flex flex-col gap-2 border-t"}>
            {data.type === "prompt" && (
              <div className={"flex flex-col gap-2"}>
                <SubNode title={"Model"}>
                  <VerticalField title={"LLM"}>
                    <Input
                      placeholder={"gpt-3.5-turbo"}
                      className={CLASSNAME_NODRAG}
                      {...bindStringField("llm.body.model")}
                    />
                  </VerticalField>

                  <VerticalField title={"API Base"}>
                    <Input
                      className={CLASSNAME_NODRAG}
                      placeholder={"http://xx.com/v1"}
                      {...bindStringField("llm.headers.apiBase")}
                    />
                  </VerticalField>

                  <VerticalField title={"API Key"}>
                    <Input
                      className={CLASSNAME_NODRAG}
                      placeholder={"sk-xx"}
                      {...bindStringField("llm.headers.apiKey")}
                    />
                  </VerticalField>
                </SubNode>

                <SubNode title={"System Prompt"}>
                  <Textarea
                    minRows={2}
                    maxRows={10}
                    placeholder={
                      "You are ChatGPT, a large language model trained by OpenAI."
                    }
                    className={CLASSNAME_NODRAG}
                    {...bindStringField("prompt.content")}
                  />
                </SubNode>

                <Separator
                  orientation={"horizontal"}
                  className={"bg-red-500/50"}
                />

                {/* 有了 terminal table 之后 就不需要实时显示 node 里的 io 了，会导致变形 */}

                {/*<SubNode title={"Input"}>*/}
                {/*  <Markdown className="prism nowheel nodrag">*/}
                {/*    {data.input}*/}
                {/*  </Markdown>*/}
                {/*</SubNode>*/}

                {/*<SubNode title={"Output"}>*/}
                {/*  <Markdown className="prism nowheel nodrag">*/}
                {/*    {data.output}*/}
                {/*  </Markdown>*/}
                {/*</SubNode>*/}
              </div>
            )}

            {data.type === "function" && <div>function: null</div>}

            <div className={"flex gap-2 items-center"}>
              {/*<Pencil2Icon />*/}

              <PlusCircledIcon
                onClick={async () => {
                  const id = v4()
                  addNodes([
                    {
                      id,
                      position: {
                        x: xPos,
                        y: yPos + 100,
                      },
                      type: NodeType.agent,
                      data: {
                        title: "sample title",
                        type: "prompt",
                        // content: "sample content",
                        source: [],
                        target: [],
                        tickToRun: node.data.tickToRun + 1,
                        expanded: true,
                        input: "",
                      },
                    },
                  ])
                  addEdges([
                    {
                      id: v4(),
                      source: agentId,
                      target: id,
                    },
                  ])
                }}
              />

              <MinusCircledIcon
                onClick={async () => {
                  console.log(`-- deleting agent(id=${agentId})`)
                  // 删除结点的时候，不要用 deleteElements，而用 setNodes / setEdges, ref: https://stackoverflow.com/questions/68698247/how-to-delete-a-element-in-react-flow-while-clicking-on-delete-button
                  setNodes((nodes) => nodes.filter(({ id }) => id !== agentId))
                  setEdges((edges) =>
                    edges.filter(
                      ({ source, target }) =>
                        source !== agentId && target !== agentId,
                    ),
                  )
                }}
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Handle type="target" position={Position.Top} />

      <Handle type="source" position={Position.Bottom} id="a" />
    </>
  )
}
