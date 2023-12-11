import { api } from "@/trpc/server"
import buildDiagram from "@/utils/build-diagram"
import { max } from "lodash"
import { ChatCompletionMessageParam } from "openai/resources/chat/completions"
import { serverFetchOpenAI } from "@/utils/fetch-openai"
import { $Enums } from ".prisma/client"
import { FetchAgentEventMessage } from "@/types/diagram-data-transfer"
import { NextRequest } from "next/server"
import RunningStatus = $Enums.RunningStatus

export type GetAgentParams = {
  threadId: string
}

export type PostAgentBody = {
  diagramId: string
  messages: ChatCompletionMessageParam[]
}

interface Endpoint {
  onWrote(data: FetchAgentEventMessage): void
}

type ThreadContext = {
  events: FetchAgentEventMessage[]
  endpoints: Endpoint[]
}

class EventsManager {
  private manager: Record<string, ThreadContext> = {}

  public async trigger(data: PostAgentBody & GetAgentParams) {
    const { threadId, diagramId, messages } = data
    this.manager[threadId] = { events: [], endpoints: [] }

    const sendClient = async (eventMessage: FetchAgentEventMessage) => {
      this.manager[threadId]!.events.push(eventMessage)
      this.manager[threadId]!.endpoints.forEach((endpoint) => {
        endpoint.onWrote(eventMessage)
      })
    }

    const send = async (eventMessage: FetchAgentEventMessage) => {
      await sendClient(eventMessage)

      await api.thread.update.mutate({
        where: { id: threadId },
        data: {
          events: {
            push: eventMessage,
          },
        },
      })
    }

    const clean = async (status: RunningStatus, reason?: string) => {
      await sendClient({ event: "done" })
      await api.thread.update.mutate({
        where: { id: threadId },
        data: {
          status,
          reason,
        },
      })
      delete this.manager[threadId]
    }

    const triggerNode = async ({
      id,
      input,
    }: {
      id: string
      input: string
    }) => {
      const node = nodes.find((node) => node.id === id)!
      console.log(
        `-- ✅ triggered Node(title=${node.data.title}, input=${input})`,
      )
      // 目前只支持 prompt 类别结点
      if (node.data.type !== "prompt")
        return console.log("-- passed since not prompt")

      // 更新结点的输入
      await send({ event: "onNodeInputUpdate", data: { id, content: input } })

      // 组合新的 messages
      const askMessages: ChatCompletionMessageParam[] = [
        ...baseMessages,
        { content: input, role: "user" },
      ]

      // 加入 system prompt
      if (node.data.prompt?.content)
        askMessages.splice(0, 0, {
          content: node.data.prompt.content,
          role: "system",
        })

      let tokens = ""
      const model = node.data.llm?.body?.model ?? "gpt-3.5-turbo"
      const stream = await serverFetchOpenAI({
        apiBase: node.data.llm?.headers?.apiBase,
        apiKey: node.data.llm?.headers?.apiKey,
        data: {
          model,
          messages: askMessages,
        },
      })

      for await (const chunk of stream) {
        const token = chunk.choices[0]?.delta?.content || ""
        // console.log("-- token: ", token)
        tokens += token
        await send({
          event: "onNodeOutputUpdate",
          data: { id, content: tokens },
        })
      }
      node.data.output = tokens
      console.log("-- tokens: ", tokens)

      // 更新 message 的 node
      if (node.data.target.length === 0) {
        await send({
          event: "onMessageResponse",
          data: { id, content: tokens },
        })
      }

      await new Promise((r) => setTimeout(r, 1000))
    }

    const baseMessages = messages.slice(0, messages.length - 1)
    const lastMessage = messages[messages.length - 1]!

    if (!lastMessage) return clean(RunningStatus.Error, "no last message found")

    if (lastMessage.role !== "user")
      return clean(RunningStatus.Error, "last message not user's")

    if (lastMessage.content === null)
      return clean(RunningStatus.Error, "last message content null")

    let input = lastMessage.content!
    const diagram = await api.diagram.get.query({ where: { id: diagramId } })
    const initialNodes = diagram?.flowData.nodes ?? []
    const edges = diagram?.flowData.edges ?? []
    // 生成 nodes 的 tick
    const nodes = buildDiagram({ nodes: initialNodes, edges })

    const maxTicks: number = max(nodes.map((node) => node.data.tickToRun))! // nodes 不为空，所以 max 返回 number

    for (let i = 1; i <= maxTicks; ++i) {
      console.log(`-- running tick [${i}/${maxTicks}]`)
      await send({ event: "onTickUpdate" })

      // 要基于最新的nodes
      // 遍历每个起始结点，并运行
      for (const node of nodes.filter((node) => node.data.tickToRun == i)) {
        // 如果有父节点，则从从父结点列表中获取（等价表达：i > 1）
        // todo: Multi-InputNodes Packer
        if (node.data.source.length)
          input = node.data.source
            .map(
              (fromId) => nodes.find((node) => node.id === fromId)!.data.output,
            )
            .join("\n\n")

        // console.log("-- nextStep: ", { id, initialFromIds, inputs, nodes })
        await triggerNode({
          id: node.id,
          input,
        })
      }
    }

    await clean(RunningStatus.Finished)

    console.log("-- call SSE ✅")
  }

  /**
   * 法一：先从数据库读，再从内存里接上
   *
   * 法二：没完成则从内存中读，否则从数据库里读
   * @param params
   */
  public async read(threadId: string | null) {
    let responseStream = new TransformStream()
    const writer = responseStream.writable.getWriter()
    const encoder = new TextEncoder()

    const send = async (eventMessage: FetchAgentEventMessage) => {
      if (eventMessage.event === "done") return writer.close()

      const eventMessageStr =
        eventMessage.event === "onTickUpdate"
          ? `event: ${eventMessage.event}\n\n`
          : `event: ${eventMessage.event}\ndata: ${JSON.stringify(
              eventMessage.data,
            )}\n\n`

      console.log(`-- sending: ${eventMessageStr.replace(/\n/g, "\\n")}`)
      await writer.write(encoder.encode(eventMessageStr))
    }

    class Endpoint implements Endpoint {
      public async onWrote(data: FetchAgentEventMessage) {
        await send(data)
      }
    }

    const buildStream = async () => {
      if (threadId) {
        const endpoint = new Endpoint()

        if (threadId in this.manager) {
          for (const eventMessage of this.manager[threadId]!.events)
            await send(eventMessage)
          this.manager[threadId]!.endpoints.push(endpoint)
        } else {
          const threadInDB = await api.thread.get.query({
            where: { id: threadId },
          })
          // 理论上肯定有数据
          if (threadInDB) {
            for (const data of threadInDB.events) await send(data)
          }
          await writer.close()
        }
      }
    }

    buildStream()

    return new Response(responseStream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        Connection: "keep-alive",
        "Cache-Control": "no-cache, no-transform",
      },
    })
  }
}

const streamManager = new EventsManager()

export async function POST(req: Request) {
  const body = (await req.json()) as PostAgentBody
  const { diagramId, messages } = body
  const { id: threadId } = await api.thread.add.mutate({
    data: { diagram: { connect: { id: diagramId } }, context: messages },
  })
  void streamManager.trigger({ ...body, threadId })
  return Response.json({ threadId })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  console.log("-- GET: ", searchParams)
  return streamManager.read(searchParams.get("t"))
}
