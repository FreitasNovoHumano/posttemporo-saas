import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

/**
 * 🔐 CONFIG NEXTAUTH
 */
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  /**
   * 🚀 CONTROLE DE REDIRECT
   */
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Sempre manda pro dashboard após login
      return `${baseUrl}/dashboard`;
    },
  },
});

export { handler as GET, handler as POST };