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
  const shouldShowLayout = !isLoginPage && !isLandingPage && !isTestTakingPage;

  // Show loading only for authenticated pages
  if (status === "loading" && shouldShowLayout) {
    return <LoadingSpinner messages={["Loading application...", "Just a moment...", "Almost ready..."]} />;
  }

  // Don't show layout for landing, login, or test pages
  if (!shouldShowLayout) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header sidebarCollapsed={sidebarCollapsed} />
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main
        className={cn(
          "flex-1 pt-16 transition-all duration-300",
          sidebarCollapsed ? "ml-16" : "ml-56"
        )}
      >
        <div className="p-4 min-h-[calc(100vh-8rem)]">{children}</div>
      </main>
      
      {/* Full Width Footer */}
      <footer
        className={cn(
          "border-t bg-card transition-all duration-300",
          sidebarCollapsed ? "ml-16" : "ml-56"
        )}
      >
        <div className="px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              © 2024 UPSC Practice Platform. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <span>•</span>
              <a href="#" className="hover:text-primary transition-colors">
                Terms of Service
              </a>
              <span>•</span>
              <a href="#" className="hover:text-primary transition-colors">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
