"use client";

import { useState } from "react";

export default function PostModal({ post, onClose, onSave }) {
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);

  async function handleSave() {
    await onSave({
      ...post,
      title,
      description,
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[500px] overflow-hidden">
        
        {/* 🖼️ IMAGEM */}
        {post.image && (
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${post.image}`}
            className="w-full h-60 object-cover"
          />
        )}

        <div className="p-6 space-y-4">
          <h2 className="font-bold text-lg">Editar Post</h2>

          {/* ✏️ TÍTULO */}
          <input
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* 📝 DESCRIÇÃO */}
          <textarea
            className="w-full border p-2 rounded"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* 🔘 AÇÕES */}
          <div className="flex justify-end gap-2">
            <button onClick={onClose}>
              Cancelar
            </button>

            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}