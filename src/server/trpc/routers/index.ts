import { router } from '../trpc';
import { pingRouter } from './ping';
import { formRouter } from './form';

export const appRouter = router({
  ping: pingRouter, // All procedures under /ping will be prefixed with `ping.`
  form: formRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter; 