"use client";

/**
 * =====================================================
 * 🧱 KANBAN PAGE (UX PREMIUM)
 * =====================================================
 * Responsável por:
 * - Buscar posts do backend
 * - Renderizar Kanban
 * - Atualizar status com drag otimista
 * - Reverter em caso de erro (rollback)
 *
 * 🔐 Protegido via JWT
 * =====================================================
 */

import { useEffect, useState } from "react";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import Notifications from "@/app/components/notifications/Notifications";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function KanbanPage() {
  /**
   * 📦 Estado global dos posts
   */
  const [posts, setPosts] = useState([]);

  /**
   * 🔄 Buscar posts
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
   * 🚀 DRAG OTIMISTA (SEM RELOAD)
   */
  async function handleMove({ postId, newStatus, oldStatus }) {
    /**
     * 🧠 1. Backup (rollback)
     */
    const previousPosts = [...posts];

    /**
     * ⚡ 2. Atualiza UI instantaneamente
     */
    setPosts((prev) =>
      prev.map((p) =>
        p.id === Number(postId)
          ? { ...p, status: newStatus }
          : p
      )
    );

    try {
      /**
       * 🌐 3. Atualiza no backend
       */
      const res = await fetch(`${API_URL}/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Erro ao atualizar status");
      }

    } catch (error) {
      console.error("❌ Erro no drag:", error);

      /**
       * 🔙 4. ROLLBACK (volta estado anterior)
       */
      setPosts(previousPosts);
    }
  }

  /**
   * 🎯 RENDER
   */
  return (
    <div className="p-6 space-y-6">
      {/* ========================================
          📌 HEADER
         ======================================== */}
      <div>
        <h1 className="text-2xl font-bold">Kanban</h1>
        <p className="text-gray-600">
          Gerencie seus posts com drag & drop
        </p>
      </div>

      {/* ========================================
          🧱 BOARD
         ======================================== */}
      <KanbanBoard
        posts={posts}
        onMove={handleMove}
      />

      {/* ========================================
          🔔 NOTIFICAÇÕES (opcional)
         ======================================== */}
      <Notifications />
    </div>
  );
}