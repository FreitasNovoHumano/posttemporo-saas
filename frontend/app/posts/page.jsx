"use client";

/**
 * =====================================================
 * 📝 POSTS PAGE (PRO - RBAC + API PADRÃO)
 * =====================================================
 */

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { hasPermission } from "@/utils/permissions";
import { createPost } from "@/services/api";

export default function PostsPage() {
  const { user, loading: authLoading } = useAuth();

  /**
   * ========================================
   * 📦 ESTADOS
   * ========================================
   */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);

  /**
   * 🔐 RBAC
   */
  const canCreate = hasPermission(user, "CREATE_POST");

  /**
   * ========================================
   * ➕ CRIAR POST
   * ========================================
   */
  async function handleSubmit(e) {
    e.preventDefault();

    if (!canCreate) {
      alert("Você não tem permissão para criar posts");
      return;
    }

    if (!title.trim()) {
      alert("Título é obrigatório");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);

      if (image) {
        formData.append("image", image);
      }

      const { data, error } = await createPost(formData);

      if (error) {
        throw new Error(error);
      }

      console.log("✅ Post criado:", data);
      alert("Post criado com sucesso!");

      /**
       * 🔄 Reset
       */
      setTitle("");
      setDescription("");
      setImage(null);

    } catch (error) {
      console.error("❌ Erro:", error);
      alert("Erro ao criar post");
    } finally {
      setLoading(false);
    }
  }

  /**
   * 🔄 Loading global
   */
  if (authLoading) {
    return <div className="p-6">Carregando...</div>;
  }

  /**
   * 🔐 Bloqueio total (sem permissão)
   */
  if (!canCreate) {
    return (
      <div className="p-6 text-red-500">
        Você não tem permissão para acessar esta página.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">
        Criar Post
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* 🔹 Título */}
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
        />

        {/* 🔹 Descrição */}
        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
        />

        {/* 🔹 Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setImage(e.target.files?.[0] || null)
          }
        />

        {/* 🔹 Botão */}
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${
            loading
              ? "bg-gray-400"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Criando..." : "Criar Post"}
        </button>

      </form>
    </div>
  );
}