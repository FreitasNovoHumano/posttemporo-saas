"use client";

/**
 * =====================================================
 * 🔔 NOTIFICATIONS (PRO - SAAS READY)
 * =====================================================
 *
 * 🎯 RESPONSABILIDADES:
 * - Exibir notificações em tempo real
 * - Controle de estado (aberto/fechado)
 * - Infinite scroll (IntersectionObserver)
 * - Badge de não lidas
 *
 * ⚙️ MELHORIAS IMPLEMENTADAS:
 * - Proteção contra múltiplos loads
 * - Click outside (UX)
 * - Código limpo (sem lixo)
 * - Estrutura escalável
 *
 * =====================================================
 */

import { useState, useRef, useEffect } from "react";

import { useCompany } from "@/context/CompanyContext";
import useNotifications from "@/hooks/useNotifications";

export default function Notifications() {
  const [open, setOpen] = useState(false);

  const containerRef = useRef(null);
  const loaderRef = useRef(null);

  const { companyId } = useCompany();

  const {
    notifications,
    unreadCount,
    loadMore,
    hasMore,
    isLoading,
  } = useNotifications(companyId);

  /**
   * 🔥 Infinite Scroll controlado
   */
  useEffect(() => {
    if (!loaderRef.current) return;

    let isFetching = false;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isFetching) {
        isFetching = true;
        loadMore().finally(() => {
          isFetching = false;
        });
      }
    });

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  /**
   * 🖱️ Fecha ao clicar fora
   */
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* 🔔 BOTÃO */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative"
        aria-label="Abrir notificações"
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

            {/* ❌ Estado vazio */}
            {!isLoading && notifications.length === 0 && (
              <p className="text-sm text-gray-500 text-center">
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