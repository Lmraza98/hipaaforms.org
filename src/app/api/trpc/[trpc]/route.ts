import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { type NextRequest } from 'next/server';

import { appRouter } from '@/server/trpc/routers';
import { createContext } from '@/server/trpc/trpc';

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a HTTP request context.
 */
const createContextHandler = async (req: NextRequest) => {
  // Create context based on incoming request
  // We don't have the `res` object here as in pages router, but fetchRequestHandler handles it
  return createContext({ req, resHeaders: req.headers });
};

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createContext,
    onError:
      process.env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? 'unknown path'}: ${error.message}`,
            );
          }
        : undefined,
  });

export { handler as GET, handler as POST };

// Optionally, you can set the runtime to edge for better performance
// export const runtime = "edge"; 