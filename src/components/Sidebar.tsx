"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  BookOpen,
  History,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  FileQuestion,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const userMenuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/dashboard",
      color: "text-blue-500",
    },
    {
      icon: BookOpen,
      label: "Start Test",
      href: "/test/configure",
      color: "text-green-500",
    },
    {
      icon: History,
      label: "Test History",
      href: "/history",
      color: "text-purple-500",
    },
    {
      icon: BarChart3,
      label: "Analytics",
      href: "/analytics",
      color: "text-orange-500",
    },
  ];

  const adminMenuItems = [
    {
      icon: Shield,
      label: "Admin Dashboard",
      href: "/admin",
      color: "text-red-500",
    },
    {
      icon: FileQuestion,
      label: "Questions",
      href: "/admin/questions",
      color: "text-indigo-500",
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-card border-r transition-all duration-300 z-50",
        collapsed ? "w-16" : "w-56"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo Section with Toggle */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          {collapsed ? (
            <>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className="absolute -right-3 top-5 h-6 w-6 rounded-full border bg-card shadow-md"
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-base font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    UPSC Practice
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Master Your Prep
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {/* User Menu */}
          <div className="space-y-1">
            {!collapsed && (
              <p className="text-xs font-semibold text-muted-foreground px-3 mb-2">
                MENU
              </p>
            )}
            {userMenuItems.map((item) => (
              <Button
                key={item.href}
                variant={isActive(item.href) ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  collapsed && "justify-center px-2",
                  isActive(item.href) && "bg-primary/10"
                )}
                onClick={() => router.push(item.href)}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5",
                    collapsed ? "" : "mr-3",
                    item.color
                  )}
                />
                {!collapsed && <span>{item.label}</span>}
              </Button>
            ))}
          </div>

          {/* Admin Menu */}
          {session?.user?.role === "admin" && (
            <div className="space-y-1 pt-4 border-t">
              {!collapsed && (
                <p className="text-xs font-semibold text-muted-foreground px-3 mb-2">
                  ADMIN
                </p>
              )}
              {adminMenuItems.map((item) => (
                <Button
                  key={item.href}
                  variant={isActive(item.href) ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    collapsed && "justify-center px-2",
                    isActive(item.href) && "bg-primary/10"
                  )}
                  onClick={() => router.push(item.href)}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5",
                      collapsed ? "" : "mr-3",
                      item.color
                    )}
                  />
                  {!collapsed && <span>{item.label}</span>}
                </Button>
              ))}
            </div>
          )}
        </nav>

        {/* Sidebar Footer - Compact */}
        <div className="border-t bg-secondary/30 p-3">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              {collapsed ? "v1.0" : "Version 1.0.0"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
