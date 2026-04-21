"use client";

import { useEffect, useState } from "react";
import { useCompany } from "@/context/CompanyContext";
import useNotifications from "@/hooks/useNotifications";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * =====================================================
 * 🔔 NOTIFICATIONS (REALTIME + LIST)
 * =====================================================
 */

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const { companyId } = useCompany();
  const { unreadCount } = useNotifications(companyId);

  /**
   * 🔹 Buscar notificações do backend
   */
  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch(`${API_URL}/notifications`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const json = await res.json();
        setNotifications(json || []);
      } catch (error) {
        console.error("Erro ao buscar notificações:", error);
      }
    }

    fetchNotifications();
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow relative">
      {/* 🔔 Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold">Notificações</h3>

        {/* 🔴 Badge */}
        <div className="relative">
          🔔
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      {/* 📄 Lista */}
      <div className="space-y-2">
        {notifications.length === 0 ? (
          <p className="text-sm text-gray-500">
            Nenhuma notificação
          </p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`text-sm border-b py-2 ${
                n.read ? "text-gray-500" : "font-semibold"
              }`}
            >
              {n.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
}