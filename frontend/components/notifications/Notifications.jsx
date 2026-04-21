"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  async function fetchNotifications() {
    const res = await fetch(`${API_URL}/notifications`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const json = await res.json();
    setNotifications(json.data);
  }

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="font-bold mb-3">🔔 Notificações</h3>

      {notifications.map((n) => (
        <div
          key={n.id}
          className="text-sm border-b py-2"
        >
          {n.message}
        </div>
      ))}
    </div>
  );
}