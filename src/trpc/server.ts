import {
  createTRPCProxyClient,
  loggerLink,
  unstable_httpBatchStreamLink,
} from "@trpc/client"
import { cookies } from "next/headers"

import { type AppRouter } from "@/server/api/root"
import { getUrl, logEnabled, transformer } from "./shared"

export const api = createTRPCProxyClient<AppRouter>({
  transformer,
  links: [
    loggerLink({
      enabled: logEnabled,
    }),
    unstable_httpBatchStreamLink({
      url: getUrl(),
      headers() {
        return {
          cookie: cookies().toString(),
          "x-trpc-source": "rsc",
        }
      },
    }),
  ],
})
