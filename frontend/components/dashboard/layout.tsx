// 🔹 Importa componentes reutilizáveis do layout
import Sidebar from "../Sidebar";
import Header from "../Header";

/**
 * 🧠 DashboardLayout
 * --------------------------------------------------
 * Este layout envolve TODAS as páginas dentro de:
 * /app/dashboard/*
 *
 * 👉 Ele garante:
 * - Sidebar fixa à esquerda
 * - Header no topo
 * - Conteúdo dinâmico no centro
 *
 * 👉 children = conteúdo da página atual
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 🔹 Container principal (layout horizontal)
    <div className="flex h-screen bg-gray-100">
      
      {/* 🔹 SIDEBAR (menu lateral) */}
      {/* Fica fixa ocupando largura lateral */}
      <Sidebar />

      {/* 🔹 ÁREA PRINCIPAL */}
      {/* Ocupa todo o espaço restante */}
      <div className="flex-1 flex flex-col">

        {/* 🔹 HEADER (topo do sistema) */}
        {/* Ideal para usuário logado, logout, etc */}
        <Header />

        {/* 🔹 CONTEÚDO DINÂMICO */}
        {/* Aqui entram as páginas: dashboard, approvals, etc */}
        <main className="p-8 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
}