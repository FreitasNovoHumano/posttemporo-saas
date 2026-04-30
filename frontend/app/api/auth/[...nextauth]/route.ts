import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

/**
 * =====================================================
 * 🔐 NEXTAUTH CONFIG (PRO - SAAS READY)
 * =====================================================
 *
 * ✔ Login com Google
 * ✔ Integração com backend
 * ✔ Controle de onboarding (empresa)
 * ✔ Sessão enriquecida
 *
 * =====================================================
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
   * =====================================================
   * 🔁 CALLBACKS
   * =====================================================
   */
  callbacks: {
    /**
     * 🔐 LOGIN (INTEGRA COM BACKEND)
     */
    async signIn({ user }) {
      try {
        const res = await fetch(
          "http://localhost:3001/api/auth/google",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
            }),
          }
        );

        const data = await res.json();

        /**
         * 🔥 injeta dados no user (vai pro JWT)
         */
        user.userId = data.userId;
        user.hasCompany = data.hasCompany;

        return true;

      } catch (err) {
        console.error("Erro login Google:", err);
        return false;
      }
    },

    /**
     * 🧠 JWT (persistência)
     */
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.userId;
        token.hasCompany = user.hasCompany;
      }
      return token;
    },

    /**
     * 👤 SESSION (frontend)
     */
    async session({ session, token }) {
      session.user.userId = token.userId as string;
      session.user.hasCompany = token.hasCompany as boolean;
      return session;
    },

    /**
     * 🚀 REDIRECT INTELIGENTE
     */
    async redirect({ baseUrl }) {
      // 👇 sempre passa pelo redirect handler
      return `${baseUrl}/redirect`;
    },
  },
});

/**
 * =====================================================
 * 📡 EXPORT
 * =====================================================
 */
export { handler as GET, handler as POST };