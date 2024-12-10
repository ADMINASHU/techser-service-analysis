export const authConfig = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour
    updateAge: 1 * 60, // 1 minute
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userID = user.userID;
        token.email = user.email;
        token.isAdmin = user.isAdmin;
        token.level = user.level;
        token.verified = user.verified;
        // Ensure isAdmin is defined
      }
      // console.log("JWT Callback - Token:", token);
      // Console log the token
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          userID: token.userID,
          email: token.email,
          isAdmin: token.isAdmin, // Ensure isAdmin is defined
          level: token.level, // Ensure isAdmin is defined
          verified: token.verified,
        };
      }
      // console.log("Session Callback - Session:", session); // Console log the session
      return session;
    },
  },
};
