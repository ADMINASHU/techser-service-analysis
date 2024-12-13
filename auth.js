import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { User } from "./app/models/User";
import connectToServiceEaseDB from "./lib/serviceDB";
import { authConfig } from "./auth.config";

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  ...authConfig,
  providers: [
    CredentialProvider({
      credentials: {
        userID: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials) return null;
        try {
          await connectToServiceEaseDB();
          const user = await User.findOne({ userID: credentials.userID });
          const isValidPassword = await bcrypt.compare(credentials.password, user.password);
          if (!user || !isValidPassword) {
            throw new Error("Invalid credentials");
          }
          return {
            id: user._id.toString(),
            userID: user.userID,
            email: user.email,
            isAdmin: user.isAdmin,
            level: user.level,
            verified: user.verified,
          };
        } catch (error) {
          throw new Error(error);
        }
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login", // Redirect to the login page on sign-in errors
    error: "/login", // Redirect to the login page on errors
  },
});
