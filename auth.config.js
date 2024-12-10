export const authConfig = {
  session: {
    strategy: "jwt",
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return { ...token, ...user };
      }
    
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime - token.iat > 1 * 60) { // 1 minute
        try {
          await connectToServiceEaseDB();
          const currentUser = await User.findOne({ userID: token.userID });
    
          if (currentUser) {
            return {
              ...token,
              userID: currentUser.userID,
              email: currentUser.email,
              isAdmin: currentUser.isAdmin,
              level: currentUser.level,
              verified: currentUser.verified,
              iat: currentTime,
            };
          }
        } catch (error) {
          console.error("JWT callback error:", error);
        }
      }
    
      return token;
    }
    
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          userID: token.userID,
          email: token.email,
          isAdmin: token.isAdmin, // Ensure isAdmin is defined
          level: token.level, // Ensure isAdmin is defined
          verified: token.verified, // Ensure isAdmin is defined
        };
      }
      // console.log("Session Callback - Session:", session); // Console log the session
      return session;
    },
  },
};
