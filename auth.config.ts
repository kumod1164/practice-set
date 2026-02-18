import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import connectDB from "./src/lib/db";
import User from "./src/models/User";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Connect to database
        await connectDB();

        // Check if user exists
        let dbUser = await User.findOne({ email: user.email });

        if (!dbUser) {
          // Create new user if doesn't exist
          const adminEmails = process.env.ADMIN_EMAIL?.split(',').map(e => e.trim().toLowerCase()) || [];
          const isAdmin = user.email ? adminEmails.includes(user.email.toLowerCase()) : false;
          dbUser = await User.create({
            email: user.email,
            name: user.name || profile?.name || "User",
            role: isAdmin ? "admin" : "user",
            image: user.image || profile?.image,
          });
        } else {
          // Update existing user's name and image if changed
          const updates: any = {};
          if (user.name && user.name !== dbUser.name) {
            updates.name = user.name;
          }
          if (user.image && user.image !== dbUser.image) {
            updates.image = user.image;
          }
          
          // Check if user should be admin
          const adminEmails = process.env.ADMIN_EMAIL?.split(',').map(e => e.trim().toLowerCase()) || [];
          const isAdmin = user.email ? adminEmails.includes(user.email.toLowerCase()) : false;
          if (isAdmin && dbUser.role !== "admin") {
            updates.role = "admin";
          }

          if (Object.keys(updates).length > 0) {
            await User.findByIdAndUpdate(dbUser._id, updates);
          }
        }

        // Store the database user ID
        user.id = dbUser._id.toString();
        user.role = dbUser.role;

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "user" | "admin";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
} satisfies NextAuthConfig;
