"use client"

import { ReactFlowProvider } from "reactflow"
import { PropsWithChildren } from "react"

export default function DiagramProvider({ children }: PropsWithChildren) {
  return <ReactFlowProvider>{children}</ReactFlowProvider>
}
