import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IconContainer } from "@/components/icon"
import { MenuIcon } from "lucide-react"
import {
  DownloadIcon,
  EraserIcon,
  EyeClosedIcon,
  EyeOpenIcon,
  RocketIcon,
} from "@radix-ui/react-icons"
import { produce } from "immer"
import { DiagramOutputFunction } from "@/components/diagram-output-function"
import { toast } from "sonner"
import React from "react"
import { useMessages } from "@/hooks/use-messages"
import { useDiagramController } from "@/hooks/use-diagram-controller"

export default function DiagramSettings({ setNodes }) {
  const { setMessages } = useMessages()
  const { setPeriods, setTicks, setTerminalOpen, terminalOpen } =
    useDiagramController()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <IconContainer>
          <MenuIcon className={"w-4 h-4"} />
        </IconContainer>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem
            className={"gap-2"}
            onClick={() => {
              setPeriods(0)
              setTicks(0)
              setMessages([])
              setNodes((nodes) =>
                produce(nodes, (nodes) => {
                  nodes.forEach((node) => {
                    node.data.input = ""
                    node.data.output = ""
                  })
                }),
              )
            }}
          >
            <EraserIcon />
            重置会话
          </DropdownMenuItem>

          <DiagramOutputFunction />
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            className={"gap-2"}
            onClick={() => {
              toast.success("todo: 部署成功！")
            }}
          >
            <RocketIcon />
            一键部署
          </DropdownMenuItem>

          <DropdownMenuItem className={"gap-2"}>
            <DownloadIcon />
            本地存储
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className={"gap-2"}
            onClick={() => {
              setTerminalOpen((v) => !v)
            }}
          >
            {terminalOpen ? (
              <>
                <EyeClosedIcon />
                关闭调试
              </>
            ) : (
              <>
                <EyeOpenIcon />
                开启调试
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
