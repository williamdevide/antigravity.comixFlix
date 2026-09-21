import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { CollectionProvider } from "@/lib/context/collection-context";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { ComicDetailModal } from "@/components/comic/ComicDetailModal";
import { ToastContainer } from "@/components/ui/Toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ComixFlix — O Streaming dos Quadrinhos Físicos",
  description:
    "Descubra, organize e acompanhe suas coleções de quadrinhos físicos da Panini, Mythos, Pipoca & Nanquim em uma experiência visual inspirada em streaming.",
  keywords: [
    "quadrinhos",
    "coleção de quadrinhos",
    "Panini",
    "Mythos",
    "Pipoca e Nanquim",
    "HQs",
    "estante virtual",
    "wishlist",
  ],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#141414",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`dark ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('comixflix_theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'light' || (!saved && !prefersDark)) {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-bg-canvas text-text-primary min-h-screen flex flex-col">
        <CollectionProvider>
          <Header />
          <main className="flex-1 w-full pb-20 md:pb-0">{children}</main>
          <ComicDetailModal />
          <ToastContainer />
          <Footer />
          <Suspense fallback={null}>
            <BottomNav />
          </Suspense>
        </CollectionProvider>
      </body>
    </html>
  );
}
