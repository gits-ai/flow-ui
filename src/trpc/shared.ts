import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server"
import superjson from "superjson"

import { type AppRouter } from "@/server/api/root"
import { env } from "@/env.mjs"
import { LOG_TRPC_ENABLED } from "@/config/log"

export const transformer = superjson

function getBaseUrl() {
  if (typeof window !== "undefined") return ""
  if (env.HOST_URL) return env.HOST_URL // 在云端环境变量手动指定 url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT ?? 3000}`
}

export function getUrl() {
  return getBaseUrl() + "/api/trpc"
}

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>

export const logEnabled = (op) =>
  LOG_TRPC_ENABLED &&
  (process.env.NODE_ENV === "development" ||
    (op.direction === "down" && op.result instanceof Error))
