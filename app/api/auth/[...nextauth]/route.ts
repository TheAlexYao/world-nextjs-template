import NextAuth, { NextAuthOptions } from "next-auth";

const authOptions: NextAuthOptions = {
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
          username: profile["https://id.worldcoin.org/v1"].username || profile.sub.slice(-4),
        };
      },
    },
  ],
  callbacks: {
    async signIn({ user }) {
      return true;
    },
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
