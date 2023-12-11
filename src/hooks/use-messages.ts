import { createBearStore } from "@/utils/create-bear-store"
import { ChatCompletionMessageParam } from "openai/resources/chat/completions"
import { useCallback } from "react"

export type Message = ChatCompletionMessageParam & { id: string }
export const useMessagesBear = createBearStore<Message[]>()("messages", [])
export const useMessages = () => {
  const { messages, setMessages } = useMessagesBear()

  const addMessage = useCallback(
    (message: Message) => {
      setMessages((messages) => [...messages, message])
    },
    [messages],
  )

  const extendMessage = useCallback(
    ({ id, content }: { id: string; content: string }) => {
      setMessages((messages) => {
        const message = messages.find((m) => m.id === id)
        console.log("-- extendMessage: ", { messages, message, id, content })
        if (!message) return
        if (message.content === null) message.content = content
        else message.content += content
      })
    },
    [messages],
  )

  const updateMessage = useCallback(
    ({ id, content }: { id: string; content: string }) => {
      setMessages((messages) => {
        const message = messages.find((m) => m.id === id)
        // console.log("-- extendMessage: ", { messages, message, id, content })
        if (!message) return
        message.content = content
      })
    },
    [messages],
  )

  return {
    messages,
    setMessages,
    addMessage,
    extendMessage,
    updateMessage,
  }
}
