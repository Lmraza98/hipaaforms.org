import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import { Role } from "@prisma/client"; // Assuming Role enum is exported from your Prisma client

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: Role | null; // Or string, depending on what you put in the token
      organizationId?: string | null;
    } & DefaultSession["user"]; // Extend existing user properties
  }

  // Extend the User model if you need to add properties directly to it
  // interface User extends DefaultUser {
  //   role?: Role | null;
  //   organizationId?: string | null;
  // }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role?: Role | null; // Or string
    organizationId?: string | null;
    // sub is already part of DefaultJWT as string | undefined, 
    // we ensure it's string in the jwt callback if user.id exists.
  }
} 