import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// 🔹 Contexto global de autenticação
import { AuthProvider } from "../context/AuthContext";

/**
 * 🔤 Fontes padrão do projeto
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
 * 📄 Metadata da aplicação
 */
export const metadata: Metadata = {
  title: "PostTempero",
  description: "Sistema de gestão de conteúdo para restaurantes",
};

/**
 * 🧠 RootLayout (Server Component)
 * -----------------------------------
 * Responsável por envolver toda a aplicação
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        
        {/* 🔐 Provider global de autenticação */}
        <AuthProvider>
          {children}
        </AuthProvider>

      </body>
    </html>
  );
}