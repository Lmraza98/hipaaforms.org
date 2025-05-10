import NextAuth from 'next-auth';
import { authOptions } from './app/api/auth/[...nextauth]/route'; // Import your existing options

// Initialize NextAuth.js with your options and export the utilities
export const { handlers, auth, signIn, signOut } = NextAuth(authOptions); 