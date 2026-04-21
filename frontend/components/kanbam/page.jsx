"use client";

/**
 * =====================================================
 * 🧱 KANBAN PAGE (NÍVEL TRELLO + REALTIME)
 * =====================================================
 * Responsável por:
 * - Buscar posts do backend
 * - Renderizar Kanban Board
 * - Drag otimista (sem reload)
 * - Modal de edição
 * - Atualização em tempo real (WebSocket)
 *
 * Features:
 * ✅ Drag otimista
 * ✅ Rollback
 * ✅ Modal de edição
 * ✅ WebSocket (multi-user)
 * =====================================================
 */

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import KanbanBoard from "@/components/kanban/KanbanBoard";
import Notifications from "@/app/components/notifications/Notifications";
import EditPostModal from "@/components/kanban/EditPostModal";

/**
 * 🔹 API
 */
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

    socket.on("connect", () => {
      console.log("🟢 Conectado ao socket");
    });

    /**
     * 🔥 Evento vindo do backend
     */
    socket.on("refreshPosts", () => {
      fetchPosts();
    });

    return () => {
      socket.disconnect();
    };
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

      if (!res.ok) throw new Error("Erro ao buscar posts");

      const json = await res.json();
      setPosts(json.data);

    } catch (error) {
      console.error("❌ Erro ao buscar posts:", error);
    }
  }

  /**
   * 🚀 LOAD INICIAL
   */
  useEffect(() => {
    fetchPosts();
  }, []);

  /**
   * =====================================================
   * ⚡ DRAG OTIMISTA
   * =====================================================
   */
  async function handleMove({ postId, newStatus }) {
    const previousPosts = [...posts];

    /**
     * ⚡ UI instantânea
     */
    setPosts((prev) =>
      prev.map((p) =>
        p.id === Number(postId)
          ? { ...p, status: newStatus }
          : p
      )
    );

    try {
      const res = await fetch(`${API_URL}/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error();

    } catch (error) {
      console.error("❌ Erro no drag:", error);

      /**
       * 🔙 rollback
       */
      setPosts(previousPosts);
    }
  }

  /**
   * =====================================================
   * ✏️ EDITAR POST
   * =====================================================
   */
  async function handleUpdatePost(updatedPost) {
    try {
      await fetch(`${API_URL}/posts/${updatedPost.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: updatedPost.title,
          description: updatedPost.description,
        }),
      });

      fetchPosts();

    } catch (error) {
      console.error("❌ Erro ao atualizar post:", error);
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
        onCardClick={setSelectedPost}
      />

      {/* MODAL */}
      {selectedPost && (
        <EditPostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onSave={handleUpdatePost}
        />
      )}

      {/* NOTIFICAÇÕES */}
      <Notifications />
    </div>
  );
}