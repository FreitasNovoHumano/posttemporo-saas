/**
 * =====================================================
 * 🧱 ROOT LAYOUT (PRO - SAAS READY)
 * =====================================================
 *
 * 🎯 RESPONSABILIDADES:
 * - Providers globais (Auth, Company)
 * - Toast global
 * - Base HTML
 *
 * ❗ NÃO contém Sidebar/Header
 * (isso vai para layout privado)
 *
 * =====================================================
 */

import { AuthProvider } from "@/context/AuthContext";
import { CompanyProvider } from "@/context/CompanyContext";

import { Toaster } from "react-hot-toast";

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-100">
        <AuthProvider>
          <CompanyProvider>
            {children}
          </CompanyProvider>
        </AuthProvider>

        <Toaster position="top-right" />
      </body>
    </html>
  );
}