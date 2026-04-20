"use client";

/**
 * 📄 Página do calendário
 */

import { useEffect, useState } from "react";
import CalendarView from "../../components/calendar/page";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);

  /**
   * 🔄 Carrega eventos do backend
   */
  async function loadPosts() {
    const res = await fetch("http://localhost:3001/posts", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();

    const mapped = data
      .filter((p) => p.scheduledAt)
      .map((post) => ({
        id: post.id,
        title: post.title,
        start: new Date(post.scheduledAt),
        end: new Date(post.scheduledAt),
        status: post.status,
        image: post.image,
      }));

    setEvents(mapped);
  }

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <div className="p-6">
      <CalendarView events={events} setEvents={setEvents} />
    </div>
  );
}