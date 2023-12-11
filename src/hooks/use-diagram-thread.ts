import { WritableDraft } from "@/types/immer"
import { AppNode } from "@/types/diagram-node"
import { produce } from "immer"
import { v4 } from "uuid"
import { fetchEventSource } from "@microsoft/fetch-event-source"
import { FetchAgentEventMessage } from "@/types/diagram-data-transfer"
import { useMessages } from "@/hooks/use-messages"
import { useDiagramController } from "@/hooks/use-diagram-controller"

export default function useDiagramThread({ setNodes }) {
  const { setTicks, setPeriods } = useDiagramController()
  const { addMessage, extendMessage } = useMessages()

  const mutateNode =
    (id: string) => (func: (node: WritableDraft<AppNode>) => void) => {
      setNodes((nodes) => {
        return produce(nodes, (nodes) => {
          func(nodes.find((node) => node.id === id)!)
        })
      })
    }

  const updateThread = async (threadId) => {
    console.log(`-- updating thread(id=${threadId})`)

    const resId = v4()
    addMessage({ id: resId, content: null, role: "assistant" })
    setTicks(0)

    await fetchEventSource(`/api/agent?t=${threadId}`, {
      method: "GET",
      onmessage: (message) => {
        // console.log("-- onMessage: ", message)

        const eventMessage = (
          message.event === "onTickUpdate"
            ? {
                event: "onTickUpdate",
              }
            : {
                event: message.event,
                data: JSON.parse(message.data),
              }
        ) as FetchAgentEventMessage

        switch (eventMessage.event) {
          case "onTickUpdate":
            setTicks((ticks) => ticks + 1)
            break

          case "onNodeInputUpdate":
            mutateNode(eventMessage.data.id)((node) => {
              node.data.input = eventMessage.data.content
            })
            break

          case "onNodeOutputUpdate":
            mutateNode(eventMessage.data.id)((node) => {
              node.data.output = eventMessage.data.content
            })
            break

          case "onMessageResponse":
            extendMessage({
              id: resId,
              content: `[${eventMessage.data.id}]: ${eventMessage.data.content}\n`,
            })
            break

          default:
            console.error("undefined type: ", message.event)
            break
        }
      },

      onclose() {
        // console.warn("-- Connection Closed by the Server")
      },

      onerror(err) {
        console.warn("-- There was an error from the Server!", err)
        // rethrow to stop the operation
        // or do nothing to automatically retry
        throw err
      },
    })

    setTicks((ticks) => ticks + 1)
    setPeriods((v) => v + 1)
  }

  return {
    updateThread,
  }
}
