import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    {
      id: "worldcoin",
      name: "Worldcoin",
      type: "oauth",
      wellKnown: "https://id.worldcoin.org/.well-known/openid-configuration",
      authorization: { params: { scope: "openid" } },
      clientId: process.env.WLD_CLIENT_ID,
      clientSecret: process.env.WLD_CLIENT_SECRET,
      idToken: true,
      checks: ["state", "nonce", "pkce"],
      profile(profile) {
        console.log('World ID Profile:', JSON.stringify(profile, null, 2));
        return {
          id: profile.sub,
          verification_level: profile["https://id.worldcoin.org/v1"].verification_level,
          username: profile.sub.slice(-4), // Fallback to last 4 chars of ID for now
        };
      },
    },
  ],
  callbacks: {
    async session({ session, token, user }) {
      session.user = {
        id: token.sub as string,
        verification_level: token.verification_level as string,
        username: token.username as string,
      };
      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.verification_level = user.verification_level;
        token.username = user.username;
      }
      return token;
    },
    async signIn({ user }) {
      return true;
    },
  },
  debug: process.env.NODE_ENV === "development",
}; 