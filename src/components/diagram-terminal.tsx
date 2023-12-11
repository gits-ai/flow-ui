"use client"

import { useDiagramController } from "@/hooks/use-diagram-controller"
import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAppNodes } from "@/hooks/use-app-react-flow"

export default function DiagramTerminal() {
  const { terminalOpen } = useDiagramController()
  const nodes = useAppNodes()

  if (!terminalOpen) return null

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Input</TableHead>
          <TableHead>Output</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {nodes.map((node) => (
          <TableRow key={node.id}>
            <TableCell className="font-medium">{node.id}</TableCell>
            <TableCell>{node.data.title}</TableCell>
            <TableCell>{node.data.input}</TableCell>
            <TableCell>{node.data.output}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
