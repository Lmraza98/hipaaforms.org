import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/api/root';
import { prisma } from '@/server/db';
import { getServerSession } from 'next-auth';

export const createTRPCContext = async (opts: { headers: Headers }) => {
  // If you need to use a session, you can add it here
  const session = await getServerSession();
  return {
    prisma,
    session,
    ...opts,
  };
};

export const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ headers: req.headers }), // Pass headers to context
    onError:
      process.env.NODE_ENV === 'development'
        ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? ''}: ${error.message}`,
          );
        }
        : undefined,
  });