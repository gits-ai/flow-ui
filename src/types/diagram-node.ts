import { Node } from "reactflow"
import { LLM } from "@/types/llm"
import { Dispatch, SetStateAction } from "react"

export enum NodeType {
  agent = "agent",
}

type NodeDataBase = {
  expanded: boolean
  title: string

  // 哪一步跑的，可以使用动态建图，也可以静态
  // 动态时，undefined时表示还没有跑
  // 但我们还是最好静态建图，直接确定每个结点在哪一个周期跑
  tickToRun: number

  source: string[]
  target: string[]
}

export type PromptNodeData = NodeDataBase & {
  type: "prompt"
  llm?: LLM
  prompt?: {
    content?: string
  }
}

export type FunctionNodeData = NodeDataBase & {
  type: "function"
}

export type NodeData = PromptNodeData | FunctionNodeData

export type ClientNodeData = NodeData & {
  input?: string
  output?: string
}
export type AppNode = Node<ClientNodeData>
export type SetAppNodes = Dispatch<SetStateAction<AppNode[]>>
