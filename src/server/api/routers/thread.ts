import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import {
  ThreadCreateArgsSchema,
  ThreadDeleteArgsSchema,
  ThreadFindManyArgsSchema,
  ThreadFindUniqueArgsSchema,
  ThreadUpdateArgsSchema,
} from "../../../../prisma/generated/zod"

export const threadRouter = createTRPCRouter({
  list: publicProcedure
    .input(ThreadFindManyArgsSchema)
    .query(({ input, ctx: { db } }) => {
      return db.thread.findMany(input)
    }),

  add: publicProcedure
    .input(ThreadCreateArgsSchema)
    .mutation(async ({ input, ctx: { db } }) => {
      return db.thread.create(input)
    }),

  del: publicProcedure
    .input(ThreadDeleteArgsSchema)
    .mutation(async ({ input, ctx: { db } }) => {
      return db.thread.delete(input)
    }),

  get: publicProcedure
    .input(ThreadFindUniqueArgsSchema)
    .query(({ input, ctx: { db } }) => {
      return db.thread.findUnique(input)
    }),

  update: publicProcedure
    .input(ThreadUpdateArgsSchema)
    .mutation(async ({ ctx: { db }, input }) => {
      return db.thread.update(input)
    }),
})
