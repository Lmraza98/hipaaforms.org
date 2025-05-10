import { router, publicProcedure } from './trpc';
// import { exampleRouter } from './routers/example'; // Example router

export const appRouter = router({
  // example: exampleRouter, // Add your routers here
  healthcheck: publicProcedure.query(() => 'yay!'),
});

export type AppRouter = typeof appRouter; 