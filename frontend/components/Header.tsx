"use client";

import { useUser } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user } = useUser();
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white border-b">
      
      {/* 🔹 Título */}
      <h1 className="text-xl font-semibold text-gray-800">
        Painel
      </h1>

      {/* 🔹 Usuário */}
      <div className="flex items-center gap-3">
        
        {user && (
          <>
            {/* Nome */}
            <span className="text-sm text-gray-700">
              {user.name}
            </span>

            {/* Avatar (inicial) */}
            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="text-sm text-red-500 hover:underline"
            >
              Sair
            </button>
          </>
        )}

      </div>
    </header>
  );
}