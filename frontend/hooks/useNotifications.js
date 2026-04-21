"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function useNotifications(companyId) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!companyId) return;

    const socket = io("http://localhost:3001");

    socket.emit("join_company", companyId);

    socket.on("notification:new", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => socket.disconnect();
  }, [companyId]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
  };
}