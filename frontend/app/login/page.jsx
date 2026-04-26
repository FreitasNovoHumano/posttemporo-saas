"use client";

/**
 * =====================================================
 * 🔐 LOGIN PAGE (PRO - SAAS READY)
 * =====================================================
 *
 * 🎯 RESPONSABILIDADES:
 * - Coletar credenciais
 * - Chamar AuthContext
 * - Redirecionar usuário
 *
 * ⚙️ MELHORIAS:
 * - Loading state
 * - Feedback com toast
 * - Código desacoplado
 *
 * =====================================================
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  /**
   * ✏️ Atualiza formulário
   */
  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  /**
   * 🔐 Submit login
   */
  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    try {
      await login(form);

      toast.success("Login realizado com sucesso!");

      router.push("/dashboard");
    } catch (error) {
      toast.error("Email ou senha inválidos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow w-80 space-y-3"
      >
        <h1 className="text-xl font-bold text-center">
          Login
        </h1>

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Senha"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}