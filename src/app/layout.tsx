import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import SessionProvider from "@/components/SessionProvider";
import AppLayout from "@/components/AppLayout";
import { Toaster } from "@/components/ui/toaster";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";


const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export const metadata: Metadata = {
  title: "UPSC Practice Platform - Master Your Preparation",
  description: "Comprehensive test preparation platform for UPSC aspirants with intelligent analytics, topic-wise practice, and UPSC-standard timing. Practice smarter, perform better.",
  keywords: ["UPSC", "IAS", "Civil Services", "Test Preparation", "Practice Questions", "Mock Tests", "UPSC Analytics"],
  authors: [{ name: "UPSC Practice Platform" }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: "UPSC Practice Platform - Master Your Preparation",
    description: "Comprehensive test preparation platform for UPSC aspirants with intelligent analytics and topic-wise practice.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <AppLayout>{children}</AppLayout>
            <Toaster />
            <SpeedInsights />
            <Analytics />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
