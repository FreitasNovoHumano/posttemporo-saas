"use client";

/**
 * =====================================================
 * 📅 CALENDAR PAGE
 * =====================================================
 * Responsável por:
 * - Buscar posts do backend
 * - Transformar posts em eventos do calendário
 * - Permitir drag & drop (reagendar posts)
 * - Persistir alterações no banco
 *
 * Integração:
 * - GET /posts
 * - PUT /posts/:id/schedule
 * =====================================================
 */

import { useEffect, useState } from "react";
import CalendarView from "@/components/calendar/CalendarView";

/**
 * 🔹 URL da API (env)
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CalendarPage() {
  /**
   * 📦 Estados
   */
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * 🔄 Buscar posts e converter para eventos
   */
  async function fetchPosts() {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/posts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        throw new Error("Erro ao buscar posts");
      }

      const json = await res.json();

      /**
       * 📅 Converter posts → eventos do calendário
       */
      const formatted = json.data
        .filter((post) => post.scheduledDate) // só agendados
        .map((post) => ({
          id: post.id,
          title: post.title,
          start: new Date(post.scheduledDate),
          end: new Date(post.scheduledDate),
          status: post.status,
        }));

      setEvents(formatted);

    } catch (err) {
      console.error("❌ Erro ao carregar calendário:", err);
      setError(err.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  /**
   * 🔥 Drag & Drop → salvar no banco
   */
  async function handleMoveEvent({ id, newStart }) {
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

      /**
       * 🔁 Atualiza UI após mover
       */
      fetchPosts();

    } catch (err) {
      console.error("❌ Erro ao reagendar post:", err);
    }
  }

  /**
   * ⏳ LOADING
   */
  if (loading) {
    return (
      <div className="p-6">
        <p>Carregando calendário...</p>
      </div>
    );
  }

  /**
   * ❌ ERROR
   */
  if (error) {
    return (
      <div className="p-6 text-red-500">
        <p>Erro: {error}</p>
      </div>
    );
  }

  /**
   * 🎯 RENDER PRINCIPAL
   */
  return (
    <div className="p-6 space-y-6">
      {/* ================================
          📌 HEADER
         ================================ */}
      <div>
        <h1 className="text-2xl font-bold">Calendário</h1>
        <p className="text-gray-600">
          Gerencie seus posts agendados
        </p>
      </div>

      {/* ================================
          📅 CALENDÁRIO
         ================================ */}
      <CalendarView
        events={events}
        onMoveEvent={handleMoveEvent}
      />
    </div>
  );
}