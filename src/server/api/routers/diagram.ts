import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import {
  DiagramCreateArgsSchema,
  DiagramDeleteArgsSchema,
  DiagramFindManyArgsSchema,
  DiagramFindUniqueArgsSchema,
  DiagramUpdateArgsSchema,
} from "../../../../prisma/generated/zod"

export const diagramRouter = createTRPCRouter({
  list: publicProcedure
    .input(DiagramFindManyArgsSchema)
    .query(({ input, ctx: { db } }) => {
      return db.diagram.findMany(input)
    }),

  add: publicProcedure
    .input(DiagramCreateArgsSchema)
    .mutation(async ({ input, ctx: { db } }) => {
      return db.diagram.create(input)
    }),

  del: publicProcedure
    .input(DiagramDeleteArgsSchema)
    .mutation(async ({ input, ctx: { db } }) => {
      return db.diagram.delete(input)
    }),

  get: publicProcedure
    .input(DiagramFindUniqueArgsSchema)
    .query(({ input, ctx: { db } }) => {
      return db.diagram.findUnique(input)
    }),

  update: publicProcedure
    .input(DiagramUpdateArgsSchema)
    .mutation(async ({ ctx: { db }, input }) => {
      return db.diagram.update(input)
    }),
})
