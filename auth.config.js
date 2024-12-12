import CredentialProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserByUserID } from "./data/user";

export const authConfig = {
  providers: [
    CredentialProvider({
      credentials: {
        userID: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const user = await getUserByUserID(credentials.userID);
        if (!user || !user.password) return null;

        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        if (isValidPassword) {
          return user;
        }
        return null;
      },
    }),
  ],
  // callbacks: {
  //   async jwt({ token, user }) {
  //     if (user) {
  //       token.userID = user.userID;
  //       token.email = user.email;
  //       token.isAdmin = user.isAdmin;
  //       token.level = user.level;
  //       token.verified = user.verified;
  //     }
  //     return token;
  //   },
  //   async session({ session, token }) {
  //     if (token) {
  //       session.user = {
  //         id: token.id,
  //         userID: token.userID,
  //         email: token.email,
  //         isAdmin: token.isAdmin, // Ensure isAdmin is defined
  //         level: token.level, // Ensure isAdmin is defined
  //         verified: token.verified,
  //       };
  //     }
  //     return session;
  //   },
  // },
};
