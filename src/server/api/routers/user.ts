import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import {
  UserCreateArgsSchema,
  UserFindUniqueArgsSchema,
} from "../../../../prisma/generated/zod"

export const userRouter = createTRPCRouter({
  get: publicProcedure
    .input(UserFindUniqueArgsSchema)
    .query(({ input, ctx: { db } }) => {
      return db.user.findUnique(input)
    }),

  creating: publicProcedure
    .input(UserCreateArgsSchema)
    .mutation(({ input, ctx: { db } }) => {
      return db.user.create(input)
    }),
})
