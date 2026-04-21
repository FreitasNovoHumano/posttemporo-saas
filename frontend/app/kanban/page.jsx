"use client";

/**
 * =====================================================
 * 🧱 KANBAN PAGE (PRO + UX)
 * =====================================================
 * Responsável por:
 * - Buscar posts
 * - Drag otimista
 * - Editar / deletar
 * - Tempo real (socket)
 * - Feedback visual (toast)
 * =====================================================
 */

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import KanbanBoard from "@/components/kanban/KanbanBoard";
import Notifications from "@/app/components/notifications/Notifications";
import PostModal from "@/components/kanban/PostModal";

import PageTransition from "@/app/components/ui/PageTransition";
import Skeleton from "@/app/components/ui/Skeleton";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function KanbanPage() {
  /**
   * =====================================================
   * 📦 STATES
   * =====================================================
   */
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * =====================================================
   * 🔌 SOCKET (REALTIME)
   * =====================================================
   */
  useEffect(() => {
    const socket = io(API_URL);

    socket.on("refreshPosts", fetchPosts);

    return () => socket.disconnect();
  }, []);

  /**
   * =====================================================
   * 🔄 FETCH POSTS
   * =====================================================
   */
  async function fetchPosts() {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/posts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const json = await res.json();
      setPosts(json.data);

    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar posts");
    } finally {
      setLoading(false);
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
    const backup = [...posts];

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

      toast.success("Status atualizado 🚀");

    } catch (err) {
      setPosts(backup);
      toast.error("Erro ao mover post");
    }
  }

  /**
   * =====================================================
   * 🗑️ DELETE
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

      setPosts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Post deletado");

    } catch {
      toast.error("Erro ao deletar");
    }
  }

  /**
   * =====================================================
   * ✏️ UPDATE
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
        body: JSON.stringify(post),
      });

      fetchPosts();
      toast.success("Post atualizado");

    } catch {
      toast.error("Erro ao atualizar");
    }
  }

  /**
   * =====================================================
   * ⏳ LOADING
   * =====================================================
   */
  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  /**
   * =====================================================
   * 🎯 RENDER
   * =====================================================
   */
  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Kanban</h1>
          <p className="text-gray-600">
            Gerencie seus posts com drag & drop
          </p>
        </div>

        <KanbanBoard
          posts={posts}
          onMove={handleMove}
          onCardClick={setSelectedPost}
          onDelete={handleDelete}
        />

        {selectedPost && (
          <PostModal
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
            onSave={handleUpdate}
          />
        )}

        <Notifications />
      </div>
    </PageTransition>
  );
}