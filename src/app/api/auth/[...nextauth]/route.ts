import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth'; // Import authOptions from the new location
import { DefaultSession } from 'next-auth'; // Keep for declare module
import { DefaultJWT } from 'next-auth/jwt';   // Keep for declare module
import { Role } from '@prisma/client';      // Keep for declare module (Role is used in Session & JWT type augmentations)

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// TypeScript module augmentations for NextAuth.js session and JWT
// These define the shape of the session and token, including custom properties.
// Ideally, these would live in a dedicated next-auth.d.ts file in the src root.

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      organizationId?: string | null;
      role?: Role | null; // Prisma's Role enum
    } & DefaultSession['user']; // Extends default user properties (name, email, image)
  }

  // The User interface was previously commented out as it was empty.
  // If you need to add custom properties directly to the NextAuth User object
  // (e.g., returned by an OAuth provider's profile function or the authorize callback),
  // you can declare them here, extending DefaultUser.
  // interface User extends DefaultUser {
  //   organizationId?: string | null;
  //   role?: Role | null;
  // }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    organizationId?: string | null;
    role?: Role | null; // Prisma's Role enum
    // sub is already part of DefaultJWT (usually the user's ID)
  }
} 