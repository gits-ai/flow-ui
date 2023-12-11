import { Metadata } from "next"

import version from "@/../version.json"

export const APP_VERSION = `Alpha-0.0.${version.commits}`

export const baseMetadata: Metadata = {
  title: "GITS",
  description: "Author: MarkShawn2020",
  icons: [{ rel: "icon", url: "/gits.ico" }],
}
