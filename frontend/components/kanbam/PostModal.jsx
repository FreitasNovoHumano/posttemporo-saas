"use client";

/**
 * =====================================================
 * 🧾 POST MODAL (PRO - COMPLETO)
 * =====================================================
 * Responsável por:
 * - Editar post
 * - Mostrar preview (imagem)
 * - Exibir comentários
 * - Exibir histórico (audit log)
 * - UX moderna (fechar fora / ESC)
 * =====================================================
 */

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function PostModal({ post, onClose, onSave }) {
  /**
   * =====================================================
   * 📦 STATES
   * =====================================================
   */
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const [logs, setLogs] = useState([]);

  /**
   * =====================================================
   * 🔄 FETCH COMMENTS
   * =====================================================
   */
  async function fetchComments() {
    const res = await fetch(`${API_URL}/comments/${post.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();
    setComments(data);
  }

  /**
   * 🔄 FETCH LOGS
   */
  async function fetchLogs() {
    const res = await fetch(`${API_URL}/logs/${post.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();
    setLogs(data);
  }

  useEffect(() => {
    fetchComments();
    fetchLogs();
  }, [post.id]);

  /**
   * =====================================================
   * 💬 ADD COMMENT
   * =====================================================
   */
  async function handleAddComment() {
    if (!newComment.trim()) return;

    const res = await fetch(`${API_URL}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        postId: post.id,
        content: newComment,
      }),
    });

    const comment = await res.json();

    setComments([comment, ...comments]);
    setNewComment("");
  }

  /**
   * =====================================================
   * 💾 SAVE
   * =====================================================
   */
  async function handleSave() {
    await onSave({
      ...post,
      title,
      description,
    });

    onClose();
  }

  /**
   * =====================================================
   * 🎯 UX - CLOSE (ESC)
   * =====================================================
   */
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  /**
   * =====================================================
   * 🎯 RENDER
   * =====================================================
   */
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose} // 🔥 clique fora fecha
    >
      <div
        className="bg-white rounded-xl w-[600px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // 🔥 evita fechar
      >
        {/* ================================
            🖼️ IMAGEM
           ================================ */}
        {post.image && (
          <img
            src={`${API_URL}/uploads/${post.image}`}
            className="w-full h-64 object-cover"
          />
        )}

        <div className="p-6 space-y-6">
          {/* ================================
              ✏️ EDITOR
             ================================ */}
          <div>
            <h2 className="font-bold text-lg mb-2">
              Editar Post
            </h2>

            <input
              className="w-full border p-2 rounded mb-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="w-full border p-2 rounded"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* ================================
              💬 COMENTÁRIOS
             ================================ */}
          <div>
            <h3 className="font-semibold mb-2">
              💬 Comentários
            </h3>

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="text-sm bg-gray-100 p-2 rounded"
                >
                  {c.content}
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-2">
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 border p-2 rounded"
                placeholder="Escreva um comentário..."
              />
              <button
                onClick={handleAddComment}
                className="bg-blue-500 text-white px-3 rounded"
              >
                Enviar
              </button>
            </div>
          </div>

          {/* ================================
              📜 HISTÓRICO
             ================================ */}
          <div>
            <h3 className="font-semibold mb-2">
              📜 Histórico
            </h3>

            <div className="text-xs text-gray-600 space-y-1 max-h-32 overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id}>
                  {log.action} —{" "}
                  {new Date(log.createdAt).toLocaleString()}
                </div>
              ))}
            </div>
          </div>

          {/* ================================
              🔘 AÇÕES
             ================================ */}
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