import React from "react";
import Link from "next/link";
import { Logo } from "../ui/Logo";
import { getAssetPath } from "@/lib/utils/asset";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-bg-surface border-t border-border-default mt-auto pt-10 pb-28 sm:pb-12 text-text-secondary text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col gap-3">
            {/* Logos ComixFlix e Empresa Desenvolvedora Lado a Lado */}
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/" className="shrink-0 flex items-center group" title="ComixFlix HQ Home">
                <Logo size="sm" className="transition-transform group-hover:scale-105" />
              </Link>

              <div className="h-4 w-[1px] bg-border-default hidden sm:block"></div>

              <Link
                href="/sobre"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-bg-elevated/70 hover:bg-bg-elevated border border-border-default hover:border-brand-primary/50 transition-all group cursor-pointer shadow-sm active:scale-95"
                title="Conheça a Milkfed Devs&&Reqs Lords - Sobre Nós"
              >
                <img
                  src={getAssetPath("/branding/logo-milkfed.png")}
                  alt="Milkfed Devs&&Reqs Lords"
                  className="w-4 h-4 object-contain opacity-85 group-hover:opacity-100 transition-opacity"
                />
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-text-tertiary group-hover:text-text-secondary transition-colors">
                    Dev por
                  </span>
                  <span className="text-xs font-semibold text-text-secondary group-hover:text-text-primary transition-colors">
                    Milkfed Devs&&Reqs Lords
                  </span>
                </div>
              </Link>
            </div>

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
            <Link href="/sobre" className="hover:text-text-primary text-brand-primary transition-colors">
              Sobre Nós
            </Link>
            <Link href="/termos" className="hover:text-text-primary transition-colors">
              Termos de Uso
            </Link>
            <Link href="/privacidade" className="hover:text-text-primary transition-colors">
              Privacidade
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

        {/* Linha de Copyright e Link Sobre Nós */}
        <div className="pt-4 border-t border-border-default/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-tertiary">
          <p>© {new Date().getFullYear()} ComixFlix HQ • Todos os direitos reservados.</p>
          <Link
            href="/sobre"
            className="text-[11px] text-text-tertiary hover:text-text-primary transition-colors flex items-center gap-1"
          >
            <span>Conheça a Milkfed Devs&&Reqs Lords</span>
            <span className="text-brand-primary font-bold">→</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};
