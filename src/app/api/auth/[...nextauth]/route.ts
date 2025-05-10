import NextAuth, { type NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import EmailProvider from 'next-auth/providers/email';
import { PrismaClient, Role } from '@prisma/client'; // Updated import path, Added Role
import bcrypt from 'bcrypt'; // Import bcrypt
// If your prisma client is in a different location, adjust the import path above.
// For example, if it is in src/generated/prisma:
// import { PrismaClient } from '@/generated/prisma'; 
// Or if your tsconfig has paths setup for @/lib or similar:
// import { prisma } from '@/lib/prisma';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'jsmith@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          console.log('Missing credentials');
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          // If user not found, or user does not have a password (e.g., signed up via OAuth)
          console.log('User not found or no password set for user:', credentials.email);
          return null;
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValidPassword) {
          console.log('Invalid password for user:', credentials.email);
          return null;
        }

        console.log('Credentials valid for user:', credentials.email);
        // Return the user object without the password hash
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      // console.log("JWT callback - user:", JSON.stringify(user, null, 2));
      // console.log("JWT callback - initial token:", JSON.stringify(token, null, 2));

      // If user object exists (e.g., on sign-in), set/update token.sub
      if (user?.id) {
        token.sub = user.id;
      }

      // If organizationId or role is NOT already in the token AND token.sub (user ID) exists,
      // try to fetch and add it.
      // This covers initial sign-in and subsequent calls if it was missed.
      if (token.sub && (token.organizationId === undefined || token.role === undefined)) {
        // console.log("JWT callback - Attempting to fetch org details for sub:", token.sub);
        const userWithOrg = await prisma.user.findUnique({
          where: { id: token.sub as string }, // Use token.sub as userId
          include: {
            organizations: { // Relation name from User model to UserOnOrg
              select: {
                organizationId: true,
                role: true, // This should be the Role enum from Prisma
              },
              // For simplicity, taking the first organization and role.
              // Adjust if a user can have multiple relevant roles/orgs.
              take: 1,
            },
          },
        });
        // console.log("JWT callback - userWithOrg from token.sub:", JSON.stringify(userWithOrg, null, 2));

        if (userWithOrg && userWithOrg.organizations.length > 0) {
          token.organizationId = userWithOrg.organizations[0].organizationId;
          token.role = userWithOrg.organizations[0].role; // This will be of type Role (enum)
          // console.log("JWT callback - Fetched and set organizationId:", token.organizationId, "role:", token.role);
        } else {
          // console.log("JWT callback - No organization found for user ID (from token.sub):", token.sub);
          // Explicitly set to null if not found and you want to signify that.
          // token.organizationId = null;
          // token.role = null;
        }
      }
      
      // If user object is available (typically on initial login/token creation)
      // ensure other desired JWT fields are populated.
      // The default strategy might already handle some of these (name, email, picture).
      if (user) {
        if (user.email) token.email = user.email;
        if (user.name) token.name = user.name;
        if (user.image) token.picture = user.image; // NextAuth JWT often uses 'picture' for image
      }

      // console.log("JWT callback - returning token:", JSON.stringify(token, null, 2));
      return token;
    },
    async session({ session, token }) {
      // console.log("Session callback - incoming token:", JSON.stringify(token, null, 2));
      
      // Ensure session.user exists before assigning to it
      if (!session.user) {
        // Initialize with a minimal structure if it somehow wasn't created by NextAuth
        // Based on next-auth.d.ts, 'id' is non-optional.
        session.user = { id: token.sub || "" }; 
      }

      if (token.sub) {
        session.user.id = token.sub;
      }
      if (token.email) {
        session.user.email = token.email;
      }
      if (token.name) {
        session.user.name = token.name as string | null;
      }
      if (token.picture) {
        session.user.image = token.picture as string | null;
      }
      
      // Add custom properties from token to session.user
      // Make sure the types in next-auth.d.ts for session.user match these
      if (token.organizationId !== undefined) { // Check for undefined to allow null
        session.user.organizationId = token.organizationId as string | null;
      }
      if (token.role !== undefined) { // Check for undefined to allow null
        // Assuming Role is an enum from Prisma, imported in this file or globally typed
        // import { Role } from '@prisma/client'; // Ensure this import if not already present
        session.user.role = token.role as Role | null; 
      }
      
      // console.log("Session callback - returning session:", JSON.stringify(session, null, 2));
      return session;
    },
  },
  pages: {
    // signIn: '/auth/signin', // Commented out to use default NextAuth.js sign-in page
    // error: '/auth/error', // Optional: custom error page
    // verifyRequest: '/auth/verify-request', // Optional: for email provider
  },
  // secret: process.env.NEXTAUTH_SECRET, // Already handled by NextAuth.js if NEXTAUTH_SECRET is set
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 