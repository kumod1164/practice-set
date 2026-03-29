"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";
import LoadingSpinner from "./LoadingSpinner";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { status } = useSession();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Pages that should not show the layout (sidebar/header)
  const isLoginPage = pathname === "/login";
  const isLandingPage = pathname === "/";
  // Only hide layout for active test taking (/test/[id]), not configure or results
  const isTestTakingPage = pathname?.match(/^\/test\/[a-f0-9]{24}$/) !== null; // MongoDB ObjectId pattern
  const isPublicPage = ["/contact", "/faq", "/privacy", "/terms"].includes(pathname ?? "");
  // For public pages, show app layout only if authenticated
  const shouldShowLayout = !isLoginPage && !isLandingPage && !isTestTakingPage && (!isPublicPage || status === "authenticated");

  // Show loading only for authenticated pages
  if (status === "loading" && shouldShowLayout) {
    return <LoadingSpinner messages={["Loading application...", "Just a moment...", "Almost ready..."]} />;
  }

  // Don't show layout for landing, login, or test pages
  if (!shouldShowLayout) {
    return <>{children}</>;
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <Header sidebarCollapsed={sidebarCollapsed} />
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Content area: fills remaining height, only this scrolls */}
      <div
        className={cn(
          "flex flex-col flex-1 pt-16 overflow-hidden transition-all duration-300",
          sidebarCollapsed ? "ml-16" : "ml-56"
        )}
      >
        <main className="flex-1 overflow-y-auto">
          <div className="p-4">{children}</div>
        </main>

        {/* Fixed Footer */}
        <footer className="border-t bg-card shrink-0">
          <div className="px-6 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                © 2025 UPSC Practice Platform. All rights reserved.
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <a href="/faq" className="hover:text-primary transition-colors">FAQ</a>
                <span>•</span>
                <a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
                <span>•</span>
                <a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a>
                <span>•</span>
                <a href="/contact" className="hover:text-primary transition-colors">Contact Us</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
