import Script from "next/script";
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

        <Script id="facebook-pixel" strategy="afterInteractive">
{`
  !function(f,b,e,v,n,t,s){
    if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)
  }(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');

  fbq('init', '787186935473680');
  fbq('track', 'PageView');
`}
</Script>

<Script
  src={`https://www.googletagmanager.com/gtag/js?id=SEU_GA_ID`}
  strategy="afterInteractive"
/>

<Script id="google-analytics" strategy="afterInteractive">
{`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'SEU_GA_ID');
`}
</Script>

      </body>
    </html>
  );
}