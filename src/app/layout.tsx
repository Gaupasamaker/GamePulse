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
  metadataBase: new URL("https://game-pulse-mauve.vercel.app"),
  title: "GamePulse | Gaming Business Intelligence",
  description: "Monitorización de empresas líderes del sector de videojuegos. Noticias, alertas y simulador de inversión.",
  manifest: "/manifest.json",
  keywords: ["Gaming", "Stocks", "Finance", "Investment", "Simulator", "Business", "Esports"],
  authors: [{ name: "GamePulse Team" }],
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://game-pulse-mauve.vercel.app/",
    title: "GamePulse | The Gaming Stock Market Tracker",
    description: "Analiza el mercado, gestiona tu portfolio virtual y compite en la GamePulse Arena.",
    siteName: "GamePulse",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GamePulse Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GamePulse | Gaming Market Intelligence",
    description: "Real-time gaming stocks, news, and portfolio simulation.",
    images: ["/og-image.png"],
    creator: "@GamePulseApp", // Placeholder
  },
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
