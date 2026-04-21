"use client";

import CompanySwitcher from "./CompanySwitcher";
import Notifications from "@/components/notifications/Notifications";

/**
 * =====================================================
 * 🔝 HEADER (SaaS UI)
 * =====================================================
 * - Logo
 * - Troca de empresa
 * - Notificações (realtime)
 * =====================================================
 */

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
      {/* 🔹 Logo */}
      <h1 className="text-lg font-bold">PostTempero</h1>

      {/* 🔹 Ações do usuário */}
      <div className="flex items-center gap-4">
        <CompanySwitcher />
        <Notifications />
      </div>
    </header>
  );
}