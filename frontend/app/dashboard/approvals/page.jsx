"use client";

/**
 * 🧠 Página de Aprovações
 * --------------------------------------------------
 * Lista todos os posts e permite:
 * - Aprovar
 * - Rejeitar
 */

import { useEffect, useState } from "react";

// 🔹 IMPORTS SEM ALIAS
import { getPosts } from "../../../services/api";
import PostCard from "../../../components/dashboard/PostCard";

export default function ApprovalsPage() {
  const [posts, setPosts] = useState([]);

  // 🔹 Carrega posts
  async function loadPosts() {
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (error) {
      console.error("Erro ao carregar posts:", error);
    }
  }

  // 🔹 Carrega ao iniciar
  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Aprovações</h1>

      <div className="grid grid-cols-3 gap-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onUpdate={loadPosts}
          />
        ))}
      </div>
    </div>
  );
}