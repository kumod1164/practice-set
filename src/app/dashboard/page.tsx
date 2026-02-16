"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap, LogOut, User, Shield } from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              UPSC Practice
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>{session.user?.name}</span>
              {session.user?.role === "admin" && (
                <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Admin
                </span>
              )}
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Welcome Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8 border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome back, {session.user?.name?.split(" ")[0]}! 👋
            </h2>
            <p className="text-gray-600 mb-6">
              Ready to continue your UPSC preparation journey?
            </p>

            {/* User Info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {session.user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{session.user?.name}</p>
                  <p className="text-sm text-gray-600">{session.user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-blue-200">
                <span className="text-sm text-gray-600">Role:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  session.user?.role === "admin" 
                    ? "bg-purple-100 text-purple-700" 
                    : "bg-blue-100 text-blue-700"
                }`}>
                  {session.user?.role === "admin" ? "Administrator" : "Student"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200 cursor-pointer"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">Start New Test</h3>
              <p className="text-gray-600 text-sm">Configure and begin a practice test</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200 cursor-pointer"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">View History</h3>
              <p className="text-gray-600 text-sm">Review your past test attempts</p>
            </motion.div>

            {session.user?.role === "admin" && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white cursor-pointer sm:col-span-2"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5" />
                  <h3 className="text-xl font-bold">Admin Dashboard</h3>
                </div>
                <p className="text-purple-100 text-sm">Manage questions and view platform analytics</p>
              </motion.div>
            )}
          </div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-green-50 border border-green-200 rounded-xl p-4 text-center"
          >
            <p className="text-green-800 font-medium">
              ✅ Authentication successful! You're now logged in.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
