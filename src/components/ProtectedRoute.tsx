"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  fallback?: React.ReactNode;
}

/**
 * Protected Route Component
 * Wraps content that requires authentication
 * Redirects to login if not authenticated
 * Optionally requires admin role
 */
export default function ProtectedRoute({
  children,
  requireAdmin = false,
  fallback = <div className="flex items-center justify-center min-h-screen">Loading...</div>,
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      // Not authenticated - redirect to login
      router.push("/login");
      return;
    }

    if (requireAdmin && session.user.role !== "admin") {
      // Authenticated but not admin - redirect to dashboard
      router.push("/dashboard");
    }
  }, [session, status, requireAdmin, router]);

  // Show loading state while checking authentication
  if (status === "loading") {
    return <>{fallback}</>;
  }

  // Not authenticated
  if (!session) {
    return <>{fallback}</>;
  }

  // Authenticated but not admin when admin is required
  if (requireAdmin && session.user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-600">You don&apos;t have permission to access this page.</p>
        </div>
      </div>
    );
  }

  // Authenticated and authorized
  return <>{children}</>;
}
