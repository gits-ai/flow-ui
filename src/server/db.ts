import { Prisma, PrismaClient } from "@prisma/client"

import { env } from "@/env.mjs"
import LogLevel = Prisma.LogLevel
import LogDefinition = Prisma.LogDefinition
import { LOG_PRISMA_ENABLED } from "@/config/log"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const log: (LogLevel | LogDefinition)[] = LOG_PRISMA_ENABLED
  ? // 开启LOG控制后，使用标准LOG模式
    env.NODE_ENV === "development"
    ? ["query", "error", "warn"]
    : ["error"]
  : // 无论开不开启LOG控制，error 始终汇报
    ["error"]

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log,
  })

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db
