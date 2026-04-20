"use client";

// 🔹 Navegação do Next
import Link from "next/link";
import { usePathname } from "next/navigation";

// 🔹 Ícones
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Image,
  CheckCircle,
} from "lucide-react";

/**
 * 🧠 Sidebar (Menu lateral)
 * --------------------------------------------------
 * Responsável pela navegação principal do sistema
 */
export default function Sidebar() {
  const pathname = usePathname();

  /**
   * 🔹 Menu centralizado
   * --------------------------------------------------
   * Cada item agora possui:
   * - name (label)
   * - path (rota)
   * - icon (ícone do menu)
   */
  const menu = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Posts",
      path: "/dashboard/posts",
      icon: FileText,
    },
    {
      name: "Aprovações",
      path: "/dashboard/approvals",
      icon: CheckCircle,
    },
    {
      name: "Calendário",
      path: "/dashboard/calendar",
      icon: Calendar,
    },
    {
      name: "Mídia",
      path: "/dashboard/media",
      icon: Image,
    },
  ];

  return (
    <aside className="w-64 bg-[#0f172a] text-white p-6 flex flex-col">
      
      {/* 🔹 Logo */}
      <h1 className="text-2xl font-bold mb-10">
        🍽 PostTempero
      </h1>

      {/* 🔹 Menu */}
      <nav className="flex flex-col gap-2">
        {menu.map((item, index) => {
          const Icon = item.icon;

          /**
           * 🔥 Ativa também subrotas
           * Ex: /dashboard/posts/1
           */
          const active = pathname.startsWith(item.path);

          return (
            <Link
              key={`${item.path}-${index}`} // 🔥 evita duplicação
              href={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                active
                  ? "bg-white/10"
                  : "hover:bg-white/5"
              }`}
            >
              {/* 🔹 Ícone */}
              <Icon size={18} />

              {/* 🔹 Texto */}
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}