"use client";

/**
 * =====================================================
 * 📅 CALENDAR PAGE (PRO)
 * =====================================================
 * Responsável por:
 * - Buscar posts do backend
 * - Converter posts → eventos do calendário
 * - Reagendar posts (drag & drop)
 * - Exibir loading / error
 *
 * 🔐 Protegido via JWT
 * =====================================================
 */

import { useEffect, useState } from "react";
import CalendarView from "@/components/calendar/CalendarView";
import PageTransition from "@/app/components/ui/PageTransition";
import Skeleton from "@/app/components/ui/Skeleton";
import toast from "react-hot-toast";

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
   * 🔄 FETCH POSTS → EVENTS
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
       * 🔄 Converter posts → eventos
       */
      const formatted = json.data
        .filter((p) => p.scheduledDate)
        .map((p) => ({
          id: p.id,
          title: p.title,
          start: new Date(p.scheduledDate),
          end: new Date(p.scheduledDate),
          status: p.status,
          image: p.image,
        }));

      setEvents(formatted);

    } catch (err) {
      console.error(err);
      setError(err.message);
      toast.error("Erro ao carregar calendário");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  /**
   * =====================================================
   * 🔄 DRAG → SALVAR NO BACKEND
   * =====================================================
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

      toast.success("Post reagendado 📅");
      fetchPosts();

    } catch (err) {
      console.error(err);
      toast.error("Erro ao reagendar");
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
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  /**
   * ❌ ERROR
   */
  if (error) {
    return (
      <div className="p-6 text-red-500">
        Erro: {error}
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
          <h1 className="text-2xl font-bold">Calendário</h1>
          <p className="text-gray-600">
            Gerencie seus posts agendados
          </p>
        </div>

        <CalendarView
          events={events}
          onMoveEvent={handleMoveEvent}
        />
      </div>
    </PageTransition>
  );
}