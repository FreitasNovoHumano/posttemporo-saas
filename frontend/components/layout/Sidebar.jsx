"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const path = usePathname();

  const menu = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Kanban", href: "/kanban" },
    { name: "Calendário", href: "/calendar" },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg p-4">
      <h1 className="text-xl font-bold mb-6">PostTempero</h1>

      <nav className="space-y-2">
        {menu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`
              block p-2 rounded-lg transition
              ${path === item.href
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-100"}
            `}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}