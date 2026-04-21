"use client";

/**
 * =====================================================
 * 📝 POSTS PAGE (Criação de Post)
 * =====================================================
 * Responsável por:
 * - Criar novos posts
 * - Upload de imagem
 * - Enviar dados para API
 * =====================================================
 */

import { useState } from "react";

/**
 * 🔹 URL da API
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function PostsPage() {
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
   * ========================================
   * ➕ CRIAR POST
   * ========================================
   */
  async function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim()) {
      alert("Título é obrigatório");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);

      if (image) {
        formData.append("image", image);
      }

      const res = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      /**
       * 🔒 Verificação de erro HTTP
       */
      if (!res.ok) {
        throw new Error("Erro ao criar post");
      }

      const data = await res.json();

      console.log("✅ Post criado:", data);
      alert("Post criado com sucesso!");

      /**
       * 🔄 Reset form
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

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Criar Post</h1>

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
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />

        {/* 🔹 Botão */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Criando..." : "Criar Post"}
        </button>

      </form>
    </div>
  );
}