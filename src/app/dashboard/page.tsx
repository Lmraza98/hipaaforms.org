import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth'; // Import authOptions from the new location
import { redirect } from 'next/navigation';
import CreateFormButton from "./CreateFormButton.client"; // Import the new button
import type { Session } from "next-auth"; // For typing session user more accurately

export default async function DashboardPage() {
  const session: Session | null = await getServerSession(authOptions);
  console.log("session", JSON.stringify(session, null, 2));

  // The middleware should handle redirection, but as a fallback:
  if (!session || !session.user) {
    redirect('/api/auth/signin?callbackUrl=/dashboard');
    // return null; // Or a message, but redirect is better
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <div style={{ marginBottom: '1rem' }}>
        <CreateFormButton />
      </div>
      <p>Welcome, this is a protected page.</p>
      {session.user && (
        <>
          <p>User ID: {session.user.id}</p>
          <p>Email: {session.user.email}</p>
          <p>Role: {session.user.role || "Not assigned"}</p>
          <p>Organization ID: {session.user.organizationId || "Not assigned"}</p>
          <pre style={{ padding: '1rem', borderRadius: '5px' }}>
            {JSON.stringify(session, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
} 