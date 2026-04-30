import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// 🌐 Providers globais (NextAuth + React Query + DnD)
import { Providers } from "./providers";

// 🏢 Contexto de negócio
import { CompanyProvider } from "../context/CompanyContext";

// 🔔 Toast
import { Toaster } from "react-hot-toast";

/**
 * 🔤 Fontes otimizadas
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
 * 📄 Metadata
 */
export const metadata: Metadata = {
  title: "Freitas Post Growth",
  description: "Sistema de geração e gestão de conteúdo",
};

/**
 * 🧠 ROOT LAYOUT (SAAS READY)
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

            {children}

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