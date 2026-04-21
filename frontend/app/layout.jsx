/**
 * =====================================================
 * 🧱 ROOT LAYOUT (SaaS PRO)
 * =====================================================
 * - Sidebar fixa (desktop)
 * - Header topo
 * - Responsivo (mobile com menu)
 * - Toast global
 * =====================================================
 */

import Sidebar from "@/app/components/layout/Sidebar";
import Header from "@/app/components/layout/Header";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-100">
        <div className="flex h-screen">
          
          {/* SIDEBAR (desktop) */}
          <Sidebar />

          {/* CONTAINER PRINCIPAL */}
          <div className="flex-1 flex flex-col">
            
            {/* HEADER */}
            <Header />

            {/* CONTEÚDO */}
            <main className="flex-1 p-6 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>

        <Toaster position="top-right" />
      </body>
    </html>
  );
}