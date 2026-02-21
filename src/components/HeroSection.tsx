"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { Sparkles } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function HeroSection() {
    const router = useRouter();
    const { data: session, status } = useSession();

    // Redirect to dashboard if already logged in
    useEffect(() => {
        if (status === "authenticated") {
            router.push("/dashboard");
        }
    }, [status, router]);

    const handleGetStarted = () => {
        if (session) {
            router.push("/dashboard");
        } else {
            router.push("/login");
        }
    };

    // Show loading while checking auth
    if (status === "loading") {
        return <LoadingSpinner messages={["Welcome to UPSC Practice...", "Loading...", "Just a moment..."]} />;
    }

    return (
        <div className="text-center max-w-5xl mx-auto">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-block mb-4 sm:mb-6"
            >
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg shimmer">
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                    Your UPSC Success Partner
                </div>
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight px-4"
            >
                Master UPSC with
                <br />
                Smart Practice
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-4"
            >
                Personalized test platform with intelligent analytics, topic-wise practice, and UPSC-standard timing to ace your preparation
            </motion.p>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 shimmer cursor-pointer"
            >
                Start Practicing Now →
            </motion.button>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-12 sm:mt-16 max-w-4xl mx-auto px-4">
                {[
                    { value: "1000+", label: "Questions" },
                    { value: "50+", label: "Topics" },
                    { value: "3", label: "Difficulty Levels" },
                    { value: "100%", label: "UPSC Standard" },
                ].map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200"
                    >
                        <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            {stat.value}
                        </div>
                        <div className="text-gray-600 text-xs sm:text-sm mt-1 sm:mt-2">{stat.label}</div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
