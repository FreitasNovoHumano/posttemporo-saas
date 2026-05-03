import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// 🌐 Providers globais (NextAuth + React Query + DnD)
import { Providers } from "./providers";

// 🏢 Contexto de negócio
import { CompanyProvider } from "../context/CompanyContext";

// 🔔 Toast
import { Toaster } from "react-hot-toast";

// 🔝 Header global
import Header from "../components/layout/Header";

/**
 * 🔤 Fontes otimizadas (Google Fonts)
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
 * 📄 Metadata (SEO + Favicon + Branding)
 *
 * 👉 Aqui definimos:
 * - Nome da aba do navegador
 * - Ícone (favicon)
 * - Descrição para SEO
 */
export const metadata: Metadata = {
  title: "Freitas Growth",

  description:
    "Automação, IA e geração de leads para crescimento de empresas.",

  /**
   * 🖼️ Favicon
   * Certifique-se que o arquivo está em:
   * /public/logo.png
   */
  icons: {
    icon: "/logo.png",
  },
};

/**
 * 🧠 ROOT LAYOUT (SAAS READY)
 *
 * Estrutura global da aplicação:
 * - Providers (Auth, Query, etc)
 * - Contexto de empresa (multi-tenant)
 * - Header global
 * - Conteúdo das páginas
 * - Notificações (Toast)
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>

        {/* 🌐 Providers globais */}
        <Providers>

          {/* 🏢 Contexto multi-tenant */}
          <CompanyProvider>

            {/* 🔝 Header global */}
            <Header />

            {/* 📦 Conteúdo das páginas */}
            <main>
              {children}
            </main>

            {/* 🔔 Toast global */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#333",
                  color: "#fff",
                },
              }}
            />

          </CompanyProvider>
        </Providers>

      </body>
    </html>
  );
}