import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/server/trpc/routers'; // Using relative path

export const trpc = createTRPCReact<AppRouter>(); 