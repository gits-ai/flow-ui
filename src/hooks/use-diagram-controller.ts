import { createBearStore } from "@/utils/create-bear-store"
import { useCallback } from "react"

export type DiagramState = "preparing" | "running" | "paused" | "stopped"

const useDiagramStateBear = createBearStore<DiagramState>()(
  "diagramState",
  "preparing",
  true,
)

// 会话周期
const usePeriodsBear = createBearStore<number>()("periods", 0)
// 运行结点周期：每个tick会触发多个入度为0的结点跑
const useTicksBear = createBearStore<number>()("ticks", 0)

const useTerminalOpenBear = createBearStore<boolean>()(
  "terminalOpen",
  true,
  true,
)

export const useDiagramController = () => {
  const { diagramState } = useDiagramStateBear()

  const enableStates = useCallback(
    (vs: DiagramState[]) => vs.includes(diagramState),
    [diagramState],
  )

  const isRunning = enableStates(["running", "paused"])

  return {
    ...useDiagramStateBear(),
    ...usePeriodsBear(),
    ...useTicksBear(),
    ...useTerminalOpenBear(),

    enableStates,
    isRunning,
  }
}

/**
 *
 * @param a {}
 */
const f = (a: string) => {
  return 1
}
