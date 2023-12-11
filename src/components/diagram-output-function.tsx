import { useAppNodes } from "@/hooks/use-app-react-flow"
import React, { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Editor from "@monaco-editor/react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { clsx } from "clsx"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { FunctionSquareIcon } from "lucide-react"
import { useMergeLeavesScript } from "@/hooks/use-merge-script"

export const DiagramOutputFunction = () => {
  const { mergeLeavesScript, setMergeLeavesScript, resetMergeLeavesScript } =
    useMergeLeavesScript()

  const nodes = useAppNodes()
  const leaves = nodes.filter((node) => !node.data.target?.length)

  let scriptOk = true
  let output = ""
  try {
    output = Function("return (" + mergeLeavesScript + ")")()(leaves).toString()
  } catch (e) {
    scriptOk = false
    console.error(e)
    // if("message" in e as unknown as { message: string }) output = e.message
    output = String(e)
  }

  // console.log("-- eval: ", { leaves, mergeLeavesScript, output })

  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          className={"gap-2"}
          onSelect={(event) => {
            event.preventDefault() // ref: https://github.com/radix-ui/primitives/issues/1836#issuecomment-1674338372
          }}
        >
          <FunctionSquareIcon className={"w-4 h-4"} />
          输出函数
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent className={"p-12 max-w-[80vw]"}>
        <Label>Leaves</Label>
        {
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
              {leaves.map((node) => (
                <TableRow key={node.id}>
                  <TableCell className="font-medium">{node.id}</TableCell>
                  <TableCell>{node.data.title}</TableCell>
                  <TableCell>{node.data.input}</TableCell>
                  <TableCell>{node.data.output}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        }

        <Label>Function</Label>
        <Editor
          height="400px"
          defaultLanguage="javascript"
          value={mergeLeavesScript}
          onChange={(value, ev) => {
            console.log("-- onChange: ", { value, ev })
            if (!value) return

            setMergeLeavesScript(value)
          }}
          options={{
            // ref: https://stackoverflow.com/a/77398242/9422455
            minimap: {
              enabled: false,
            },
          }}
        />

        <div className={"gap-2 grid grid-cols-2"}>
          <Button
            onClick={() => {
              if (!scriptOk) return toast.error("输出函数执行出错")

              setDialogOpen(false)
            }}
          >
            确认
          </Button>
          <Button variant={"destructive"} onClick={resetMergeLeavesScript}>
            重置
          </Button>
        </div>

        {/*<Label>Operators</Label>*/}
        {/*<Button>Run</Button>*/}

        <Label>Output {scriptOk ? "✅" : "❌"}</Label>
        <div
          className={clsx(
            "whitespace-pre-wrap border  p-2",
            !scriptOk && "text-red-400",
          )}
        >
          {output}
        </div>
      </DialogContent>
    </Dialog>
  )
}
