"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

export default function Posts() {
  // 🔹 Estado da lista de posts
  const [posts, setPosts] = useState([]);

  // 🔹 Controle do modal
  const [open, setOpen] = useState(false);

  // 🔹 Dados do formulário
  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  // 🔹 Atualiza campos do formulário
  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // 🔹 Cria novo post
  function handleSubmit(e) {
    e.preventDefault();

    const newPost = {
      id: Date.now(),
      ...form,
      status: "Pendente",
    };

    setPosts([...posts, newPost]);

    // limpa formulário
    setForm({ title: "", description: "" });

    // fecha modal
    setOpen(false);
  }

  return (
    <div>
      {/* 🔹 Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Posts</h1>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          Novo Post
        </button>
      </div>

      {/* 🔹 Lista de posts */}
      <div className="bg-white rounded-2xl shadow p-6">
        {posts.length === 0 ? (
          <p className="text-gray-500">Nenhum post ainda...</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* 🔹 MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          
          <div className="bg-white p-6 rounded-2xl w-96 shadow-lg">
            
            <h2 className="text-xl font-bold mb-4">
              Criar novo post
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Título */}
              <input
                name="title"
                placeholder="Título"
                value={form.title}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />

              {/* Descrição */}
              <textarea
                name="description"
                placeholder="Descrição"
                value={form.description}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />

              {/* Botões */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Salvar
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// 🔹 Componente de item
function PostItem({ post }) {
  const statusColor = {
    Aprovado: "text-green-600",
    Pendente: "text-yellow-600",
  };

  return (
    <div className="flex justify-between items-center border-b pb-3">
      
      <div>
        <p className="font-medium">{post.title}</p>
        <p className="text-sm text-gray-500">{post.description}</p>
      </div>

      <span className={`text-sm ${statusColor[post.status]}`}>
        {post.status}
      </span>

    </div>
  );
}