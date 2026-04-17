"use client";

// 🔹 Navegação do Next
import Link from "next/link";
import { usePathname } from "next/navigation";

// 🔹 Ícones modernos
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Image,
} from "lucide-react";

// 🔹 Componente Sidebar
export default function Sidebar() {
  const pathname = usePathname();

  // 🔹 Menu do sistema
  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Posts", path: "/posts", icon: FileText },
    { name: "Calendário", path: "/calendar", icon: Calendar },
    { name: "Mídia", path: "/media", icon: Image },
  ];

  return (
    <aside className="w-64 bg-[#0f172a] text-white p-6 flex flex-col">
      
      {/* 🔹 Logo */}
      <h1 className="text-2xl font-bold mb-10">
        🍽 PostTempero
      </h1>

      {/* 🔹 Menu */}
      <nav className="flex flex-col gap-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                active
                  ? "bg-white/10"
                  : "hover:bg-white/5"
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}