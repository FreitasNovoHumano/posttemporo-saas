"use client";

import { useState, useEffect } from "react";

// 🔹 Services (API)
import { createPost, getPosts } from "../../../services/api";

// 🔹 Componente de card
import PostCard from "../postsChart";

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
 * 🧠 Página de criação de posts
 */
export default function PostsPage() {
  // 🔹 Estados do formulário
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);

  // 🔹 Estados de controle
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * 🔹 Carregar posts do backend
   */
  async function loadPosts() {
    try {
      const data = await getPosts();

      // 🔥 proteção contra resposta inválida
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar posts:", error);
      setPosts([]);
    }
  }

  /**
   * 🔹 Executa ao carregar página
   */
  useEffect(() => {
    loadPosts();
  }, []);

  /**
   * 🔹 Criar post (com upload de imagem)
   */
  async function handleCreatePost(e: React.FormEvent) {
    e.preventDefault();

    // 🔹 Validação básica
    if (!title.trim()) {
      alert("Título é obrigatório");
      return;
    }

    try {
      setLoading(true);

      // 🔥 FormData para upload
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);

      if (image) {
        formData.append("image", image);
      }

      await createPost(formData);

      // 🔄 Reset form
      setTitle("");
      setDescription("");
      setImage(null);

      // 🔄 Atualizar lista
      await loadPosts();

    } catch (error) {
      console.error("Erro ao criar post:", error);
      alert("Erro ao criar post");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-6">

      {/* 🔥 FORM */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-bold mb-4">Criar Post</h2>

        <form onSubmit={handleCreatePost} className="space-y-4">

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

          {/* 🔹 Upload de imagem */}
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

      {/* 🔥 LISTA DE POSTS */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-bold mb-4">Posts</h2>

        {posts.length === 0 && (
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
      </div>

    </div>
  );
}