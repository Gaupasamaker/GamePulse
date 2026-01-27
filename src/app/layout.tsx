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
import { AuthProvider } from "@/providers/AuthProvider";

import { ThemeProvider } from "@/providers/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col bg-background-app text-foreground-app font-mono-app transition-colors duration-300">
        <ThemeProvider defaultTheme="dark" storageKey="gamepulse-theme">
          <LanguageProvider>
            <AuthProvider>
              <Disclaimer />
              <Header />
              <main className="flex-1 overflow-y-auto">
                {children}
              </main>
              <footer className="border-t border-border-app px-6 py-4 text-center text-[10px] font-mono text-muted-foreground-app">
                GAMEPULSE_BETA // 2026 // NO_FINANCIAL_ADVICE
              </footer>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
