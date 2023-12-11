import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import React, { ReactNode } from "react"
import { Container } from "@/components/container"

import { APP_VERSION, baseMetadata } from "@/config/app"

export default function RootLayout({
  navbarChildren,
  children,
}: {
  navbarChildren?: ReactNode
  children?: ReactNode
}) {
  return (
    <Container orientation={"vertical"}>
      <div className={"w-full flex items-center p-2 gap-2"}>
        <div className={"shrink-0 flex items-center gap-2"}>
          <Link href={"/"}>{baseMetadata.title as string}</Link>
          <Badge variant={"outline"}>{APP_VERSION}</Badge>
        </div>

        {navbarChildren}
      </div>

      <div className={"w-full grow overflow-hidden"}>{children}</div>
    </Container>
  )
}
