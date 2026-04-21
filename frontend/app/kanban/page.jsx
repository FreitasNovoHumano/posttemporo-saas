"use client";

import { useEffect, useState } from "react";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import Notifications from "@/components/notifications/Notifications";


const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function KanbanPage() {
  const [posts, setPosts] = useState([]);

  /**
   * 🔄 Buscar posts
   */
  async function fetchPosts() {
    const res = await fetch(`${API_URL}/posts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const json = await res.json();
    setPosts(json.data);
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  /**
   * 🔥 INTEGRAÇÃO COM BACKEND (AQUI!)
   */
  async function handleMove(postId, status) {
    await fetch(`${API_URL}/posts/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status }),
    });

    /**
     * 🔁 Atualiza UI
     */
    fetchPosts();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Kanban</h1>

      <KanbanBoard
        posts={posts}
        onMove={handleMove}
      />
    </div>
  );
}