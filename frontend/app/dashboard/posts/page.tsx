"use client";

/**
 * =====================================================
 * 📝 POSTS PAGE (Dashboard)
 * =====================================================
 * Responsável por:
 * - Criar novos posts
 * - Listar posts existentes
 * - Upload de imagem
 * - Atualizar lista automaticamente
 * =====================================================
 */

import { useState, useEffect } from "react";

// 🔹 API (centralizada)
import { createPost, getPosts } from "@/services/api";

// 🔹 Componente de card
import PostCard from "@/components/dashboard/PostCard";

/**
 * 🔹 Tipagem do Post
 */
type Post = {
  id: number;
  title: string;
  description: string;
  status?: string;
  image?: string;
};

/**
 * 🧠 Página de Posts
 */
export default function PostsPage() {
  /**
   * ========================================
   * 📦 ESTADOS
   * ========================================
   */

  // 🔹 Formulário
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);

  // 🔹 Dados
  const [posts, setPosts] = useState<Post[]>([]);

  // 🔹 Controle
  const [loading, setLoading] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // 🔹 Paginação
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /**
   * ========================================
   * 📥 CARREGAR POSTS (COM PAGINAÇÃO)
   * ========================================
   */
  async function loadPosts() {
    try {
      setLoadingPosts(true);

      const response = await getPosts(page);

      /**
       * 🔥 Espera retorno:
       * {
       *   data: [],
       *   totalPages: number
       * }
       */
      setPosts(response.data || []);
      setTotalPages(response.totalPages || 1);

    } catch (error) {
      console.error("❌ Erro ao carregar posts:", error);
      setPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  }

  /**
   * 🔄 Executa ao carregar e ao mudar página
   */
  useEffect(() => {
    loadPosts();
  }, [page]);

  /**
   * ========================================
   * ➕ CRIAR POST
   * ========================================
   */
  async function handleCreatePost(e: React.FormEvent) {
    e.preventDefault();

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

      await createPost(formData);

      // 🔄 Reset
      setTitle("");
      setDescription("");
      setImage(null);

      // 🔄 Atualizar lista
      loadPosts();

    } catch (error) {
      console.error("❌ Erro ao criar post:", error);
      alert("Erro ao criar post");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-6">

      {/* ========================================
          📝 FORMULÁRIO
          ======================================== */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-bold mb-4">Criar Post</h2>

        <form onSubmit={handleCreatePost} className="space-y-4">

          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <textarea
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Criando..." : "Criar Post"}
          </button>
        </form>
      </div>

      {/* ========================================
          📦 LISTA DE POSTS
          ======================================== */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-bold mb-4">Posts</h2>

        {/* 🔄 Loading */}
        {loadingPosts && (
          <p className="text-gray-500">Carregando posts...</p>
        )}

        {/* ❌ Sem posts */}
        {!loadingPosts && posts.length === 0 && (
          <p className="text-gray-500">Nenhum post ainda</p>
        )}

        {/* 🔥 GRID */}
        <div className="grid md:grid-cols-2 gap-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onUpdate={loadPosts}
            />
          ))}
        </div>

        {/* ========================================
            📄 PAGINAÇÃO
            ======================================== */}
        <div className="flex justify-between mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Anterior
          </button>

          <span>Página {page} de {totalPages}</span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Próxima
          </button>
        </div>

      </div>
    </div>
  );
}