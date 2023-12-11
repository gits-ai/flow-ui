"use client"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useEffect } from "react"
import { usePersistedUserId } from "@/hooks/use-user"
import { api } from "@/trpc/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import RootLayout from "@/components/layout-root"
import { Label } from "@/components/ui/label"
import { Container } from "@/components/container"
import { useHasHydrated } from "@/hooks/use-has-hydrated"
import { IconContainer } from "@/components/icon"
import { DeleteIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function DiagramsIndexPage() {
  const { userId, setUserId } = usePersistedUserId()

  /**
   * components
   */
  const router = useRouter()
  const utils = api.useContext()
  const { data: diagrams } = api.diagram.list.useQuery(
    { where: { userId }, orderBy: { createdAt: "desc" } },
    { enabled: !!userId },
  )
  const addDiagram = api.diagram.add.useMutation({
    onSuccess: (data) => {
      void router.push(`/diagram/${data.id}`)
    },
  })

  const delDiagram = api.diagram.del.useMutation({
    onSuccess: (data) => {
      toast.success(`deleted Diagram(id=${data.id})`)
      void utils.diagram.list.invalidate()
    },
  })

  const hydrated = useHasHydrated()

  if (!hydrated || !userId) return

  return (
    <Container orientation={"vertical"} className={"p-4 gap-4"}>
      <Label className={"text-lg"}>Projects</Label>

      <div className="gap-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 overflow-auto">
        <Card
          className={"cursor-pointer"}
          onClick={() => {
            addDiagram.mutate({
              data: { user: { connect: { id: userId } } },
            })
          }}
        >
          <CardHeader>
            <CardTitle>Create</CardTitle>
            <CardContent>Create A New Project</CardContent>
          </CardHeader>
        </Card>

        {!diagrams
          ? "loading..."
          : diagrams.map((diagram) => (
              <Card key={diagram.id}>
                <CardHeader>
                  <CardTitle>{diagram.title}</CardTitle>
                </CardHeader>

                <CardContent>
                  <div>nodes: {diagram.flowData?.nodes.length}</div>
                  <div>edges: {diagram.flowData?.nodes.length}</div>
                </CardContent>

                <CardFooter className={"gap-2 "}>
                  <Link href={`/diagram/${diagram.id}`}>
                    <Button>Edit</Button>
                  </Link>

                  <Link href={`/diagram/${diagram.id}/threads`}>
                    <Button variant={"secondary"}>Threads</Button>
                  </Link>

                  <Button
                    variant={"outline"}
                    onClick={() => {
                      delDiagram.mutate({ where: { id: diagram.id } })
                    }}
                  >
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
      </div>
    </Container>
  )
}
