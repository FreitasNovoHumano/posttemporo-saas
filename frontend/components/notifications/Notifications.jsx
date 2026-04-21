"use client";

import { useState, useRef, useEffect } from "react";
import { useCompany } from "@/context/CompanyContext";
import useNotifications from "@/hooks/useNotifications";

import groupNotifications from "@/utils/groupNotifications";

/**
 * =====================================================
 * 🔔 NOTIFICATIONS (PRO - INSTAGRAM STYLE)
 * =====================================================
 * - Realtime
 * - Infinite scroll
 * - Badge contador 🔴
 * - Dropdown interativo
 * - Cache via React Query
 * =====================================================
 */

export default function Notifications() {
  const [open, setOpen] = useState(false);

  const loaderRef = useRef(null);

  const { companyId } = useCompany();

  const {
    notifications,
    unreadCount,
    loadMore,
    hasMore,
    isLoading,
  } = useNotifications(companyId);

  const grouped = groupNotifications(notifications);

  /**
   * 🔥 Infinite Scroll (Intersection Observer)
   */
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return (
    <div className="relative">
      {/* 🔔 BOTÃO */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative"
      >
        🔔

        {/* 🔴 Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* 📥 DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg p-4 z-50">
          {/* 🔹 Header */}
          <div className="flex justify-between mb-2">
            <h3 className="font-bold">Notificações</h3>
          </div>

          {/* 📄 LISTA */}
          <div className="max-h-80 overflow-y-auto space-y-2">
            {/* 🔄 Loading inicial */}
            {isLoading && (
              <p className="text-sm text-gray-500">
                Carregando...
              </p>
            )}

            {/* ❌ Vazio */}
            {!isLoading && notifications.length === 0 && (
              <p className="text-sm text-gray-500">
                Nenhuma notificação
              </p>
            )}

            {/* 🔥 Feed */}
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-2 rounded cursor-pointer transition ${
                  n.read
                    ? "bg-gray-100 text-gray-500"
                    : "bg-blue-50 font-semibold"
                }`}
              >
                {n.message}
              </div>
            ))}

            {/* 🔥 Loader infinito */}
            {hasMore && (
              <div
                ref={loaderRef}
                className="text-center text-xs text-gray-400 py-2"
              >
                Carregando mais...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}