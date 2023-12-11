"use client"

import { IconContainer } from "@/components/icon"
import { clsx } from "clsx"
import {
  LayersIcon,
  PauseIcon,
  PlayIcon,
  StopIcon,
} from "@radix-ui/react-icons"
import React from "react"
import { useDiagramController } from "@/hooks/use-diagram-controller"
import DiagramSettings from "@/components/diagram-settings"
import Link from "next/link"
import { SetAppNodes } from "@/types/diagram-node"

export default function DiagramControllers({
  targetLink,
  setNodes,
}: {
  targetLink: string
  setNodes?: SetAppNodes
}) {
  const { setDiagramState, enableStates } = useDiagramController()

  const activeCSS = "text-green-500 border-green-500"
  const inactive2CSS = "text-red-700/50 border-red-700/50"
  const inactive1CSS = "text-slate-500 border-slate-500"

  const enablePlay = enableStates(["preparing", "paused", "stopped"])
  const enablePause = enableStates(["running"])
  const enableStop = enableStates(["running", "paused"])

  return (
    <>
      <div className={"grow flex items-center justify-center gap-2"}>
        {setNodes && (
          // 图表页面有控制按钮
          <>
            <IconContainer
              className={clsx(enablePlay ? activeCSS : inactive1CSS)}
              onClick={() => {
                if (enablePlay) {
                  setDiagramState("running")
                }
              }}
            >
              <PlayIcon />
            </IconContainer>

            <IconContainer
              className={clsx(enablePause ? activeCSS : inactive2CSS)}
              onClick={() => {
                if (enablePause) setDiagramState("paused")
              }}
            >
              <PauseIcon />
            </IconContainer>

            <IconContainer
              className={clsx(enableStop ? activeCSS : inactive2CSS)}
              onClick={() => {
                if (enableStop) setDiagramState("stopped")
              }}
            >
              <StopIcon />
            </IconContainer>
          </>
        )}
      </div>

      <div className={"shrink-0 flex items-center gap-2"}>
        <Link href={targetLink}>
          <IconContainer>
            <LayersIcon />
          </IconContainer>
        </Link>

        <DiagramSettings setNodes={setNodes} />
      </div>
    </>
  )
}
