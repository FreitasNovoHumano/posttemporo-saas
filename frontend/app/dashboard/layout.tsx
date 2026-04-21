// 🔹 Componentes do layout (UI)
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

/**
 * 🧠 DashboardLayout (App Router - Next.js)
 * --------------------------------------------------
 * Layout aplicado automaticamente em TODAS as rotas:
 * /dashboard/*
 *
 * 🎯 Responsabilidades:
 * - Estrutura visual do dashboard
 * - Sidebar fixa
 * - Header global
 * - Área de conteúdo dinâmica
 *
 * ❌ NÃO deve conter:
 * - lógica de negócio
 * - chamadas de API
 * - estado global complexo
 *
 * ✅ Deve conter:
 * - estrutura UI
 * - organização visual
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 🔹 Container principal
    <div className="flex h-screen bg-gray-100">

      {/* ========================================
          📌 SIDEBAR (menu lateral fixo)
          ======================================== */}
      <aside className="w-64 shrink-0 border-r bg-white">
        <Sidebar />
      </aside>

      {/* ========================================
          📌 ÁREA PRINCIPAL
          ======================================== */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* 🔹 HEADER fixo no topo */}
        <header className="h-16 shrink-0 border-b bg-white flex items-center px-6">
          <Header />
        </header>

        {/* ========================================
            📌 CONTEÚDO DINÂMICO
            ======================================== */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

      </div>
    </div>
  );
}