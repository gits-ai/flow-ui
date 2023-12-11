export type FetchAgentEventType =
  | "done"
  | "onTickUpdate"
  | "onNodeInputUpdate"
  | "onNodeOutputUpdate"
  | "onMessageResponse"
type FetchAgentEventWithoutData<T extends FetchAgentEventType> = {
  event: T
}
type FetchAgentEventWithData<T extends FetchAgentEventType> = {
  event: T
  data: {
    id: string
    content: string
  }
}
export type FetchAgentEventMessage =
  | FetchAgentEventWithoutData<"done">
  | FetchAgentEventWithoutData<"onTickUpdate">
  | FetchAgentEventWithData<"onNodeInputUpdate">
  | FetchAgentEventWithData<"onNodeOutputUpdate">
  | FetchAgentEventWithData<"onMessageResponse">
