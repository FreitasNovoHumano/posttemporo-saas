"use client";

/**
 * =====================================================
 * 📅 CALENDAR PAGE (PRO - ESTILO INSTAGRAM)
 * =====================================================
 * Responsável por:
 * - Buscar posts do backend
 * - Transformar posts em eventos visuais
 * - Permitir drag & drop (reagendar)
 * - Atualizar em tempo real (WebSocket)
 *
 * Integração:
 * - GET /posts
 * - PUT /posts/:id/schedule
 * =====================================================
 */

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import CalendarView from "@/components/calendar/CalendarView";

/**
 * 🔹 API
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CalendarPage() {
  /**
   * =====================================================
   * 📦 STATES
   * =====================================================
   */
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setLoading(true);

      const res = await fetch(`${API_URL}/posts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao buscar posts");

      const json = await res.json();

      /**
       * 🔥 POSTS → EVENTOS (COM IMAGEM)
       */
      const formatted = json.data
        .filter((post) => post.scheduledDate)
        .map((post) => ({
          id: post.id,
          title: post.title,
          start: new Date(post.scheduledDate),
          end: new Date(post.scheduledDate),
          status: post.status,
          image: post.image, // 🔥 NOVO
        }));

      setEvents(formatted);

    } catch (err) {
      console.error("❌ Erro ao carregar calendário:", err);
      setError(err.message || "Erro inesperado");
    } finally {
      setLoading(false);
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
   * ⚡ DRAG OTIMISTA (SEM RELOAD TOTAL)
   * =====================================================
   */
  async function handleMoveEvent({ id, newStart }) {
    /**
     * 🧠 Backup
     */
    const previous = [...events];

    /**
     * ⚡ Atualiza UI instantaneamente
     */
    setEvents((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, start: newStart, end: newStart }
          : e
      )
    );

    try {
      await fetch(`${API_URL}/posts/${id}/schedule`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          date: newStart,
        }),
      });

    } catch (err) {
      console.error("❌ Erro ao reagendar:", err);

      /**
       * 🔙 Rollback
       */
      setEvents(previous);
    }
  }

  /**
   * =====================================================
   * ⏳ LOADING
   * =====================================================
   */
  if (loading) {
    return (
      <div className="p-6">
        <p>Carregando calendário...</p>
      </div>
    );
  }

  /**
   * =====================================================
   * ❌ ERROR
   * =====================================================
   */
  if (error) {
    return (
      <div className="p-6 text-red-500">
        <p>Erro: {error}</p>
      </div>
    );
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
        <h1 className="text-2xl font-bold">Calendário</h1>
        <p className="text-gray-600">
          Gerencie seus posts agendados
        </p>
      </div>

      {/* CALENDÁRIO */}
      <CalendarView
        events={events}
        onMoveEvent={handleMoveEvent}
      />
    </div>
  );
}