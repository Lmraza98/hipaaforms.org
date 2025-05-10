import { protectedProcedure, router } from "../trpc";

export const pingRouter = router({
  ping: protectedProcedure.query(({ ctx }) => {
    // ctx.user is guaranteed to be non-null here due to protectedProcedure
    return {
      message: "pong",
      user: ctx.user,
    };
  }),
}); 