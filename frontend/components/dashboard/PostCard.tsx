"use client";

import PostStatus from "../dashboard/PostStatus";
import { approvePost, rejectPost } from "../../services/api";

/**
 * 🔹 Tipagem do Post (ajuste conforme seu backend)
 */
interface Post {
  id: number;
  title: string;
  description: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  image?: string;
  rejectionComment?: string;
}

/**
 * 🔹 Tipagem das props do componente
 */
interface PostCardProps {
  post: Post;
  onUpdate: () => Promise<void> | void;
}

/**
 * 🔹 Componente responsável por exibir um post individual
 * - Permite aprovar
 * - Rejeitar com comentário
 * - Deletar post
 */
export default function PostCard({ post, onUpdate }: PostCardProps) {
  
  /**
   * ✅ Aprovar post
   */
  async function handleApprove() {
    await approvePost(post.id);
    await onUpdate();
  }

  /**
   * ❌ Rejeitar post com motivo
   */
  async function handleReject() {
    const comment = prompt("Motivo da rejeição:");
    if (!comment) return;

    await rejectPost(post.id, comment);
    await onUpdate();
  }

  /**
   * 🗑️ Deletar post
   */
  async function handleDelete() {
    const confirmed = confirm("Deseja deletar?");
    if (!confirmed) return;

    await fetch(`http://localhost:3001/posts/${post.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    await onUpdate();
  }

  return (
    <div className="border rounded-xl p-4 shadow bg-white space-y-3">

      {/* 🔹 Título */}
      <h3 className="font-bold text-lg">{post.title}</h3>

      {/* 🔹 Descrição */}
      <p className="text-gray-600">{post.description}</p>

      {/* 🔹 Status */}
      <PostStatus status={post.status} />

      {/* 🔹 Imagem */}
      {post.image && (
        <img
          src={`http://localhost:3001/uploads/${post.image}`}
          alt={post.title}
          className="rounded-lg"
        />
      )}

      {/* 🔹 Ações (Apenas se estiver pendente) */}
      {post.status === "PENDING" && (
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleApprove}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Aprovar
          </button>

          <button
            onClick={handleReject}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Rejeitar
          </button>
        </div>
      )}

      {/* 🔹 Botão de deletar (sempre visível) */}
      <button
        onClick={handleDelete}
        className="bg-gray-800 text-white px-3 py-1 rounded"
      >
        Deletar
      </button>

      {/* 🔹 Comentário de rejeição */}
      {post.status === "REJECTED" && (
        <p className="text-sm text-red-500">
          Motivo: {post.rejectionComment}
        </p>
      )}
    </div>
  );
}