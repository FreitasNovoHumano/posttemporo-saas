/**
 * =====================================================
 * 🧱 ROOT LAYOUT (PRO - SAAS READY)
 * =====================================================
 */

import { Providers } from "./providers";
import { CompanyProvider } from "@/context/CompanyContext";
import { Toaster } from "react-hot-toast";

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("LAYOUT ATIVO"); // debug

  return (
    <html lang="pt-BR">
      <body className="bg-gray-100">

        <Providers>
          <CompanyProvider>
            {children}
          </CompanyProvider>
        </Providers>

        <Toaster position="top-right" />

      </body>
    </html>
  );
}