import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SessionProvider from "@/components/SessionProvider";


const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

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
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
