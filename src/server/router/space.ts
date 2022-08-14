import { createProtectedRouter } from "./protected-router";
import { z } from "zod";

export const spaceRouter = createProtectedRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.space.findMany({
        where: { userId: ctx.session.user.id },
        select: { id: true, name: true, amount: true, goal: true },
      });
    },
  })
  .mutation("addSpace", {
    input: z.object({
      userId: z.string(),
      name: z.string(),
      amount: z.number(),
      goal: z.number().nullish(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.space.create({ data: input });
    },
  })
  .mutation("deleteSpace", {
    input: z.string(),
    async resolve({ ctx, input }) {
      return await ctx.prisma.space.delete({ where: { id: input } });
    },
  });
