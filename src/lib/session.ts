import { auth } from "@/../auth";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

/**
 * Get the current session
 * @returns The current session or null if not authenticated
 */
export async function getSession(): Promise<Session | null> {
  return await auth();
}

/**
 * Require authentication - redirects to login if not authenticated
 * Use this in server components and server actions
 * @returns The authenticated session
 */
export async function requireAuth(): Promise<Session> {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}

/**
 * Validate session and return user info
 * @returns User info if session is valid, null otherwise
 */
export async function validateSession() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }
  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role,
    image: session.user.image,
  };
}

/**
 * Check if user is authenticated
 * @returns true if user has a valid session
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await auth();
  return !!session?.user;
}

/**
 * Get user ID from session
 * @returns User ID if authenticated, null otherwise
 */
export async function getUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id || null;
}

/**
 * Require authentication for API routes
 * Throws error if not authenticated (for API route error handling)
 * @returns The authenticated session
 * @throws Error if not authenticated
 */
export async function requireAuthAPI(): Promise<Session> {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Authentication required");
  }
  return session;
}
