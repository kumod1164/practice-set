import { auth } from "@/../../auth";
import { Session } from "next-auth";

/**
 * Check if an email belongs to an admin user
 * @param email - User's email address
 * @returns true if the email matches the ADMIN_EMAIL environment variable
 */
export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn("ADMIN_EMAIL environment variable is not set");
    return false;
  }
  return email.toLowerCase() === adminEmail.toLowerCase();
}

/**
 * Check if the current session belongs to an admin user
 * @param session - NextAuth session object
 * @returns true if the user has admin role
 */
export function isAdminSession(session: Session | null): boolean {
  if (!session?.user) return false;
  return session.user.role === "admin";
}

/**
 * Require admin access - throws error if user is not admin
 * Use this in API routes to protect admin-only endpoints
 * @param session - NextAuth session object
 * @throws Error if user is not authenticated or not an admin
 */
export function requireAdmin(session: Session | null): void {
  if (!session?.user) {
    throw new Error("Authentication required");
  }
  if (session.user.role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }
}

/**
 * Get the current session and require admin access
 * Convenience function that combines auth() and requireAdmin()
 * @returns The authenticated admin session
 * @throws Error if user is not authenticated or not an admin
 */
export async function requireAdminSession(): Promise<Session> {
  const session = await auth();
  requireAdmin(session);
  return session!;
}

/**
 * Check if the current user is an admin
 * @returns true if the current user has admin role
 */
export async function checkIsAdmin(): Promise<boolean> {
  const session = await auth();
  return isAdminSession(session);
}
