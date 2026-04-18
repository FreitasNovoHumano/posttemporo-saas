"use client";

/**
 * 📊 Dashboard
 */

import { useEffect, useState } from "react";
import { getPosts } from "../../services/api";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [posts, setPosts] = useState([]); // ✅ SEM TYPESCRIPT
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (error) {
      console.error("Erro ao carregar posts:", error);
    }
  }

  {posts.map((post) => (
  <div key={post.id} className="mb-4 bg-white p-4 rounded shadow">
    
    <h2 className="font-bold">{post.title}</h2>
    <p>{post.description}</p>

    {post.image && (
      <img
        src={`http://127.0.0.1:3001${post.image}`}
        className="mt-2 w-full max-h-60 object-cover rounded"
      />
    )}

  </div>
))}

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {posts.length === 0 ? (
        <p>Nenhum post encontrado</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="mb-2">
            {post.title}
          </div>
        ))
      )}
    </div>
  );
}