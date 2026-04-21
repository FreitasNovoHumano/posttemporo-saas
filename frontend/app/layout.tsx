import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// 🔹 Contextos globais
import { AuthProvider } from "../context/AuthContext";
import { CompanyProvider } from "../context/CompanyContext";

// 🔔 Toast global
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
  title: "PostTempero",
  description: "Sistema de gestão de conteúdo para restaurantes",
};

/**
 * 🧠 RootLayout
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        
        {/* 🔐 Auth global */}
        <AuthProvider>

          {/* 🏢 Multi-tenant (empresa ativa) */}
          <CompanyProvider>

            {children}

            {/* 🔔 Toast global (tempo real) */}
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
        </AuthProvider>

      </body>
    </html>
  );
}