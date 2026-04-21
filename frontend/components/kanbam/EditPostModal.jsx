"use client";

import { useState } from "react";

export default function EditPostModal({ post, onClose, onSave }) {
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description || "");

  async function handleSave() {
    await onSave({
      ...post,
      title,
      description,
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-[400px]">
        <h2 className="font-bold mb-4">Editar Post</h2>

        <input
          className="w-full border p-2 mb-3 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border p-2 mb-3 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancelar</button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}