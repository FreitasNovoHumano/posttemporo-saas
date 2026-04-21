import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// 🔹 Contexto global
import { AuthProvider } from "../context/AuthContext";

/**
 * 🔤 Configuração de fontes (Next.js otimizado)
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * 📄 Metadata global da aplicação
 */
export const metadata: Metadata = {
  title: "PostTempero",
  description: "Sistema de gestão de conteúdo para restaurantes",
};

/**
 * 🧠 RootLayout (Server Component)
 * --------------------------------------------------
 * Responsável por:
 * - Estrutura HTML base
 * - Fontes globais
 * - Providers globais (Auth, Theme, etc)
 *
 * ❌ NÃO deve conter:
 * - Componentes de página (Dashboard, Posts, etc)
 * - Lógica de UI específica
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        
        {/* 🔐 Provider global de autenticação */}
        <AuthProvider>
          {children}
        </AuthProvider>

      </body>
    </html>
  );
}