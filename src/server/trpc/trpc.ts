import { initTRPC, TRPCError } from '@trpc/server';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import superjson from 'superjson';
import { ZodError } from 'zod';
// import { NextRequest } from 'next/server'; // No longer explicitly needed here unless used elsewhere

// Imports for NextAuth.js session
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth'; // Import authOptions from the new location
import type { Session } from 'next-auth'; // To type the session object

// Updated User interface to align with NextAuth session user
// and your src/types/next-auth.d.ts
interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null; // Assuming Role is a string or enum stringified
  organizationId?: string | null;
  // Add other properties from your NextAuth session.user if needed
}

// This is the context that will be available to your procedures
export interface TrpcContext {
  user: User | null;
  session: Session | null; // Optionally pass the full session
  // req?: Request; // req is available via opts in createContext if needed directly
}

/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint when using fetchRequestHandler.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createContext = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _opts: FetchCreateContextFnOptions // opts are provided by fetchRequestHandler, but not used directly here
): Promise<TrpcContext> => {
  // const { req } = _opts; // req is not directly used if getServerSession(authOptions) is sufficient

  // Get the session from NextAuth.js
  // For App Router, getServerSession(authOptions) should pick up session from request context (cookies).
  const session = await getServerSession(authOptions);

  // console.log("Session in createContext:", session); // For debugging

  let userToContext: User | null = null;
  if (session?.user) {
    userToContext = {
      id: session.user.id, // id is standard on session.user
      name: session.user.name, // name is standard
      email: session.user.email, // email is standard
      image: session.user.image, // image is standard
      // Access augmented properties safely, assuming your next-auth.d.ts is set up
      role: session.user.role ?? null,
      organizationId: session.user.organizationId ?? null,
    };
  }
  
  // console.log("User in tRPC context:", userToContext); // For debugging

  return {
    user: userToContext,
    session: session, // You can also pass the full session object if needed in procedures
    // req, // Pass the req object if it's needed by any procedure
  };
};

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<TrpcContext>().create({ // Use TrpcContext here
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;

/**
 * Reusable middleware to ensure
 * users are logged in
 */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      // infers the `user` as non-nullable
      user: ctx.user,
    },
  });
});

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed); 