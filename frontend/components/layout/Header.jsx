"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const menu = [
    { name: "📊 Dashboard", href: "/dashboard" },
    { name: "🧱 Kanban", href: "/kanban" },
    { name: "📅 Calendário", href: "/calendar" },
  ];

  return (
    <>
      {/* MOBILE BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 bg-white p-2 rounded shadow md:hidden"
      >
        ☰
      </button>

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:relative z-40
          w-64 bg-white shadow-lg p-4 h-full
          transition-transform
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* CLOSE MOBILE */}
        <button
          onClick={() => setOpen(false)}
          className="md:hidden mb-4"
        >
          ✖
        </button>

        <h1 className="text-xl font-bold mb-6">PostTempero</h1>

        <nav className="space-y-2">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                block p-2 rounded-lg transition
                ${
                  pathname === item.href
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100"
                }
              `}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}