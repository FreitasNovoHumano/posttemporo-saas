"use client";

import { useState, useRef, useEffect } from "react";
import { useCompany } from "@/context/CompanyContext";
import useNotifications from "@/hooks/useNotifications";

export default function Notifications() {
  const [open, setOpen] = useState(false);
  const loaderRef = useRef(null);

  const { companyId } = useCompany();
  const {
    notifications,
    unreadCount,
    loadMore,
    hasMore,
  } = useNotifications(companyId);

  /**
   * 🔥 Intersection Observer (Instagram style)
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
  }, [hasMore]);

  return (
    <div className="relative">
      {/* 🔔 BOTÃO */}
      <button onClick={() => setOpen(!open)} className="relative">
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* 📥 DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg p-4 z-50">
          <h3 className="font-bold mb-2">Notificações</h3>

          <div className="max-h-80 overflow-y-auto space-y-2">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-2 rounded ${
                  n.read ? "bg-gray-100" : "bg-blue-50 font-semibold"
                }`}
              >
                {n.message}
              </div>
            ))}

            {/* 🔥 Loader invisível */}
            {hasMore && (
              <div ref={loaderRef} className="h-10" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}