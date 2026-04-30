"use client";

/**
 * =====================================================
 * 🔐 LOGIN PAGE (NEXTAUTH - GOOGLE)
 * =====================================================
 *
 * 🎯 RESPONSABILIDADES:
 * - Login via Google (NextAuth)
 * - Redirecionamento automático se já logado
 *
 * ❗ NÃO usa mais email/senha
 *
 * =====================================================
 */

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
  const router = useRouter();
  const { data: session, status } = useSession();

  /**
   * 🔁 Redireciona se já estiver logado
   */
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  /**
   * 🔄 Loading
   */
  if (status === "loading") {
    return <p className="text-center mt-10">Carregando...</p>;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow w-80 space-y-4 text-center">

        <h1 className="text-xl font-bold">
          Entrar no sistema
        </h1>

        <button
          onClick={() =>
            signIn("google", { callbackUrl: "/dashboard" })
          }
          className="w-full bg-white border p-2 rounded shadow hover:bg-gray-100"
        >
          Entrar com Google
        </button>

      </div>
    </div>
  );
}