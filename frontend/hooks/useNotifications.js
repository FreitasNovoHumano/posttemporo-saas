"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { useInfiniteQuery } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * =====================================================
 * 🔔 useNotifications (PRO - React Query + Realtime)
 * =====================================================
 * - Cache automático
 * - Paginação infinita
 * - Realtime via socket
 * - Contador 🔴
 * =====================================================
 */

export default function useNotifications(companyId) {
  /**
   * 🔥 Query com paginação infinita
   */
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(
        `${API_URL}/notifications?page=${pageParam}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Erro ao buscar notificações");
      }

      return res.json();
    },
    getNextPageParam: (lastPage, pages) => {
      // 🔥 Se veio vazio → acabou
      if (!lastPage.length) return undefined;

      return pages.length + 1;
    },
    enabled: !!companyId, // 🔒 só roda se tiver empresa
  });

  /**
   * 🔥 Flatten (junta páginas)
   */
  const notifications = data?.pages.flat() || [];

  /**
   * 🔥 Realtime via socket
   */
  useEffect(() => {
    if (!companyId) return;

    const socket = io("http://localhost:3001");

    socket.emit("join_company", companyId);

    socket.on("notification:new", () => {
      /**
       * 🔥 Atualiza cache automaticamente
       */
      refetch();
    });

    return () => socket.disconnect();
  }, [companyId, refetch]);

  /**
   * 🔴 Contador
   */
  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    loadMore: fetchNextPage,
    hasMore: hasNextPage,
    isLoading,
  };
}