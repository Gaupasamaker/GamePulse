import type { Metadata, Viewport } from "next";
import { Header } from "@/components/Header";
import { Disclaimer } from "@/components/Disclaimer";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0a0b",
};

export const metadata: Metadata = {
  title: "GamePulse | Gaming Business Intelligence",
  description: "Monitorización de empresas líderes del sector de videojuegos.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GamePulse",
  },
};

import { LanguageProvider } from "@/providers/LanguageProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col">
        <LanguageProvider>
          <Disclaimer />
          <Header />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
          <footer className="border-t border-border-app px-6 py-4 text-center text-[10px] font-mono text-gray-600">
            GAMEPULSE_BETA // 2026 // NO_FINANCIAL_ADVICE
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
