"use client";

/**
 * =====================================================
 * 🧱 KANBAN PAGE (PRO - COMPLETO)
 * =====================================================
 * Responsável por:
 * - Buscar posts
 * - Drag otimista (sem reload)
 * - Deletar post
 * - Editar post (modal)
 * - Sincronizar UI
 *
 * 🔐 Protegido via JWT
 * =====================================================
 */

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import KanbanBoard from "@/components/kanban/KanbanBoard";
import Notifications from "@/app/components/notifications/Notifications";
import PostModal from "@/components/kanban/PostModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function KanbanPage() {
  /**
   * =====================================================
   * 📦 STATES
   * =====================================================
   */
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  /**
   * =====================================================
   * 🔌 SOCKET (TEMPO REAL)
   * =====================================================
   */
  useEffect(() => {
    const socket = io(API_URL);

    socket.on("refreshPosts", () => {
      fetchPosts();
    });

    return () => socket.disconnect();
  }, []);

  /**
   * =====================================================
   * 🔄 FETCH POSTS
   * =====================================================
   */
  async function fetchPosts() {
    try {
      const res = await fetch(`${API_URL}/posts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const json = await res.json();
      setPosts(json.data);

    } catch (error) {
      console.error("❌ Erro ao buscar posts:", error);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  /**
   * =====================================================
   * ⚡ DRAG OTIMISTA
   * =====================================================
   */
  async function handleMove({ postId, newStatus }) {
    const previous = [...posts];

    setPosts((prev) =>
      prev.map((p) =>
        p.id === Number(postId)
          ? { ...p, status: newStatus }
          : p
      )
    );

    try {
      await fetch(`${API_URL}/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

    } catch (error) {
      console.error("❌ Erro no drag:", error);
      setPosts(previous);
    }
  }

  /**
   * =====================================================
   * 🗑️ DELETAR POST
   * =====================================================
   */
  async function handleDelete(id) {
    try {
      await fetch(`${API_URL}/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      /**
       * 🔁 Atualiza UI
       */
      setPosts((prev) => prev.filter((p) => p.id !== id));

    } catch (error) {
      console.error("❌ Erro ao deletar:", error);
    }
  }

  /**
   * =====================================================
   * ✏️ EDITAR POST (MODAL)
   * =====================================================
   */
  async function handleUpdate(post) {
    try {
      await fetch(`${API_URL}/posts/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: post.title,
          description: post.description,
        }),
      });

      /**
       * 🔁 Atualiza lista
       */
      fetchPosts();

    } catch (error) {
      console.error("❌ Erro ao atualizar:", error);
    }
  }

  /**
   * =====================================================
   * 🎯 RENDER
   * =====================================================
   */
  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Kanban</h1>
        <p className="text-gray-600">
          Gerencie seus posts com drag & drop
        </p>
      </div>

      {/* BOARD */}
      <KanbanBoard
        posts={posts}
        onMove={handleMove}
        onCardClick={setSelectedPost}   // 🔥 abrir modal
        onDelete={handleDelete}         // 🔥 menu ⋮
      />

      {/* MODAL */}
      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onSave={handleUpdate}
        />
      )}

      {/* NOTIFICAÇÕES */}
      <Notifications />
    </div>
  );
}