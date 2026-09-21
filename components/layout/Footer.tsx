import React from "react";
import Link from "next/link";
import { Logo } from "../ui/Logo";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-bg-surface border-t border-border-default mt-auto py-12 text-text-secondary text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <Logo className="h-7 w-auto" />
            <p className="text-text-tertiary text-xs max-w-sm">
              Plataforma mobile-first para descoberta, organização e gestão de coleções de quadrinhos físicos no Brasil.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-xs font-semibold">
            <Link href="/" className="hover:text-text-primary transition-colors">
              Home
            </Link>
            <Link href="/explorar" className="hover:text-text-primary transition-colors">
              Explorar Catálogo
            </Link>
            <Link href="/colecao" className="hover:text-text-primary transition-colors">
              Minha Estante
            </Link>
            <Link href="/colecao?aba=wishlist" className="hover:text-text-primary transition-colors">
              Wishlist
            </Link>
          </div>
        </div>

        {/* Badges de Tecnologia & Fontes */}
        <div className="pt-6 border-t border-border-default/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-text-tertiary">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded bg-bg-elevated text-brand-primary font-bold">
              Google Antigravity v2.5.5
            </span>
            <span className="px-2 py-0.5 rounded bg-bg-elevated text-text-secondary">
              Gemini 3.8 Flash
            </span>
            <span className="px-2 py-0.5 rounded bg-bg-elevated text-text-secondary">
              Next.js 14 App Router
            </span>
          </div>

          <p>
            Fontes de catálogo: Panini Comics, Mythos Editora, Pipoca & Nanquim.
          </p>
        </div>
      </div>
    </footer>
  );
};
