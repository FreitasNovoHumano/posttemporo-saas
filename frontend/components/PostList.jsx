import { useState, useEffect } from "react";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  async function fetchPosts() {
    const query = new URLSearchParams({
      status,
      search,
    });

    const res = await fetch(
      `http://localhost:3001/posts?${query}`
    );

    const data = await res.json();
    setPosts(data);
  }

  useEffect(() => {
    fetchPosts();
  }, [status, search]);

  return (
    <div>
      <h2>Posts</h2>

      {/* 🔍 busca */}
      <input
        placeholder="Buscar..."
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 🎯 filtro */}
      <select onChange={(e) => setStatus(e.target.value)}>
        <option value="">Todos</option>
        <option value="DRAFT">Rascunho</option>
        <option value="APPROVED">Aprovado</option>
        <option value="REJECTED">Rejeitado</option>
      </select>

      {/* 📄 lista */}
      {posts.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <StatusBadge status={post.status} />
        </div>
      ))}
    </div>
  );
}