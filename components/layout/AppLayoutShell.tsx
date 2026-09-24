"use client";

import React, { ReactNode } from "react";
import { useAuth } from "@/lib/context/auth-context";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { BottomNav } from "./BottomNav";
import { Suspense } from "react";

export function AppLayoutShell({ children }: { children: ReactNode }) {
  const { user, isGuestMode, loading } = useAuth();
  const pathname = usePathname();

  // Na tela inicial de boas-vindas ("/") e páginas legais dedicadas ("/termos", "/privacidade"), o Header geral fica oculto
  const isWelcomeScreen = pathname === "/" && !user && !isGuestMode;
  const isLegalPage = pathname === "/termos" || pathname === "/privacidade";
  const hideMainHeader = isWelcomeScreen || isLegalPage;

  return (
    <>
      {!hideMainHeader && !loading && <Header />}
      <main className={`flex-1 w-full ${!isWelcomeScreen && !isLegalPage ? "pb-20 md:pb-0" : ""}`}>
        {children}
      </main>
      {!isWelcomeScreen && !isLegalPage && !loading && <Footer />}
      {!isWelcomeScreen && !isLegalPage && !loading && (
        <Suspense fallback={null}>
          <BottomNav />
        </Suspense>
      )}
    </>
  );
}
