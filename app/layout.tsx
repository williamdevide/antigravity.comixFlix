import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/context/auth-context";
import { CollectionProvider } from "@/lib/context/collection-context";
import { AppLayoutShell } from "@/components/layout/AppLayoutShell";
import { ComicDetailModal } from "@/components/comic/ComicDetailModal";
import { AuthModal } from "@/components/auth/AuthModal";
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
  manifest: `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/manifest.json`,
  icons: {
    icon: [
      { url: `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/favicon.ico` },
      { url: `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/icon-192.png`, sizes: "192x192", type: "image/png" },
      { url: `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/icon-512.png`, sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/icon-192.png`, sizes: "192x192", type: "image/png" },
    ],
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
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
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
        <AuthProvider>
          <CollectionProvider>
            <AppLayoutShell>{children}</AppLayoutShell>
            <ComicDetailModal />
            <AuthModal />
            <ToastContainer />
          </CollectionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
