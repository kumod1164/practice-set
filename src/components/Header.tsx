"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  GraduationCap,
  LogOut,
  Moon,
  Sun,
  Shield,
  User,
} from "lucide-react";

export default function Header() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b z-50">
        <div className="h-full px-4 flex items-center justify-end gap-3">
          {/* User Info */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{session?.user?.name}</span>
            {session?.user?.role === "admin" && (
              <Badge variant="default" className="ml-2">
                <Shield className="w-3 h-3 mr-1" />
                Admin
              </Badge>
            )}
          </div>

          {/* Theme Toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* Logout */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLogoutDialog(true)}
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      {/* Logout Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="border-2 border-primary/20 shadow-2xl">
          <AlertDialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                <LogOut className="w-8 h-8 text-white" />
              </div>
            </div>
            <AlertDialogTitle className="text-center text-2xl">Sign Out</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              <div className="space-y-3 mt-4">
                <p className="text-base">Are you sure you want to sign out?</p>
                <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-muted-foreground">
                    ✓ Your progress is saved<br/>
                    ✓ Continue from where you left off<br/>
                    ✓ All your data is secure
                  </p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center gap-3">
            <AlertDialogCancel className="min-w-[120px]">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleSignOut}
              className="min-w-[120px] bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
