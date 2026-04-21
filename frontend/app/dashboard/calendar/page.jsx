"use client";

import { useEffect, useState } from "react";
import CalendarView from "@/components/calendar/CalendarView";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * 📅 Calendar Page
 * --------------------------------------------------
 * - Busca posts do backend
 * - Envia atualização ao mover
 */
export default function CalendarPage() {
  const [posts, setPosts] = useState([]);

  /**
   * 📥 Buscar posts
   */
  async function fetchPosts() {
    const res = await fetch(`${API_URL}/posts`);
    const data = await res.json();
    setPosts(data);
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  /**
   * 🔄 Atualizar data do post
   */
  async function handleMovePost(postId, newDate) {
    await fetch(`${API_URL}/posts/${postId}/schedule`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        scheduledDate: newDate,
      }),
    });

    fetchPosts(); // atualiza UI
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Calendário</h1>

      <CalendarView posts={posts} onMovePost={handleMovePost} />
    </div>
  );
}