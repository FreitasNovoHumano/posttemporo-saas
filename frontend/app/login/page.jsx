"use client";

/**
 * =====================================================
 * 🔐 LOGIN PAGE (GOOGLE + EMAIL/SENHA)
 * =====================================================
 *
 * 🎯 RESPONSABILIDADES:
 * - Login via Google (NextAuth)
 * - Login via Email/Senha (backend próprio)
 * - Redirecionamento automático se já logado
 *
 * =====================================================
 */

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Login() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // 🔥 NOVO: estados do formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);

  /**
   * 🔁 Redireciona se já estiver logado (Google)
   */
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  /**
   * 🔐 LOGIN COM EMAIL/SENHA
   */
  const handleLogin = async () => {
    try {
      setLoadingLogin(true);

      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Erro ao fazer login");
        return;
      }

      // 🔐 salva token
      localStorage.setItem("token", data.token);

      // 🚀 redireciona
      router.push("/dashboard");

    } catch (error) {
      console.error(error);
      alert("Erro inesperado");
    } finally {
      setLoadingLogin(false);
    }
  };

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

        {/* 🔥 NOVO: LOGIN COM EMAIL */}
        <input
          type="email"
          placeholder="Seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="password"
          placeholder="Sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button
          onClick={handleLogin}
          disabled={loadingLogin}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {loadingLogin ? "Entrando..." : "Entrar com Email"}
        </button>

        <hr />

        {/* 🔐 GOOGLE (mantido intacto) */}
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