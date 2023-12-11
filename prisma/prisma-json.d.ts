/**
 * 该文件写法参考：https://www.npmjs.com/package/prisma-json-types-generator#using-it
 */

export {}

declare global {
  import { FetchAgentEventMessage } from "@/types/diagram-data-transfer"
  import { ClientEdgeData } from "@/types/diagram-edge"
  import { ClientNodeData } from "@/types/diagram-node"
  import { ReactFlowJsonObject } from "reactflow"
  import { ChatCompletionMessageParam } from "openai/resources/chat/completions"

  namespace PrismaJson {
    // todo: better AgentEdge
    type Diagram = ReactFlowJsonObject<ClientNodeData, ClientEdgeData>

    type SSEEvent = FetchAgentEventMessage

    type OpenAIMessage = ChatCompletionMessageParam
  }
}
