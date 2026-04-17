// 🔹 Ícone de notificação
import { Bell } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
      
      {/* 🔹 Título */}
      <h2 className="text-lg font-semibold">Painel</h2>

      {/* 🔹 Área do usuário */}
      <div className="flex items-center gap-4">
        <Bell className="text-gray-500" />

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Fábio</span>

          {/* Avatar */}
          <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
        </div>
      </div>
    </header>
  );
}